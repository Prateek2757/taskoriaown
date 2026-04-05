import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { TaskPostedNoBudgetEmailProps } from "../type";

export const TaskPostedNoBudgetEmail = ({
  company = "Taskoria",
  taskTitle,
  taskLocation,
}: TaskPostedNoBudgetEmailProps) => (
  <Html>
    <Head>
      <title>Task Posted Without Budget</title>
    </Head>
    <Body
      style={{
        backgroundColor: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: "16px",
      }}
    >
      <Container
        style={{
          maxWidth: "600px",
          margin: "32px auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Section style={{ textAlign: "center" }}>
          <Img
            src="https://www.taskoria.com/images/taskoria_logo.svg"
            alt={`${company} Logo`}
            width="48"
            height="48"
            style={{ margin: "0 auto 24px" }}
          />
        </Section>

        <Heading
          style={{
            marginBottom: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          ⚠️ Task Posted Without Budget
        </Heading>

        <Text
          style={{
            marginBottom: "24px",
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
          }}
        >
          A task has been posted without specifying a budget. Task:{" "}
          {taskTitle ?? "Untitled Task"}
          {taskLocation ? ` — Location: ${taskLocation}` : ""}. Please review
          it.
        </Text>

        <Section style={{ margin: "32px 0", textAlign: "center" }}>
          <Button
            href="https://taskoria.com/admin/adminbudgetmanager"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: "600",
              textDecoration: "none",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            Review Task
          </Button>
        </Section>

        <Section
          style={{
            marginTop: "32px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "24px",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              margin: "8px 0",
            }}
          >
            © {new Date().getFullYear()} {company}. All rights reserved.
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              margin: "8px 0",
            }}
          >
            <Link
              href="https://www.taskoria.com/privacy-policy"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
            {" | "}
            <Link
              href="https://taskoria.com/terms-and-conditions"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              Terms of Service
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
