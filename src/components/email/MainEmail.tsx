import { WelcomeEmail } from "./templates/WelcomeEmail";
import { TaskPostedEmail } from "./templates/TaskPostedEmail";
import { TaskPostedNoBudgetEmail } from "./templates/TaskPostedNoBudgetEmail";
import { ProviderNewTaskEmail } from "./templates/ProviderNewTaskEmail";
import { ProviderEstimateEmail } from "./templates/ProviderEstimateEmail";
import { VerificationEmail } from "./templates/VerificationEmail";
import { PasswordResetEmail } from "./templates/PasswordResetEmail";
import { ProviderEmailCompose } from "./templates/ProviderEmailCompose";
export type { EmailType } from "./type";

interface AppEmailProps {
  type: import("./type").EmailType;
  username?: string;
  company?: string;
  verifyCode?: string;
  taskTitle?: string;
  taskLocation?: string;
  price?: string;
  unit?: string;
  messageFromProvider?: string;
  customer_userId?: string;
  professional_name?: string;
  professional_company_name?: string;
  professional_phone?: string;
}

const AppEmail = (props: AppEmailProps) => {
  switch (props.type) {
    case "welcome":
      return <WelcomeEmail username={props.username} company={props.company} />;
    case "task-posted":
      return (
        <TaskPostedEmail
          username={props.username}
          company={props.company}
          taskTitle={props.taskTitle}
          taskLocation={props.taskLocation}
        />
      );
    case "task-posted-no-budget":
      return (
        <TaskPostedNoBudgetEmail
          company={props.company}
          taskTitle={props.taskTitle}
          taskLocation={props.taskLocation}
        />
      );
    case "provider-new-task":
      return (
        <ProviderNewTaskEmail
          username={props.username}
          company={props.company}
          taskTitle={props.taskTitle}
          taskLocation={props.taskLocation}
        />
      );
    case "provider-estimate":
      return <ProviderEstimateEmail {...props} />;
    case "verification":
      return (
        <VerificationEmail
          company={props.company}
          verifyCode={props.verifyCode!}
        />
      );
    case "password-reset-code":
      return (
        <PasswordResetEmail
          username={props.username}
          company={props.company}
          verifyCode={props.verifyCode!}
        />
      );
      case "provider-email-compose":
      return(<ProviderEmailCompose {...props} />)
  }
}

export default AppEmail;
