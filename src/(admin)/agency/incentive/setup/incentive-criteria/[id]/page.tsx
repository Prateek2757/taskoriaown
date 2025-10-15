"use client"
import { AgentIncentiveFormDTO } from "../../schemas/addSchemeSchema";
import AgentIncentiveForm from "../IncentiveCriteriaForm";

export default function Page() {
  const handleFormSubmit = (data: AgentIncentiveFormDTO) => {
    console.log("Form submitted data:", data);

  };

  return (
    <main className="mt-3">
      <AgentIncentiveForm onSubmit={handleFormSubmit} />
    </main>
  );
}
