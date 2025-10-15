"use client";

import PersonalInformation from "./personal-information/page";
import PolicyLists from "./policyLists/page";
import NomineeTab from "./policyLists/policy-list-tabs/NomineeTab";
import BonusEarnedTab from "./policyLists/policy-list-tabs/BonusEarnedTab";
import {
	InfoIcon,
	Calendar,
	User2,
	Users,
	Award,
	Banknote,
	FileText,
	HandCoins,
} from "lucide-react";
import ProposerDetails from "./policyLists/policy-list-tabs/ProposerDetails";
import SurrenderTab from "./policyLists/policy-list-tabs/SurrendarTab";
import PolicyLoanTab from "./policyLists/policy-list-tabs/PolicyLoanTab";
import { PolicyInformation } from "./policyLists/policy-list-tabs/PolicyInformation";
import PaymentHistory from "./policyLists/policy-list-tabs/PaymentHistory";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MaturityContent } from "./policyLists/policy-list-tabs/MaturityContent";

export default function PolicyProfilePage() {
	const policyListsSubtabs = [
		{
			id: "policy-info",
			name: "Policy Information",
			icon: <InfoIcon className="h-4 w-4 mr-2" />,
			component: <PolicyInformation />,
		},
		{
			id: "payment-history",
			name: "Payment History",
			icon: <Calendar className="h-4 w-4 mr-2" />,
			component: <PaymentHistory />,
		},
		{
			id: "proposer",
			name: "Proposer Details",
			icon: <User2 className="h-4 w-4 mr-2" />,
			component: <ProposerDetails />,
		},
		{
			id: "nominee",
			name: "Nominee",
			icon: <Users className="h-4 w-4 mr-2" />,
			component: <NomineeTab />,
		},
		{
			id: "bonus",
			name: "Bonus Earned",
			icon: <Award className="h-4 w-4 mr-2" />,
			component: <BonusEarnedTab />,
		},
		{
			id: "surrender",
			name: "Surrender",
			icon: <HandCoins className="h-4 w-4 mr-2" />,
			component: <SurrenderTab />,
		},
		{
			id: "loan",
			name: "Policy Loan",
			icon: <Banknote className="h-4 w-4 mr-2" />,
			component: <PolicyLoanTab />,
		},
		{
			id: "maturity",
			name: "Maturity",
			icon: <Calendar className="h-4 w-4 mr-2" />,
			component: <MaturityContent />,
		},
		{
			id: "statement",
			name: "My Statement",
			icon: <FileText className="h-4 w-4 mr-2" />,
			component: <div>My Statement Content</div>,
		},
	];

	return (
		<div className="py-2">
			<Tabs defaultValue="personal-info">
				<TabsList className="w-full">
					<TabsTrigger value="personal-info">Personal Information</TabsTrigger>
					<TabsTrigger value="policy-lists">Policy Lists</TabsTrigger>
				</TabsList>

				<TabsContent value="personal-info">
					<PersonalInformation />
				</TabsContent>

				<TabsContent value="policy-lists">
					<Tabs defaultValue="policy-info" className="w-full">
						<TabsList className="w-full">
							{policyListsSubtabs.map((subtab) => (
								<TabsTrigger key={subtab.id} value={subtab.id}>
									{subtab.icon}
									{subtab.name}
								</TabsTrigger>
							))}
						</TabsList>

						{policyListsSubtabs.map((subtab) => (
							<TabsContent key={subtab.id} value={subtab.id}>
								<div className="bg-white border-1 rounded-lg">
									{subtab.component}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</TabsContent>
			</Tabs>
		</div>
	);
}
