import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function SectionCards() {
	return (
		<div className="grid grid-cols-4 gap-4  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total Policies</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						2,847
					</CardTitle>
					<CardAction>
						<Badge variant="outline" className="border-green-500">
							<TrendingUpIcon />
							+12.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Trending up this month <TrendingUpIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Active policies this month
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Active Claims</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						1,234
					</CardTitle>
					<CardAction>
						<Badge variant="outline" className="border-red-500">
							<TrendingDownIcon />
							-20%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Down 20% this period <TrendingDownIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">Claims being processed</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total Premium</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						NPR 45.2M{" "}
					</CardTitle>
					<CardAction>
						<Badge variant="outline" className="border-green-500">
							<TrendingUpIcon />
							+12.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Strong user retention <TrendingUpIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">Premium collected</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Customers</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						1,249
					</CardTitle>
					<CardAction>
						<Badge variant="outline" className="border-green-500">
							<TrendingUpIcon />
							+4.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Steady performance increase <TrendingUpIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">Active customers</div>
				</CardFooter>
			</Card>
		</div>
	);
}
