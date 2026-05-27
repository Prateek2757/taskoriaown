/**
 * TaskPostedEmail.tsx
 *
 * Converted to the same Outlook-safe pattern used across all Taskoria emails:
 *   • <Section>  → background/border only  (padding on <table> is ignored)
 *   • <Column>   → padding + alignment     (padding on <td> works everywhere)
 *   • <Row>      → layout bridge between Section and Column
 *
 * Original issues fixed:
 *   padding on <Container>      → moved to outerWrapperCol <Column>
 *   padding on <Body>           → removed (stripped by Gmail/Outlook)
 *   margin on <Container>       → handled by React Email's align="center" attr
 *   boxShadow                   → removed (ignored by all email clients)
 *   margin on <Section>         → replaced with spacer <Text>&nbsp;</Text>
 *   paddingTop on <Section>     → moved to <Column>
 *   borderTop on <Section>      → kept (border on table renders fine)
 *   fontWeight "600"            → changed to "bold" (Outlook ignores numerics)
 *   Hero added                  → consistent with other Taskoria emails
 */

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
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties } from "react";

import { TaskPostedEmailProps } from "../type";
import {
  body,
  bodyCol,
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
  divider,
} from "../helpers/shared-style";
import { Hr } from "@react-email/components";

export const TaskPostedEmail = ({
  username="wee",
  company = "Taskoria",
  taskTitle="wefwe",
  taskLocation="wefwe",
}: TaskPostedEmailProps) => (
  <Html lang="en">
    <Head>
      <title>Your task has been posted — {company}</title>
    </Head>

    {/* No padding on Body — Gmail/Outlook strip it */}
    <Body style={body}>

      {/* Outer grey wrapper — padding on <td>, not <body> */}
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
                    <Text style={eyebrow}>Task posted</Text>
                    <Heading as="h1" style={heroHeading}>
                      You&apos;re live! 🎉
                    </Heading>
                    <Text style={heroSub}>
                      Your task is now visible to professionals on {company}.
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* ── Body ── */}
              <Section>
                <Row>
                  <Column style={bodyCol}>

                    {/* Greeting + task summary */}
                    <Text style={intro}>
                      Hi{" "}
                      <strong style={{ color: "#1a2236" }}>
                        {username ?? "there"}
                      </strong>
                      ! Your task{" "}
                      <strong style={{ color: "#1a2236" }}>
                        &ldquo;{taskTitle ?? "Untitled Task"}&rdquo;
                      </strong>
                      {taskLocation ? (
                        <>
                          {" "}in{" "}
                          <strong style={{ color: "#1a2236" }}>
                            {taskLocation}
                          </strong>
                        </>
                      ) : null}{" "}
                      has been successfully posted and is now live.
                    </Text>

                    {/* Task summary card */}
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
                          <Text style={taskCardLabel}>Status</Text>
                          <Text style={taskStatusBadge}>● Live</Text>
                        </Column>
                      </Row>
                    </Section>

                    {/* Spacer */}
                    <Text style={spacer}>&nbsp;</Text>

                    {/* CTA — textAlign on <Column> (<td>) is reliable everywhere */}
                    <Row>
                      <Column style={ctaCol}>
                        <Button
                          href="https://www.taskoria.com/customer/dashboard"
                          style={ctaButton}
                        >
                          View your task →
                        </Button>
                        <Text style={ctaSub}>
                          Manage your task from the dashboard
                        </Text>
                      </Column>
                    </Row>

                    {/* Spacer */}
                    <Text style={spacer}>&nbsp;</Text>

                    <Hr style={divider} />

                    <Text style={signOff}>
                      Professionals in your area will be able to see and apply
                      for your task. We&apos;ll notify you as soon as someone
                      shows interest.
                    </Text>
                    <Text style={{ ...signOff, marginTop: "12px" }}>
                      Warm regards,
                    </Text>
                    <Text style={sigName}>The {company} Team</Text>
                    <Text style={sigRole}>contact@taskoria.com</Text>

                  </Column>
                </Row>
              </Section>

              {/* ── Footer ── */}
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
                      {" · "}
                      <Link
                        href="https://www.taskoria.com/unsubscribe"
                        style={footerLink}
                      >
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

const PRIMARY       = "#2563EB";
const PRIMARY_LIGHT = "#eff6ff";
const PRIMARY_BORDER = "#bfdbfe";

/** Task summary card — background + border on <Section> (<table>) */
const taskCardSection: CSSProperties = {
  backgroundColor: "#f8faff",
  borderTop: `1px solid ${PRIMARY_BORDER}`,
  borderRight: `1px solid ${PRIMARY_BORDER}`,
  borderBottom: `1px solid ${PRIMARY_BORDER}`,
  borderLeft: `4px solid ${PRIMARY}`,
  borderRadius: "0 8px 8px 0",
};

/** Padding on <Column> (<td>) ✓ */
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

const taskStatusBadge: CSSProperties = {
  fontSize: "13px",
  fontWeight: "bold",
  color: "#16a34a",
  margin: 0,
};

const spacer: CSSProperties = {
  margin: 0,
  padding: 0,
  lineHeight: "24px",
  fontSize: "1px",
  color: "transparent",
};

/** CTA column — textAlign on <td> is reliable in all clients */
const ctaCol: CSSProperties = {
  textAlign: "center",
  paddingTop: "4px",
};

const ctaSub: CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: "10px 0 0",
};