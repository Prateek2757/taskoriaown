import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties } from "react";

import { PasswordResetEmailProps } from "../type";
import {
  body,
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
  bodyCol,
  outerWrapperCol,
  sigName,
  signOff,
  sigRole,
} from "../helpers/shared-style";

export const PasswordResetEmail = ({
  username,
  company = "Taskoria",
  verifyCode,
}: PasswordResetEmailProps) => {
  const digits = verifyCode.toString().split("");

  return (
    <Html lang="en">
      <Head>
        <title>Reset your password — {company}</title>
      </Head>

      <Preview>
        Your {company} password reset code is {verifyCode} — expires in 10 minutes.
      </Preview>

      <Body style={body}>

        {/* ── Outer grey wrapper — padding on <td> not <body> ── */}
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

                {/* ── Hero ── */}
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
                      <Text style={eyebrow}>Security alert</Text>
                      <Heading as="h1" style={heroHeading}>
                        Reset your password
                        {username ? `, ${username}` : ""}.
                      </Heading>
                      <Text style={heroSub}>
                        We received a request to reset your account password.
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
                        , use the code below to reset your password. It expires
                        in <strong style={{ color: "#1a2236" }}>10 minutes</strong>
                        {" "}— do not share it with anyone.
                      </Text>
                      <Section style={codeSection}>
                        <Row>
                          <Column style={codeCol}>

                            <Text style={codeLabel}>Your reset code</Text>
                            <Row style={{ marginBottom: "12px" }}>
                              {digits.map((digit, i) => (
                                <Column key={i} style={digitCol}>
                                  <Text style={digitText}>{digit}</Text>
                                </Column>
                              ))}
                            </Row>

                            <Text style={expiryText}>
                              Expires in{" "}
                              <strong style={{ color: "#d97706" }}>10 minutes</strong>
                            </Text>

                          </Column>
                        </Row>
                      </Section>

                      <Text style={spacer}>&nbsp;</Text>

                      <Text style={stepsHeading}>How to reset your password:</Text>


                      <Section style={stepSection}>
                        <Row>
                          <Column style={stepNumCol}>
                            <Text style={stepNum}>1</Text>
                          </Column>
                          <Column style={stepTextCol}>
                            <Text style={stepText}>
                              Go back to the {company} app or website.
                            </Text>
                          </Column>
                        </Row>
                      </Section>
                      <Text style={stepSpacer}>&nbsp;</Text>

                      <Section style={stepSection}>
                        <Row>
                          <Column style={stepNumCol}>
                            <Text style={stepNum}>2</Text>
                          </Column>
                          <Column style={stepTextCol}>
                            <Text style={stepText}>
                              Enter the 6-digit code above in the reset field.
                            </Text>
                          </Column>
                        </Row>
                      </Section>
                      <Text style={stepSpacer}>&nbsp;</Text>

                      <Section style={stepSection}>
                        <Row>
                          <Column style={stepNumCol}>
                            <Text style={stepNum}>3</Text>
                          </Column>
                          <Column style={stepTextCol}>
                            <Text style={stepText}>
                              Choose a new strong password and confirm it.
                            </Text>
                          </Column>
                        </Row>
                      </Section>

                      <Text style={spacer}>&nbsp;</Text>

                      <Section style={warningSection}>
                        <Row>
                          <Column style={warningCol}>
                            <Text style={warningText}>
                              ⚠️ If you didn&apos;t request a password reset,
                              your account may be at risk. Please{" "}
                              <Link
                                href="https://www.taskoria.com/account/secure"
                                style={warningLink}
                              >
                                secure your account
                              </Link>{" "}
                              immediately.
                            </Text>
                          </Column>
                        </Row>
                      </Section>

                      <Text style={spacer}>&nbsp;</Text>

                      <Hr style={divider} />

                      <Text style={signOff}>
                        If this was a mistake, you can safely ignore this email.
                        Your password will remain unchanged.
                      </Text>
                      <Text style={signOff}>Warm regards,</Text>
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
};

const PRIMARY        = "#2563EB";
const PRIMARY_LIGHT  = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";

const codeSection: CSSProperties = {
  backgroundColor: PRIMARY_LIGHT,
  borderTop: `1.5px dashed ${PRIMARY}`,
  borderRight: `1.5px dashed ${PRIMARY}`,
  borderBottom: `1.5px dashed ${PRIMARY}`,
  borderLeft: `1.5px dashed ${PRIMARY}`,
  borderRadius: "12px",
};

const codeCol: CSSProperties = {
  padding: "24px 20px",
  textAlign: "center",
};

const codeLabel: CSSProperties = {
  fontSize: "11.5px",
  fontWeight: "bold",                 
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#6b7585",
  margin: "0 0 14px",
};

const digitCol: CSSProperties = {
  width: "44px",
  padding: "0 4px",
  textAlign: "center",
};

const digitText: CSSProperties = {
  backgroundColor: "#ffffff",
  borderTop: `1.5px solid ${PRIMARY_BORDER}`,
  borderRight: `1.5px solid ${PRIMARY_BORDER}`,
  borderBottom: `1.5px solid ${PRIMARY_BORDER}`,
  borderLeft: `1.5px solid ${PRIMARY_BORDER}`,
  borderRadius: "8px",
  fontSize: "26px",
  fontWeight: "bold",
  color: PRIMARY,
  fontFamily: "'Courier New', monospace",
  padding: "10px 0",
  margin: 0,
  textAlign: "center",
};

const expiryText: CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0",
};


const stepsHeading: CSSProperties = {
  fontSize: "13px",
  fontWeight: "bold",
  color: "#1a2236",
  margin: "0 0 10px",
  letterSpacing: "0.3px",
};

const stepSection: CSSProperties = {
  backgroundColor: "#f7f9fc",
  borderTop: "0.5px solid #e2e6ed",
  borderRight: "0.5px solid #e2e6ed",
  borderBottom: "0.5px solid #e2e6ed",
  borderLeft: "0.5px solid #e2e6ed",
  borderRadius: "8px",
};

const stepNumCol: CSSProperties = {
  width: "28px",
  verticalAlign: "middle",
  paddingTop: "10px",
  paddingBottom: "10px",
  paddingLeft: "14px",
};

const stepNum: CSSProperties = {
  width: "22px",
  height: "22px",
  backgroundColor: PRIMARY,
  color: "#ffffff",
  fontSize: "11px",
  fontWeight: "bold",
  borderRadius: "50%",
  textAlign: "center",
  lineHeight: "22px",
  margin: 0,
};

const stepTextCol: CSSProperties = {
  verticalAlign: "middle",
  paddingTop: "10px",
  paddingBottom: "10px",
  paddingLeft: "10px",
  paddingRight: "14px",
};

const stepText: CSSProperties = {
  fontSize: "12.5px",
  color: "#3d4654",
  margin: 0,
};


const stepSpacer: CSSProperties = {
  margin: 0,
  padding: 0,
  lineHeight: "8px",
  fontSize: "1px",
  color: "transparent",
};

const warningSection: CSSProperties = {
  backgroundColor: "#fef2f2",
  borderTop: "0.5px solid #fecaca",
  borderRight: "0.5px solid #fecaca",
  borderBottom: "0.5px solid #fecaca",
  borderLeft: "0.5px solid #fecaca",
  borderRadius: "8px",
};

const warningCol: CSSProperties = {
  padding: "12px 16px",
};

const warningText: CSSProperties = {
  fontSize: "12.5px",
  color: "#991b1b",
  margin: 0,
  lineHeight: "1.6",
};

const warningLink: CSSProperties = {
  color: "#991b1b",
  fontWeight: "bold",
  textDecoration: "underline",
};


const spacer: CSSProperties = {
  margin: 0,
  padding: 0,
  lineHeight: "24px",
  fontSize: "1px",
  color: "transparent",
};