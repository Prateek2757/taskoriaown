import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import {
  body,
  bodyCol,
  container,
  ctaButton,
  eyebrow,
  footerCol,
  footerLink,
  footerSection,
  footerText,
  heroCol,
  heroHeading,
  heroSection,
  heroSub,
  intro,
  outerWrapperCol,
  sigName,
  signOff,
  sigRole,
} from "../helpers/shared-style";
import type { ContactSubmissionAdminEmailProps } from "../type";

export const ContactSubmissionAdminEmail = ({
  company = "Taskoria",
  contactName,
  contactEmail,
  contactSubject,
  contactMessage,
  contactSubmissionId,
  contactAdminUrl = "https://www.taskoria.com/admin/contact-submissions",
}: ContactSubmissionAdminEmailProps) => (
  <Html lang="en">
    <Head>
      <title>New contact form submission - {company}</title>
    </Head>
    <Preview>
      {contactName} sent a {contactSubject} message through the contact form.
    </Preview>

    <Body style={body}>
      <Section style={{ backgroundColor: "#eef0f3" }}>
        <Row>
          <Column style={outerWrapperCol}>
            <Container style={container}>
              <Section style={heroSection}>
                <Row>
                  <Column style={heroCol}>
                    <Img
                      src="https://www.taskoria.com/images/taskoria_logo.svg"
                      alt={`${company} logo`}
                      width="44"
                      height="44"
                      style={{ display: "block", margin: "0 auto 18px" }}
                    />
                    <Text style={eyebrow}>Contact form</Text>
                    <Heading as="h1" style={heroHeading}>
                      New support message received.
                    </Heading>
                    <Text style={heroSub}>
                      Review the submission and reply from the admin dashboard.
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section>
                <Row>
                  <Column style={bodyCol}>
                    <Text style={intro}>
                      A new contact message was submitted on {company}.
                    </Text>

                    <Section style={detailsBox}>
                      <Row>
                        <Column style={detailsCol}>
                          <Text style={label}>Name</Text>
                          <Text style={value}>{contactName}</Text>
                          <Text style={label}>Email</Text>
                          <Text style={value}>
                            <Link href={`mailto:${contactEmail}`} style={link}>
                              {contactEmail}
                            </Link>
                          </Text>
                          <Text style={label}>Subject</Text>
                          <Text style={value}>{contactSubject}</Text>
                          {contactSubmissionId && (
                            <>
                              <Text style={label}>Submission ID</Text>
                              <Text style={value}>#{contactSubmissionId}</Text>
                            </>
                          )}
                        </Column>
                      </Row>
                    </Section>

                    <Text style={messageHeading}>Message</Text>
                    <Section style={messageBox}>
                      <Row>
                        <Column style={messageCol}>
                          {contactMessage.split("\n").map((line, index) =>
                            line.trim() ? (
                              <Text key={index} style={messageLine}>
                                {line}
                              </Text>
                            ) : (
                              <Text key={index} style={messageLine}>
                                &nbsp;
                              </Text>
                            )
                          )}
                        </Column>
                      </Row>
                    </Section>

                    <Section style={{ textAlign: "center", margin: "28px 0" }}>
                      <Button href={contactAdminUrl} style={ctaButton}>
                        Open Contact Messages
                      </Button>
                    </Section>

                    <Text style={signOff}>
                      You can also reply directly to this email to respond to
                      the sender.
                    </Text>
                    <Text style={signOff}>Regards,</Text>
                    <Text style={sigName}>The {company} Team</Text>
                    <Text style={sigRole}>contact@taskoria.com</Text>
                  </Column>
                </Row>
              </Section>

              <Section style={footerSection}>
                <Row>
                  <Column style={footerCol}>
                    <Text style={footerText}>
                      © {new Date().getFullYear()} {company}. All rights
                      reserved.
                    </Text>
                    <Text style={footerText}>
                      <Link
                        href="https://www.taskoria.com/privacy-policy"
                        style={footerLink}
                      >
                        Privacy Policy
                      </Link>
                      {" · "}
                      <Link
                        href="https://www.taskoria.com/terms-and-conditions"
                        style={footerLink}
                      >
                        Terms of Service
                      </Link>
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Container>
          </Column>
        </Row>
      </Section>
    </Body>
  </Html>
);

const detailsBox = {
  backgroundColor: "#f8fafc",
  borderTop: "1px solid #e2e8f0",
  borderRight: "1px solid #e2e8f0",
  borderBottom: "1px solid #e2e8f0",
  borderLeft: "1px solid #e2e8f0",
  borderRadius: "10px",
  margin: "0 0 24px",
};

const detailsCol = {
  padding: "18px 20px",
};

const label = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const value = {
  color: "#0f172a",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: "0 0 14px",
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
};

const messageHeading = {
  color: "#1a2236",
  fontSize: "15px",
  fontWeight: "bold",
  margin: "0 0 10px",
};

const messageBox = {
  backgroundColor: "#ffffff",
  borderTop: "1px solid #dbeafe",
  borderRight: "1px solid #dbeafe",
  borderBottom: "1px solid #dbeafe",
  borderLeft: "1px solid #dbeafe",
  borderRadius: "10px",
  margin: "0 0 24px",
};

const messageCol = {
  padding: "18px 20px",
};

const messageLine = {
  color: "#334155",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 8px",
};
