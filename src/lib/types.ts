// Policy Types
export type PolicyType = "privacy" | "terms" | "eula" | "cookies";

export type Language = "en" | "es" | "fr" | "de" | "pt" | "it" | "nl" | "pl";

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
];

export const POLICY_TYPES: { type: PolicyType; name: string; description: string }[] = [
  { type: "privacy", name: "Privacy Policy", description: "GDPR & CCPA compliant privacy policy" },
  { type: "terms", name: "Terms of Service", description: "Legal terms and conditions" },
  { type: "eula", name: "EULA", description: "End User License Agreement for software" },
  { type: "cookies", name: "Cookie Policy", description: "Cookie policy with consent banner" },
];

// Wizard Answer Types
export interface BusinessInfo {
  businessName: string;
  businessType: string;
  websiteUrl: string;
  contactEmail: string;
}

export interface GeographicScope {
  hasEUUsers: boolean;
  hasCAUsers: boolean;
  businessLocation: string;
}

export interface DataCollection {
  dataTypes: string[];
  collectionMethods: string[];
  collectsChildrenData: boolean;
  collectsSensitiveData: boolean;
  retentionPeriod: string;
}

export interface DataUse {
  purposes: string[];
  automatedDecisionMaking: boolean;
  sellsData: boolean;
}

export interface ThirdPartyServices {
  services: string[];
  otherThirdParties: string;
}

export interface UserRights {
  requestMethod: string;
  responseTime: string;
}

export interface SecurityMeasures {
  measures: string[];
  hadBreach: boolean;
}

export interface PrivacyWizardAnswers {
  businessInfo: BusinessInfo;
  geographicScope: GeographicScope;
  dataCollection: DataCollection;
  dataUse: DataUse;
  thirdPartyServices: ThirdPartyServices;
  userRights: UserRights;
  securityMeasures: SecurityMeasures;
}

// Terms of Service specific
export interface TermsServiceInfo {
  serviceType: string;
  hasFreeTier: boolean;
  hasPayments: boolean;
  hasAccounts: boolean;
  hasUserContent: boolean;
  prohibitedActivities: string[];
  disputeResolution: string;
  governingLaw: string;
}

export interface TermsWizardAnswers extends PrivacyWizardAnswers {
  serviceInfo: TermsServiceInfo;
}

// EULA specific
export interface EulaInfo {
  softwareName: string;
  softwareType: string;
  licenseType: string;
  canRedistribute: boolean;
  sourceCodeAccess: string;
  autoUpdates: boolean;
  collectsData: boolean;
  supportTerms: string;
  terminationConditions: string[];
}

export interface EulaWizardAnswers extends PrivacyWizardAnswers {
  eulaInfo: EulaInfo;
}

// Cookie specific
export interface CookieInfo {
  cookieTypes: string[];
  cookieDetails: {
    name: string;
    purpose: string;
    expiration: string;
    provider: string;
  }[];
  usesThirdPartyCookies: boolean;
  consentMechanism: string;
}

export interface CookieWizardAnswers extends PrivacyWizardAnswers {
  cookieInfo: CookieInfo;
}

// Banner config
export interface BannerConfig {
  position: "bottom" | "top" | "center";
  theme: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
  text: {
    title: string;
    description: string;
    acceptAll: string;
    rejectAll: string;
    customize: string;
  };
}

// Wizard step definition
export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export const PRIVACY_WIZARD_STEPS: WizardStep[] = [
  { id: "business", title: "Business Info", description: "Tell us about your business" },
  { id: "geographic", title: "Geographic Scope", description: "Where are your users located?" },
  { id: "collection", title: "Data Collection", description: "What data do you collect?" },
  { id: "use", title: "Data Use", description: "How do you use the data?" },
  { id: "thirdparty", title: "Third Parties", description: "What services do you use?" },
  { id: "rights", title: "User Rights", description: "How can users exercise their rights?" },
  { id: "security", title: "Security", description: "How do you protect data?" },
];

// Options for wizard fields
export const DATA_TYPES = [
  "Name",
  "Email address",
  "Phone number",
  "Mailing address",
  "Payment/billing information",
  "IP address",
  "Device/browser information",
  "Location data",
  "Account credentials",
  "Usage data/analytics",
  "User-generated content",
];

export const COLLECTION_METHODS = [
  "User-submitted forms",
  "Automatic collection (cookies, logs)",
  "Third-party integrations",
  "Purchases/transactions",
];

export const DATA_PURPOSES = [
  "Provide core services/features",
  "Process payments",
  "Send transactional emails",
  "Send marketing/promotional emails",
  "Analytics and improvement",
  "Personalization",
  "Legal compliance",
  "Customer support",
  "Fraud prevention",
];

export const THIRD_PARTY_SERVICES = [
  "Google Analytics",
  "Stripe",
  "PayPal",
  "Mailchimp",
  "SendGrid",
  "AWS/Google Cloud/Azure",
  "Facebook Pixel",
  "Google Ads",
  "Intercom/Zendesk",
];

export const SECURITY_MEASURES = [
  "SSL/TLS encryption",
  "Data encryption at rest",
  "Access controls",
  "Regular security audits",
  "Two-factor authentication",
];

export const RETENTION_PERIODS = [
  { value: "deletion", label: "Until account deletion" },
  { value: "1year", label: "1 year" },
  { value: "2years", label: "2 years" },
  { value: "5years", label: "5 years" },
  { value: "legal", label: "As required by law" },
];

export const RESPONSE_TIMES = [
  { value: "24hours", label: "24 hours" },
  { value: "48hours", label: "48 hours" },
  { value: "7days", label: "7 days" },
  { value: "30days", label: "30 days" },
];

export const BUSINESS_TYPES = [
  "SaaS",
  "E-commerce",
  "Blog/Content",
  "Mobile App",
  "Agency/Portfolio",
  "Marketplace",
  "Other",
];

export const COOKIE_TYPES = [
  "Essential/necessary cookies",
  "Analytics cookies",
  "Marketing/advertising cookies",
  "Functional cookies",
  "Social media cookies",
];

// Terms of Service options
export const SERVICE_TYPES = [
  "Web application",
  "Mobile application",
  "Desktop software",
  "API/Platform",
  "Marketplace",
  "Content platform",
  "E-commerce",
];

export const PROHIBITED_ACTIVITIES = [
  "Illegal activities",
  "Harassment or abuse",
  "Spam or bulk messaging",
  "Infringing intellectual property",
  "Reverse engineering",
  "Automated data scraping",
  "Circumventing security",
  "Creating fake accounts",
];

export const DISPUTE_RESOLUTIONS = [
  { value: "arbitration", label: "Binding Arbitration" },
  { value: "mediation", label: "Mediation first, then litigation" },
  { value: "litigation", label: "Direct litigation" },
  { value: "smallclaims", label: "Small claims court for small amounts" },
];

// EULA options
export const SOFTWARE_TYPES = [
  "Desktop application",
  "Mobile application",
  "Web application",
  "CLI tool",
  "Browser extension",
  "Plugin/Add-on",
];

export const LICENSE_TYPES = [
  { value: "perpetual", label: "Perpetual license (one-time purchase)" },
  { value: "subscription", label: "Subscription-based license" },
  { value: "freemium", label: "Freemium with paid upgrades" },
  { value: "trial", label: "Trial/demo with purchase option" },
];

export const SOURCE_CODE_OPTIONS = [
  { value: "none", label: "No source code access" },
  { value: "partial", label: "Partial source code (API, plugins)" },
  { value: "full", label: "Full source code access" },
];

export const SUPPORT_TERMS = [
  { value: "none", label: "No support included" },
  { value: "email", label: "Email support only" },
  { value: "basic", label: "Basic support (limited hours)" },
  { value: "premium", label: "Premium support (24/7)" },
];

export const TERMINATION_CONDITIONS = [
  "User requests termination",
  "Payment failure",
  "Violation of terms",
  "Account inactivity",
  "Company discretion",
  "End of product lifecycle",
];

// Cookie consent options
export const CONSENT_MECHANISMS = [
  { value: "optin", label: "Opt-in (explicit consent required)" },
  { value: "optout", label: "Opt-out (implied consent with reject option)" },
  { value: "essential", label: "Essential only (no consent needed)" },
];

// Wizard steps for each policy type
export const TERMS_WIZARD_STEPS: WizardStep[] = [
  { id: "business", title: "Business Info", description: "Tell us about your business" },
  { id: "service", title: "Service Details", description: "What type of service do you offer?" },
  { id: "accounts", title: "User Accounts", description: "Account and payment policies" },
  { id: "content", title: "User Content", description: "Content and intellectual property" },
  { id: "prohibited", title: "Prohibited Uses", description: "What users cannot do" },
  { id: "liability", title: "Liability & Disputes", description: "Limitations and dispute resolution" },
];

export const EULA_WIZARD_STEPS: WizardStep[] = [
  { id: "business", title: "Business Info", description: "Your company information" },
  { id: "software", title: "Software Details", description: "About your software" },
  { id: "license", title: "License Terms", description: "What the license permits" },
  { id: "restrictions", title: "Restrictions", description: "What users cannot do" },
  { id: "support", title: "Updates & Support", description: "Updates and support terms" },
  { id: "termination", title: "Termination", description: "When the license can end" },
];

export const COOKIE_WIZARD_STEPS: WizardStep[] = [
  { id: "business", title: "Business Info", description: "Your website information" },
  { id: "cookies", title: "Cookie Types", description: "What cookies you use" },
  { id: "thirdparty", title: "Third-Party Cookies", description: "External cookie providers" },
  { id: "consent", title: "Consent", description: "How you obtain consent" },
  { id: "banner", title: "Banner Design", description: "Customize your cookie banner" },
];
