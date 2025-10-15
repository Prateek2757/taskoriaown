import { Suspense } from "react";
import ProposalForm from "../proposalForm";

export default function page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ProposalForm />
		</Suspense>
	);
}
