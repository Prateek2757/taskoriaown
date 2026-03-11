import { Section, Text } from "@react-email/components";

interface CodeBlockProps {
  code: string;
  label?: string;
}

export const CodeBlock = ({ code, label = "Your verification code:" }: CodeBlockProps) => (
  <Section style={{ margin: "32px 0", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "24px", textAlign: "center" }}>
    <Text style={{ marginBottom: "8px", fontSize: "14px", color: "#4b5563" }}>{label}</Text>
    <Text style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "0.1em", color: "#2563eb", margin: "8px 0" }}>
      {code}
    </Text>
  </Section>
);