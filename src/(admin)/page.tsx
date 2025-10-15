"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
	const session = useSession();
	const router = useRouter();
	useEffect(() => {
		if (session.status === "unauthenticated") {
			router.push("/login");
		} else {
			router.push("/dashboard");
		}
	}, [router, session]);
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<h1> This is admin home page</h1>
		</div>
	);
}
