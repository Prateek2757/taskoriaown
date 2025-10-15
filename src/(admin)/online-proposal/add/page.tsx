"use client";
import { Suspense } from "react";
import ProposalForm from "../components/ProposalForm";

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center mt-8">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
				</div>
			}
		>
			<ProposalForm isLoggedIn={true} />
		</Suspense>
	);
}
