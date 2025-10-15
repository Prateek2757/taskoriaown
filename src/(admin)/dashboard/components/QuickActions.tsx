import {
	Calculator,
	FileSymlink,
	LinkIcon,
	Newspaper,
	User,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReferralModal from "../../components/ReferralModal";

export default function QuickActions() {
	const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

	const handleReferralClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsReferralModalOpen(true);
	};

	const handleCloseReferralModal = () => {
		setIsReferralModalOpen(false);
	};

	const cards = [
		{
			id: "kyc",
			title: "KYC",
			description: "Complete your verification process",
			icon: <User className=" text-blue-400" />,
			href: "/kyc",
			textColor: "text-blue-400",
			borderColor: "border-blue-200",
		},
		{
			id: "policies",
			title: "Policies",
			description: "View and manage your policies",
			icon: <Newspaper className=" text-red-400" />,
			href: "/online-policy",
			textColor: "text-red-400",
			borderColor: "border-red-200",
		},
		{
			id: "referral",
			title: "Referral",
			description: "Generate Proposal referral link",
			icon: <LinkIcon className=" text-green-400" />,
			href: "#",
			onClick: handleReferralClick,
			textColor: "text-green-400",
			borderColor: "border-green-200",
		},
		{
			id: "premium",
			title: "Premium Calculator",
			description: "Calculate Premium of Products",
			icon: <Calculator className=" text-purple-400" />,
			href: "/premium-calculator",
			textColor: "text-purple-400",
			borderColor: "border-purple-200",
		},
	];
	return (
		<Card className="shadow-none">
			<CardHeader>
				<h3 className="flex text-lg align-middle gap-2 font-bold">
					<FileSymlink /> Quick Actions
				</h3>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{cards.map((card) => (
						<Link
							href={card.href}
							key={card.id}
							className={`block group border rounded-lg p-6 transition-all duration-200 ${card.borderColor}`}
							onClick={card.onClick}
						>
							<div className="flex items-center justify-between mb-1">
								<h2 className={`text-lg font-semibold ${card.textColor}`}>
									{card.title}
								</h2>
								<div className={`flex items-center justify-center p-2`}>
									{card.icon}
								</div>
							</div>
							<p className="text-gray-600 dark:text-white text-sm">{card.description}</p>
						</Link>
					))}
					<ReferralModal
						isOpen={isReferralModalOpen}
						onClose={handleCloseReferralModal}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
