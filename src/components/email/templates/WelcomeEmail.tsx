import {
    Body, Button, Container, Head, Heading,
    Html, Img, Link, Section, Text,
  } from "@react-email/components";
  import { WelcomeEmailProps } from "../type";
  
  export const WelcomeEmail = ({ username, company = "Taskoria" }: WelcomeEmailProps) => (
    <Html>
      <Head><title>Welcome to {company}</title></Head>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: "16px" }}>
        <Container style={{ maxWidth: "600px", margin: "32px auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
  
          <Section style={{ textAlign: "center" }}>
            <Img src="https://www.taskoria.com/taskorialogonew.png" alt={`${company} Logo`} width="48" height="48" style={{ margin: "0 auto 24px" }} />
          </Section>
  
          <Heading style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
            Welcome to {company}, {username ?? "there"}!
          </Heading>
  
          <Text style={{ marginBottom: "24px", fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
            We're excited to have you onboard. Find trusted professionals and get tasks done faster.
          </Text>
  
          <Section style={{ margin: "32px 0", textAlign: "center" }}>
            <Button href="https://www.taskoria.com" style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "12px 32px", fontSize: "16px", fontWeight: "600", textDecoration: "none", borderRadius: "8px", display: "inline-block" }}>
              Get Started
            </Button>
          </Section>
  
          <Section style={{ marginTop: "32px", borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
            <Text style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", margin: "8px 0" }}>
              © {new Date().getFullYear()} {company}. All rights reserved.
            </Text>
            <Text style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", margin: "8px 0" }}>
              <Link href="https://www.taskoria.com/privacy-policy" style={{ color: "#2563eb", textDecoration: "underline" }}>Privacy Policy</Link>
              {" | "}
              <Link href="https://taskoria.com/terms-and-conditions" style={{ color: "#2563eb", textDecoration: "underline" }}>Terms of Service</Link>
            </Text>
          </Section>
  
        </Container>
      </Body>
    </Html>
  );