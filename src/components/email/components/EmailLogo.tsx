import { Column, Img, Row, Section } from "@react-email/components";

type EmailLogoProps = {
  company?: string;
  baseUrl?: string;
  width?: number;
  align?: "left" | "center";
  marginBottom?: number;
};

export function EmailLogo({
  company = "Taskoria",
  baseUrl = "https://www.taskoria.com",
  width = 180,
  align = "center",
  marginBottom = 18,
}: EmailLogoProps) {
  return (
    <Section
      style={{
        width: "100%",
        maxWidth: `${width + 32}px`,
        margin: align === "center" ? `0 auto ${marginBottom}px` : `0 0 ${marginBottom}px`,
        backgroundColor: "#ffffff",
        borderRadius: "8px",
      }}
    >
      <Row>
        <Column style={{ padding: "12px 16px", textAlign: align }}>
          <Img
            src={`${baseUrl.replace(/\/$/, "")}/images/taskoria-logo-email.png`}
            alt={`${company} logo`}
            width={width}
            style={{
              display: "block",
              width: "100%",
              maxWidth: `${width}px`,
              height: "auto",
              margin: align === "center" ? "0 auto" : 0,
              border: 0,
            }}
          />
        </Column>
      </Row>
    </Section>
  );
}
