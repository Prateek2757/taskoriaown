import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties } from "react";

import { ProviderNewTaskEmailProps } from "../type";
import {
  body,
  bodyCol,
  ctaButton,
  divider,
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

export const ProviderNewTaskEmail = ({
  username,
  company = "Taskoria",
  taskTitle,
  taskLocation,
}: ProviderNewTaskEmailProps) => (
  <Html lang="en">
    <Head>
      <title>New task available — {company}</title>
    </Head>

    <Body style={body}>
      <Section style={{ backgroundColor: "#eef0f3" }}>
        <Row>
          <Column style={outerWrapperCol}>
            <Container style={{
              maxWidth: "560px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              borderTop: "1px solid #d4d8de",
              borderRight: "1px solid #d4d8de",
              borderBottom: "1px solid #d4d8de",
              borderLeft: "1px solid #d4d8de",
            }}>

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
                    <Text style={eyebrow}>New opportunity</Text>
                    <Heading as="h1" style={heroHeading}>
                      A task matches your skills!
                    </Heading>
                    <Text style={heroSub}>
                      Submit your quote early — early applicants get more views.
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section>
                <Row>
                  <Column style={bodyCol}>

                    <Text style={intro}>
                      Hi{" "}
                      <strong style={{ color: "#1a2236" }}>
                        {username ?? "there"}
                      </strong>
                      ! A new task{" "}
                      <strong style={{ color: "#1a2236" }}>
                        &ldquo;{taskTitle ?? "Untitled Task"}&rdquo;
                      </strong>
                      {taskLocation ? (
                        <> in <strong style={{ color: "#1a2236" }}>{taskLocation}</strong></>
                      ) : null}{" "}
                      matches your service category. Submit your quotation early
                      to increase your chances of being selected.
                    </Text>

                    <Section style={taskCardSection}>
                      <Row>
                        <Column style={taskCardCol}>
                          <Text style={taskCardLabel}>Task title</Text>
                          <Text style={taskCardValue}>
                            {taskTitle ?? "Untitled Task"}
                          </Text>
                          {taskLocation ? (
                            <>
                              <Text style={taskCardLabel}>Location</Text>
                              <Text style={taskCardValue}>{taskLocation}</Text>
                            </>
                          ) : null}
                          <Text style={taskCardLabel}>Match</Text>
                          <Text style={taskMatchBadge}>✓ Matches your category</Text>
                        </Column>
                      </Row>
                    </Section>

                    <Text style={spacer}>&nbsp;</Text>
                    <Section style={tipSection}>
                      <Row>
                        <Column style={tipCol}>
                          <Text style={tipText}>
                            💡 <strong>Pro tip:</strong> Providers who quote
                            within the first hour are 3× more likely to be hired.
                          </Text>
                        </Column>
                      </Row>
                    </Section>

                    <Text style={spacer}>&nbsp;</Text>

                    <Row>
                      <Column style={ctaCol}>
                        <Button
                          href="https://www.taskoria.com/provider/leads"
                          style={ctaButton}
                        >
                          View &amp; Quote this task →
                        </Button>
                        <Text style={ctaSub}>
                          Log in to submit your quotation
                        </Text>
                      </Column>
                    </Row>

                    <Text style={spacer}>&nbsp;</Text>
                    <Hr style={divider} />

                    <Text style={signOff}>
                      Don&apos;t miss out — tasks fill up fast on {company}.
                      Head to your leads dashboard to see all available
                      opportunities.
                    </Text>
                    <Text style={{ ...signOff, marginTop: "12px" }}>
                      Warm regards,
                    </Text>
                    <Text style={sigName}>The {company} Team</Text>
                    <Text style={sigRole}>contact@taskoria.com</Text>

                  </Column>
                </Row>
              </Section>

              <Section style={footerSection}>
                <Row>
                  <Column style={footerCol}>
                    <Text style={footerText}>
                      © {new Date().getFullYear()} {company}. All rights reserved.
                    </Text>
                    <Text style={footerText}>
                      <Link href="https://www.taskoria.com/privacy-policy" style={footerLink}>
                        Privacy Policy
                      </Link>
                      {" · "}
                      <Link href="https://www.taskoria.com/terms-and-conditions" style={footerLink}>
                        Terms of Service
                      </Link>
                      {" · "}
                      <Link href="https://www.taskoria.com/unsubscribe" style={footerLink}>
                        Unsubscribe
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

// ─── Local styles ──────────────────────────────────────────────────────────────

const PRIMARY        = "#2563EB";
const PRIMARY_LIGHT  = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";

const taskCardSection: CSSProperties = {
  backgroundColor: "#f8faff",
  borderTop: `1px solid ${PRIMARY_BORDER}`,
  borderRight: `1px solid ${PRIMARY_BORDER}`,
  borderBottom: `1px solid ${PRIMARY_BORDER}`,
  borderLeft: `4px solid ${PRIMARY}`,
  borderRadius: "0 8px 8px 0",
};

const taskCardCol: CSSProperties = {
  padding: "16px 20px",
};

const taskCardLabel: CSSProperties = {
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "#9aa0aa",
  margin: "0 0 2px",
};

const taskCardValue: CSSProperties = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1a2236",
  margin: "0 0 12px",
};

const taskMatchBadge: CSSProperties = {
  fontSize: "13px",
  fontWeight: "bold",
  color: "#2563EB",
  margin: 0,
};

const tipSection: CSSProperties = {
  backgroundColor: "#fffbeb",
  borderTop: "1px solid #fde68a",
  borderRight: "1px solid #fde68a",
  borderBottom: "1px solid #fde68a",
  borderLeft: "4px solid #f59e0b",
  borderRadius: "0 8px 8px 0",
};

const tipCol: CSSProperties = {
  padding: "12px 16px",
};

const tipText: CSSProperties = {
  fontSize: "13px",
  color: "#92400e",
  margin: 0,
  lineHeight: "1.6",
};

const spacer: CSSProperties = {
  margin: 0,
  padding: 0,
  lineHeight: "24px",
  fontSize: "1px",
  color: "transparent",
};

const ctaCol: CSSProperties = {
  textAlign: "center",
  paddingTop: "4px",
};

const ctaSub: CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0",
};