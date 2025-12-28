import Link from "next/link";
import {
  Shield,
  FileText,
  Globe,
  RefreshCw,
  Users,
  Zap,
  Check,
  ArrowRight,
  Cookie,
  Scale,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PolicyPal</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/generate"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <RefreshCw className="w-4 h-4" />
            Auto-updates when laws change
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Legal Policies
            <br />
            <span className="text-blue-600">in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            GDPR & CCPA compliant privacy policies, terms of service, EULAs, and
            cookie policies. AI-powered customization for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              See Features
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Generate your first policy free.
          </p>
        </div>
      </section>

      {/* Policy Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            All the legal documents you need
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Privacy Policy",
                desc: "GDPR & CCPA compliant",
              },
              {
                icon: Scale,
                title: "Terms of Service",
                desc: "Protect your business",
              },
              {
                icon: Shield,
                title: "EULA",
                desc: "Software licensing",
              },
              {
                icon: Cookie,
                title: "Cookie Policy",
                desc: "With consent banner",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center"
              >
                <item.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              PolicyPal goes beyond simple templates. Get AI-powered customization,
              automatic updates, and team collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Generation",
                desc: "Answer simple questions about your business. Our AI creates customized, legally-sound policies tailored to your needs.",
              },
              {
                icon: RefreshCw,
                title: "Auto-Updates",
                desc: "Privacy laws change. PolicyPal tracks GDPR, CCPA, and more. Get notified and update your policies with one click.",
              },
              {
                icon: Globe,
                title: "8 Languages",
                desc: "Generate policies in English, Spanish, French, German, Portuguese, Italian, Dutch, and Polish.",
              },
              {
                icon: Shield,
                title: "Hosted Pages",
                desc: "Get instant public URLs for your policies. No hosting required. Professional design included.",
              },
              {
                icon: Users,
                title: "Team Accounts",
                desc: "Invite team members with role-based permissions. Perfect for agencies managing multiple clients.",
              },
              {
                icon: Cookie,
                title: "Cookie Banner",
                desc: "Generate a customizable cookie consent banner. GDPR-compliant with consent logging.",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl border border-gray-200">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <p className="text-gray-600 mt-1">Get started</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "1 policy (any type)",
                  "Copy & download",
                  "English only",
                  "Basic templates",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/generate"
                className="mt-8 block w-full py-3 text-center bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 p-8 rounded-xl border-2 border-blue-600 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-800 text-white text-xs font-medium rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <p className="text-blue-100 mt-1">For growing businesses</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$12</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited policies",
                  "All document types",
                  "Hosted pages",
                  "Compliance badge",
                  "Auto-update alerts",
                  "3 languages",
                  "3 team members",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-blue-200" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/generate"
                className="mt-8 block w-full py-3 text-center bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Start 14-Day Trial
              </Link>
            </div>

            {/* Business */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Business</h3>
              <p className="text-gray-600 mt-1">For teams & agencies</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Everything in Pro",
                  "All 8 languages",
                  "Custom subdomain",
                  "Unlimited team members",
                  "API access",
                  "White-label options",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/generate"
                className="mt-8 block w-full py-3 text-center bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Start 14-Day Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get compliant?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Generate your first policy in under 10 minutes. No credit card required.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Free Policy
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-bold text-white">PolicyPal</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PolicyPal. Not legal advice.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
