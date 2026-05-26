export type EmailType =
  | "welcome"
  | "task-posted"
  | "task-posted-no-budget"
  | "provider-new-task"
  | "verification"
  | "provider-email-compose"
  | "password-reset-code"
  | "provider-estimate"
  | "complete-profile"; // ← new

export interface BaseEmailProps {
  company?: string;
  username?: string;
}

export interface WelcomeEmailProps extends BaseEmailProps {}

export interface TaskPostedEmailProps extends BaseEmailProps {
  taskTitle?: string;
  taskLocation?: string;
}

export interface ProviderNewTaskEmailProps extends BaseEmailProps {
  taskTitle?: string;
  taskLocation?: string;
}

export interface TaskPostedNoBudgetEmailProps extends BaseEmailProps {
  taskTitle?: string;
  taskLocation?: string;
}

export interface VerificationEmailProps extends BaseEmailProps {
  verifyCode: string;
}

export interface PasswordResetEmailProps extends BaseEmailProps {
  verifyCode: string;
}

export interface ProviderEstimateEmailProps extends BaseEmailProps {
  taskTitle?: string;
  price?: string;
  unit?: string;
  messageFromProvider?: string;
  professional_name?: string;
  professional_company_name?: string;
  professional_phone?: string;
}

// ── Profile completion ────────────────────────────────────
export interface ProfileFlags {
  hasAboutAndBio: boolean;      // display_name set + company.about >= 30 chars → +25%
  hasServices: boolean;         // user_profile_services exists                 → +20%
  hasPhotos: boolean;           // user_profile_photos exists                   → +25%
  hasSocialLinks: boolean;      // user_social_links with is_visible = true     → +10%
  hasAccreditations: boolean;   // user_accreditations exists                   → +10%
  hasFaqs: boolean;             // user_faqs with is_visible = true             → +10%
}

export interface CompleteProfileEmailProps extends BaseEmailProps {
  completionPercent: number;
  profileFlags: ProfileFlags;
  profileUrl?: string;
}