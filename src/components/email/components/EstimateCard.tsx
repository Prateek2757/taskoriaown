import { Section, Text } from "@react-email/components";

interface EstimateCardProps {
  price?: string;
  unit?: string;
  messageFromProvider?: string;
}

export const EstimateCard = ({ price, unit, messageFromProvider }: EstimateCardProps) => (
  <Section style={{ margin: "24px 0", backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px" }}>
    <Text style={{ fontSize: "14px", color: "#6b7280" }}>Quoted price</Text>
    <Text style={{ fontSize: "28px", fontWeight: "bold", color: "#2563eb", margin: "8px 0" }}>
      {price} {unit}
    </Text>
    {messageFromProvider && (
      <Text style={{ fontSize: "14px", color: "#374151" }}>{messageFromProvider}</Text>
    )}
  </Section>
);