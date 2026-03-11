import { Button, Section } from "@react-email/components";

interface EmailButtonProps {
  href: string;
  label: string;
}

export const EmailButton = ({ href, label }: EmailButtonProps) => (
  <Section style={{ margin: "32px 0", textAlign: "center" }}>
    <Button
      href={href}
      style={{
        backgroundColor: "#2563eb", color: "#ffffff",
        padding: "12px 32px", fontSize: "16px",
        fontWeight: "600", textDecoration: "none",
        borderRadius: "8px", display: "inline-block",
      }}
    >
      {label}
    </Button>
  </Section>
);