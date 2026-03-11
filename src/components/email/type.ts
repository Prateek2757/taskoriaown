export type EmailType =
  | "welcome"
  | "task-posted"
  | "task-posted-no-budget"
  | "provider-new-task"
  | "verification"
  | "provider-email-compose"
  | "password-reset-code"
  | "provider-estimate";

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
  professional_name?:string;
  professional_company_name?:string;
  professional_phone?:string;
}