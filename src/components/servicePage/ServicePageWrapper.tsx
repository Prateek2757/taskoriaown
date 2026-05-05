import ServicePage from "@/components/servicePage/ServicePage";

export default function ServicePageWrapper(
  props: React.ComponentProps<typeof ServicePage>
) {
  return <ServicePage {...props} />;
}