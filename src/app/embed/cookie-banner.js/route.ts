import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const policyId = searchParams.get("id");

  if (!policyId) {
    return new NextResponse("// PolicyPal: Missing policy ID", {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  // Get banner config
  const banner = await prisma.cookieBanner.findUnique({
    where: { policyId },
    include: {
      policy: {
        select: {
          hostedSlug: true,
          org: { select: { name: true } },
        },
      },
    },
  });

  if (!banner) {
    return new NextResponse("// PolicyPal: Banner not configured", {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  const theme = banner.theme as Record<string, string>;
  const text = banner.text as Record<string, string>;
  const policyUrl = banner.policy.hostedSlug ? `/p/${banner.policy.hostedSlug}` : "";
  const apiBase = process.env.NEXTAUTH_URL || "https://policypal.com";

  const script = `
(function() {
  // PolicyPal Cookie Consent Banner
  const CONFIG = {
    policyId: "${policyId}",
    position: "${banner.position}",
    theme: ${JSON.stringify(theme)},
    text: ${JSON.stringify(text)},
    policyUrl: "${apiBase}${policyUrl}",
    apiBase: "${apiBase}"
  };

  // Check if consent already given
  const storedConsent = localStorage.getItem('pp_consent_${policyId}');
  if (storedConsent) return;

  // Create banner HTML
  const createBanner = () => {
    const banner = document.createElement('div');
    banner.id = 'pp-cookie-banner';
    banner.style.cssText = \`
      position: fixed;
      \${CONFIG.position === 'top' ? 'top: 0' : CONFIG.position === 'center' ? 'top: 50%; transform: translateY(-50%)' : 'bottom: 0'};
      left: 0;
      right: 0;
      background: \${CONFIG.theme.backgroundColor || '#1f2937'};
      color: \${CONFIG.theme.textColor || '#ffffff'};
      padding: 16px 24px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.1);
      \${CONFIG.position === 'center' ? 'max-width: 500px; margin: 0 auto; border-radius: 12px;' : ''}
    \`;

    banner.innerHTML = \`
      <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; justify-content: space-between;">
        <div style="flex: 1; min-width: 200px;">
          <p style="margin: 0 0 8px; font-weight: 600;">\${CONFIG.text.title || 'We use cookies'}</p>
          <p style="margin: 0; opacity: 0.9;">\${CONFIG.text.description || 'We use cookies to enhance your browsing experience.'}</p>
          \${CONFIG.policyUrl ? \`<a href="\${CONFIG.policyUrl}" target="_blank" style="color: \${CONFIG.theme.textColor || '#fff'}; opacity: 0.8; text-decoration: underline; font-size: 13px;">Learn more</a>\` : ''}
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button id="pp-reject" style="
            padding: 10px 20px;
            border: 1px solid \${CONFIG.theme.textColor || '#fff'};
            background: transparent;
            color: \${CONFIG.theme.textColor || '#fff'};
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">\${CONFIG.text.rejectAll || 'Reject All'}</button>
          <button id="pp-accept" style="
            padding: 10px 20px;
            border: none;
            background: \${CONFIG.theme.buttonColor || '#3b82f6'};
            color: \${CONFIG.theme.buttonTextColor || '#fff'};
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">\${CONFIG.text.acceptAll || 'Accept All'}</button>
        </div>
      </div>
    \`;

    document.body.appendChild(banner);

    // Event handlers
    document.getElementById('pp-accept').onclick = () => handleConsent(true);
    document.getElementById('pp-reject').onclick = () => handleConsent(false);
  };

  // Handle consent
  const handleConsent = async (accepted) => {
    const consent = {
      essential: true,
      analytics: accepted,
      marketing: accepted,
      functional: accepted,
      timestamp: new Date().toISOString()
    };

    // Store locally
    localStorage.setItem('pp_consent_${policyId}', JSON.stringify(consent));

    // Log to server
    try {
      await fetch(CONFIG.apiBase + '/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyId: CONFIG.policyId,
          consentGiven: consent,
          visitorId: localStorage.getItem('pp_visitor_id')
        })
      });
    } catch (e) {
      console.log('PolicyPal: Could not log consent');
    }

    // Remove banner
    document.getElementById('pp-cookie-banner').remove();

    // Dispatch event
    window.dispatchEvent(new CustomEvent('pp:consent', { detail: consent }));
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBanner);
  } else {
    createBanner();
  }
})();
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
