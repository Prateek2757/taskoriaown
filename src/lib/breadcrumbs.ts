export interface BreadcrumbItem {
	title: string;
	href?: string;
}

export const breadcrumbConfig: Record<string, BreadcrumbItem[]> = {
	"/dashboard": [{ title: "Dashboard" }],
	"/kyc": [{ title: "KYC List" }],
	"/kyc/add": [{ title: "KYC List", href: "/kyc" }, { title: "Add KYC" }],
	"/proposal": [{ title: "Proposal List" }],
	"/online-proposal": [{ title: "Online Proposal List" }],
	"/policy": [{ title: "Policy List" }],
	"/online-policy": [{ title: "Online Policy List" }],
	"/proposal/add": [
		{ title: "Proposal List", href: "/proposal" },
		{ title: "Add Proposal" },
	],
	"/online-proposal/add": [
		{ title: "Online Proposal List", href: "/online-proposal" },
		{ title: "Add Online Proposal" },
	],
	"/target": [{ title: "Daily Target List" }],
	"/lead": [{ title: "Lead List" }],
	"/premium": [{ title: "Calculate Premium" }],
};

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
	if (pathname.startsWith("/kyc/view/")) {
		return [{ title: "KYC List", href: "/kyc" }, { title: "View KYC" }];
	}
	if (pathname.startsWith("/kyc/edit/")) {
		return [{ title: "KYC List", href: "/kyc" }, { title: "Edit KYC" }];
	}
	if (pathname.startsWith("/kyc/verify/")) {
		return [{ title: "Kyc List", href: "/kyc" }, { title: "Verify Kyc" }];
	}

	if (pathname === "/kyc-endorsement") {
		return [{ title: "Endorsement List" }];
	}
	if (pathname.startsWith("/kyc-endorsement/add")) {
		return [
			{ title: "Endorsement List", href: "/endorsement" },
			{ title: "Add Endorsement" },
		];
	}
	if (pathname.startsWith("/kyc-endorsement/view")) {
		return [
			{ title: "Endorsement List", href: "/endorsement" },
			{ title: "View Endorsement" },
		];
	}
	if (pathname.startsWith("/kyc-endorsement/verify")) {
		return [
			{ title: "Endorsement List", href: "/endorsement" },
			{ title: "Verify Endorsement" },
		];
	}
	if (pathname.startsWith("/kyc-endorsement/updatekyc/")) {
		return [
			{ title: "Endorsement List", href: "/endorsement" },
			{ title: "Update KYC" },
		];
	}

	if (pathname.startsWith("/proposal/edit/")) {
		return [
			{ title: "Proposal List", href: "/proposal" },
			{ title: "Edit Proposal" },
		];
	}

	if (pathname.startsWith("/proposal/view/")) {
		return [
			{ title: "Proposal List", href: "/proposal" },
			{ title: "View Proposal" },
		];
	}

	if (pathname.startsWith("/online-proposal/proposalpayment/")) {
		return [
			{ title: "Online Proposal List", href: "/online-proposal" },
			{ title: "Online Proposal Payment" },
		];
	}

	if (pathname.startsWith("/online-policy/view/")) {
		return [
			{ title: "Policy List", href: "/policy" },
			{ title: "View Policy" },
		];
	}
	if (pathname.startsWith("/online-policy/policypaper/")) {
		return [
			{ title: "Policy List", href: "/policy" },
			{ title: "Policy Paper" },
		];
	}
	if (pathname.startsWith("/online-policy/receipt/")) {
		return [
			{ title: "Policy List", href: "/policy" },
			{ title: "Policy Receipt" },
		];
	}

	return breadcrumbConfig[pathname] || [{ title: "Page Not Found" }];
}
