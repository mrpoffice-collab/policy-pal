import Anthropic from "@anthropic-ai/sdk";
import type { PrivacyWizardAnswers, TermsWizardAnswers, EulaWizardAnswers, CookieWizardAnswers, PolicyType, Language } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generatePrivacyPolicy(
  answers: PrivacyWizardAnswers,
  language: Language = "en"
): Promise<string> {
  const prompt = buildPrivacyPrompt(answers, language);
  return await generateWithClaude(prompt);
}

export async function generateTermsOfService(
  answers: TermsWizardAnswers,
  language: Language = "en"
): Promise<string> {
  const prompt = buildTermsPrompt(answers, language);
  return await generateWithClaude(prompt);
}

export async function generateEula(
  answers: EulaWizardAnswers,
  language: Language = "en"
): Promise<string> {
  const prompt = buildEulaPrompt(answers, language);
  return await generateWithClaude(prompt);
}

export async function generateCookiePolicy(
  answers: CookieWizardAnswers,
  language: Language = "en"
): Promise<string> {
  const prompt = buildCookiePrompt(answers, language);
  return await generateWithClaude(prompt);
}

async function generateWithClaude(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }
  throw new Error("Unexpected response from Claude");
}

function buildPrivacyPrompt(answers: PrivacyWizardAnswers, language: Language): string {
  const { businessInfo, geographicScope, dataCollection, dataUse, thirdPartyServices, userRights, securityMeasures } = answers;

  const languageInstruction = language !== "en"
    ? `Generate this policy in ${getLanguageName(language)}. Use proper legal terminology in that language.`
    : "";

  return `Generate a comprehensive, legally-sound privacy policy for the following business. The policy should be professional, clear, and compliant with applicable laws.

${languageInstruction}

## Business Information
- Business Name: ${businessInfo.businessName}
- Business Type: ${businessInfo.businessType}
- Website URL: ${businessInfo.websiteUrl}
- Contact Email: ${businessInfo.contactEmail}

## Geographic Scope
- Has EU Users: ${geographicScope.hasEUUsers ? "Yes (include GDPR compliance)" : "No"}
- Has California Users: ${geographicScope.hasCAUsers ? "Yes (include CCPA/CPRA compliance)" : "No"}
- Business Location: ${geographicScope.businessLocation}

## Data Collection
- Data Types Collected: ${dataCollection.dataTypes.join(", ")}
- Collection Methods: ${dataCollection.collectionMethods.join(", ")}
- Collects Children's Data: ${dataCollection.collectsChildrenData ? "Yes (include COPPA compliance)" : "No"}
- Collects Sensitive Data: ${dataCollection.collectsSensitiveData ? "Yes" : "No"}
- Data Retention Period: ${dataCollection.retentionPeriod}

## Data Use
- Purposes: ${dataUse.purposes.join(", ")}
- Automated Decision Making: ${dataUse.automatedDecisionMaking ? "Yes" : "No"}
- Sells/Shares Data for Advertising: ${dataUse.sellsData ? "Yes" : "No"}

## Third-Party Services
- Services Used: ${thirdPartyServices.services.join(", ")}
- Other Third Parties: ${thirdPartyServices.otherThirdParties || "None"}

## User Rights
- Request Method: ${userRights.requestMethod}
- Response Time: ${userRights.responseTime}

## Security Measures
- Security Measures: ${securityMeasures.measures.join(", ")}

## Requirements
1. Include a clear introduction stating what this policy covers
2. Use section headings for easy navigation
3. ${geographicScope.hasEUUsers ? "Include a comprehensive GDPR rights section (Right to Access, Rectification, Erasure, Portability, Object, Restrict Processing)" : ""}
4. ${geographicScope.hasCAUsers ? "Include California Privacy Rights section with 'Do Not Sell My Personal Information' language" : ""}
5. ${dataCollection.collectsChildrenData ? "Include COPPA compliance section" : ""}
6. Include a 'Last Updated' placeholder: [LAST_UPDATED_DATE]
7. Be specific about each third-party service mentioned
8. Use professional legal language but keep it readable
9. Include contact information section at the end

Generate ONLY the privacy policy text, no additional commentary.`;
}

function buildTermsPrompt(answers: TermsWizardAnswers, language: Language): string {
  const { businessInfo, serviceInfo } = answers;

  const languageInstruction = language !== "en"
    ? `Generate this policy in ${getLanguageName(language)}. Use proper legal terminology in that language.`
    : "";

  return `Generate comprehensive Terms of Service for the following business. The terms should be professional, legally sound, and protect both the business and users.

${languageInstruction}

## Business Information
- Business Name: ${businessInfo.businessName}
- Website URL: ${businessInfo.websiteUrl}
- Contact Email: ${businessInfo.contactEmail}

## Service Information
- Service Type: ${serviceInfo.serviceType}
- Has Free Tier: ${serviceInfo.hasFreeTier ? "Yes" : "No"}
- Has Payments: ${serviceInfo.hasPayments ? "Yes" : "No"}
- Has User Accounts: ${serviceInfo.hasAccounts ? "Yes" : "No"}
- Has User-Generated Content: ${serviceInfo.hasUserContent ? "Yes" : "No"}
- Prohibited Activities: ${serviceInfo.prohibitedActivities.join(", ")}
- Dispute Resolution: ${serviceInfo.disputeResolution}
- Governing Law: ${serviceInfo.governingLaw}

## Required Sections
1. Agreement to Terms
2. Description of Service
${serviceInfo.hasAccounts ? "3. Account Registration and Responsibilities" : ""}
${serviceInfo.hasPayments ? "4. Payment Terms and Billing" : ""}
${serviceInfo.hasUserContent ? "5. User Content and Conduct Guidelines" : ""}
6. Prohibited Activities (be specific)
7. Intellectual Property Rights
8. Disclaimers and Limitation of Liability
9. Indemnification
10. Termination
11. Dispute Resolution (${serviceInfo.disputeResolution})
12. Governing Law (${serviceInfo.governingLaw})
13. Changes to Terms
14. Contact Information

Include a 'Last Updated' placeholder: [LAST_UPDATED_DATE]

Generate ONLY the terms of service text, no additional commentary.`;
}

function buildEulaPrompt(answers: EulaWizardAnswers, language: Language): string {
  const { businessInfo, eulaInfo } = answers;

  const languageInstruction = language !== "en"
    ? `Generate this EULA in ${getLanguageName(language)}. Use proper legal terminology in that language.`
    : "";

  return `Generate a comprehensive End User License Agreement (EULA) for the following software. The EULA should be professional and legally sound.

${languageInstruction}

## Software Information
- Software Name: ${eulaInfo.softwareName}
- Developer/Company: ${businessInfo.businessName}
- Software Type: ${eulaInfo.softwareType}
- License Type: ${eulaInfo.licenseType}

## License Terms
- Can Redistribute: ${eulaInfo.canRedistribute ? "Yes" : "No"}
- Source Code Access: ${eulaInfo.sourceCodeAccess}
- Automatic Updates: ${eulaInfo.autoUpdates ? "Yes" : "No"}
- Collects User Data: ${eulaInfo.collectsData ? "Yes" : "No"}
- Support Terms: ${eulaInfo.supportTerms}
- Termination Conditions: ${eulaInfo.terminationConditions.join(", ")}

## Contact
- Contact Email: ${businessInfo.contactEmail}
- Website: ${businessInfo.websiteUrl}

## Required Sections
1. License Grant (scope and limitations)
2. Restrictions on Use
3. Intellectual Property Rights
4. User Data and Privacy (if applicable)
5. Updates and Modifications
6. Support and Maintenance
7. Warranty Disclaimer
8. Limitation of Liability
9. Termination
10. Governing Law
11. Contact Information

Include a 'Last Updated' placeholder: [LAST_UPDATED_DATE]

Generate ONLY the EULA text, no additional commentary.`;
}

function buildCookiePrompt(answers: CookieWizardAnswers, language: Language): string {
  const { businessInfo, cookieInfo } = answers;

  const languageInstruction = language !== "en"
    ? `Generate this cookie policy in ${getLanguageName(language)}. Use proper legal terminology in that language.`
    : "";

  const cookieDetailsTable = cookieInfo.cookieDetails.length > 0
    ? cookieInfo.cookieDetails.map(c => `- ${c.name}: ${c.purpose} (Expires: ${c.expiration}, Provider: ${c.provider})`).join("\n")
    : "No specific cookies detailed";

  return `Generate a comprehensive Cookie Policy for the following website. The policy should be GDPR-compliant and clearly explain cookie usage.

${languageInstruction}

## Website Information
- Business Name: ${businessInfo.businessName}
- Website URL: ${businessInfo.websiteUrl}
- Contact Email: ${businessInfo.contactEmail}

## Cookie Information
- Cookie Types Used: ${cookieInfo.cookieTypes.join(", ")}
- Uses Third-Party Cookies: ${cookieInfo.usesThirdPartyCookies ? "Yes" : "No"}
- Consent Mechanism: ${cookieInfo.consentMechanism}

## Cookie Details
${cookieDetailsTable}

## Required Sections
1. What Are Cookies (brief explanation)
2. How We Use Cookies
3. Types of Cookies We Use (include a table format)
4. Third-Party Cookies (if applicable)
5. Managing Your Cookie Preferences
6. Changes to This Cookie Policy
7. Contact Us

Include a 'Last Updated' placeholder: [LAST_UPDATED_DATE]

Generate ONLY the cookie policy text, no additional commentary.`;
}

function getLanguageName(code: Language): string {
  const languages: Record<Language, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    pt: "Portuguese",
    it: "Italian",
    nl: "Dutch",
    pl: "Polish",
  };
  return languages[code];
}

export async function translatePolicy(
  content: string,
  targetLanguage: Language
): Promise<string> {
  const prompt = `Translate the following legal document to ${getLanguageName(targetLanguage)}.
Maintain proper legal terminology and formatting. Keep all section headings and structure intact.
Do not add any commentary, just provide the translation.

${content}`;

  return await generateWithClaude(prompt);
}
