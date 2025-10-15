"use client";

import { ChevronRight, Dot, type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";

interface NavSubItem {
	title: string;
	url: string;
	isActive?: boolean;
}

interface NavSecondLevelItem {
	title: string;
	url: string;
	isActive?: boolean;
	items?: NavSubItem[];
}

interface NavMainItem {
	title: string;
	url: string;
	icon?: LucideIcon | React.ComponentType;
	isActive?: boolean;
	items?: NavSecondLevelItem[];
}

export function NavMain({
	items,
	searchQuery,
}: {
	items?: NavMainItem[];
	searchQuery?: string;
}) {
	const { setOpenMobile } = useSidebar();
	console.log("this is searchQuery", searchQuery);

	const hasSearchMatch = (item: NavMainItem, query: string): boolean => {
		if (!query.trim()) return false;

		const searchTerm = query.toLowerCase();

		if (item.title.toLowerCase().includes(searchTerm)) return true;

		return (
			item.items?.some(
				(subItem) =>
					subItem.title.toLowerCase().includes(searchTerm) ||
					subItem.items?.some((thirdLevel) =>
						thirdLevel.title.toLowerCase().includes(searchTerm),
					),
			) || false
		);
	};

	const handleLinkClick = () => {
		setOpenMobile(false);
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 100);
	};

	if (!items || !Array.isArray(items) || items.length === 0) {
		return (
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton>
							<span>No menu items available</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		);
	}

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={
							item.isActive || hasSearchMatch(item, searchQuery || "")
						}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									tooltip={item.title}
									asChild={item.url !== "#"}
									className={
										item.isActive
											? "bg-sidebar-accent text-sidebar-accent-foreground"
											: "cursor-pointer"
									}
								>
									{item.url !== "#" ? (
										<Link href={item.url} onClick={handleLinkClick}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											{item.items && (
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											)}
										</Link>
									) : (
										<>
											{item.icon && <item.icon />}
											<span className="flex items-center justify-between flex-1">
												{item.title}
												{item.isActive && <Dot className="text-orange-400" />}
											</span>
											{item.items && (
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											)}
										</>
									)}
								</SidebarMenuButton>
							</CollapsibleTrigger>
							{item.items?.length && (
								<CollapsibleContent>
									<SidebarMenuSub className="mr-0 pr-0">
										{item.items.map((secondLevelItem) => (
											<Collapsible
												key={secondLevelItem.title}
												asChild
												defaultOpen={
													secondLevelItem.isActive ||
													hasSearchMatch(item, searchQuery || "")
												}
												className="group/nested-collapsible cursor-pointer"
											>
												<SidebarMenuSubItem>
													<CollapsibleTrigger asChild>
														<SidebarMenuSubButton
															asChild={secondLevelItem.url !== "#"}
															className={
																secondLevelItem.isActive
																	? "bg-sidebar-accent text-sidebar-accent-foreground"
																	: ""
															}
														>
															{secondLevelItem.url !== "#" ? (
																<Link
																	href={secondLevelItem.url}
																	onClick={handleLinkClick}
																>
																	<span className="flex items-center justify-between flex-1">
																		{secondLevelItem.title}
																		{secondLevelItem.isActive && (
																			<Dot className="text-orange-400" />
																		)}
																	</span>
																	{secondLevelItem.items && (
																		<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
																	)}
																</Link>
															) : (
																<>
																	<span className="flex items-center justify-between flex-1">
																		{secondLevelItem.title}
																		{secondLevelItem.isActive && (
																			<Dot className="text-orange-400" />
																		)}
																	</span>
																	{secondLevelItem.items && (
																		<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
																	)}
																</>
															)}
														</SidebarMenuSubButton>
													</CollapsibleTrigger>
													{secondLevelItem.items?.length && (
														<CollapsibleContent>
															<SidebarMenuSub className="ml-4 mr-0 pr-0">
																{secondLevelItem.items.map((thirdLevelItem) => (
																	<SidebarMenuSubItem
																		key={thirdLevelItem.title}
																	>
																		<SidebarMenuSubButton
																			asChild
																			className={
																				thirdLevelItem.isActive
																					? "bg-sidebar-accent text-sidebar-accent-foreground"
																					: ""
																			}
																		>
																			<Link
																				href={thirdLevelItem.url}
																				onClick={handleLinkClick}
																			>
																				<span className="flex items-center justify-between flex-1">
																					{thirdLevelItem.title}
																					{thirdLevelItem.isActive && (
																						<Dot className="text-orange-400" />
																					)}
																				</span>
																			</Link>
																		</SidebarMenuSubButton>
																	</SidebarMenuSubItem>
																))}
															</SidebarMenuSub>
														</CollapsibleContent>
													)}
												</SidebarMenuSubItem>
											</Collapsible>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
