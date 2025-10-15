"use client";
import { ChartAreaInteractive } from "./components/ChartArea";
import QuickActions from "./components/QuickActions";
import SectionCards from "./components/SectionCards";

export default function Page() {
	return (
		<>
			<SectionCards />
			<ChartAreaInteractive />
			<QuickActions />
		</>
	);
}
