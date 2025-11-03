"use client";

import {
	ChartNoAxesCombined,
	Cog,
	FileCheck,
	FilePen,
	FilePenIcon,
	FileText,
	FolderSymlink,
	Globe,
	HandCoins,
	LayoutDashboard,
	MessagesSquare,
	NotebookText,
	NotebookTextIcon,
	Search,
	ShieldUser,
	Siren,
	Target,
	TriangleAlert,
	User2,
	UserCog,
	Users,
	X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as React from "react";
// import { NavMain } from "@/components/nav-main";
// import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

const iconMap = {
	LayoutDashboard,
	User2,
	FilePen,
	NotebookText,
	Target,
	MessagesSquare,
	target: Target,

	Cog,
	ShieldUser,
	FolderSymlink,
	HandCoins,
	Globe,
	Users,
	ChartNoAxesCombined,
	TriangleAlert,
	UserCog,
	Siren,
	FileCheck,
	FilePenIcon,
	FileText,
	NotebookTextIcon,
};

interface MenuItem {
	slug: string;
	group: string;
	groupIcon: string;
	subGroup: string;
	menuName: string;
	icon: string;
	link: string;
	displayOrder: string;
	isActive: boolean;
}

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

interface NavItem {
	title: string;
	url: string;
	icon?: React.ComponentType;
	isActive?: boolean;
	items?: NavSecondLevelItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const sessionData = useSession();
	const pathname = usePathname();
	const [menuList, setMenuList] = React.useState<MenuItem[] | null>(null);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [filteredMenuList, setFilteredMenuList] = React.useState<
		MenuItem[] | null
	>(null);
	const router = useRouter();

	React.useEffect(() => {
		const storedMenu = window.localStorage.getItem("menu-list");
		if (storedMenu !== null) {
			try {
				const parsedMenu = JSON.parse(storedMenu);
				setMenuList(parsedMenu);
				setFilteredMenuList(parsedMenu);
			} catch (error) {
				console.error("Error parsing menu list:", error);
				setMenuList(null);
				setFilteredMenuList(null);
			}
		} else {
			router.push("/en/login");
		}

		if (sessionData.status === "unauthenticated") {
			localStorage.removeItem("menu-list");
			setMenuList(null);
			setFilteredMenuList(null);
		}
	}, [sessionData, router]);

	React.useEffect(() => {
		if (!menuList) {
			setFilteredMenuList(null);
			return;
		}

		if (!searchQuery.trim()) {
			setFilteredMenuList(menuList);
			return;
		}

		const filtered = menuList.filter((item) => {
			const searchTerm = searchQuery.toLowerCase();
			return (
				item.menuName.toLowerCase().includes(searchTerm) ||
				item.group.toLowerCase().includes(searchTerm) ||
				item.subGroup.toLowerCase().includes(searchTerm)
			);
		});

		setFilteredMenuList(filtered);
	}, [menuList, searchQuery]);

	// const transformMenuData = (menuData: MenuItem[]): NavItem[] => {
	// 	if (!menuData || !Array.isArray(menuData) || menuData.length === 0) {
	// 		return [];
	// 	}

	// 	try {
	// 		// Group by main group first
	// 		const groupedByMain = menuData.reduce(
	// 			(acc, item) => {
	// 				if (!item || !item.group) return acc;

	// 				if (!acc[item.group]) {
	// 					acc[item.group] = [];
	// 				}
	// 				acc[item.group].push(item);
	// 				return acc;
	// 			},
	// 			{} as Record<string, MenuItem[]>,
	// 		);

	// 		const navItems: NavItem[] = [];

	// 		for (const [groupName, groupItems] of Object.entries(groupedByMain)) {
	// 			if (!groupItems || groupItems.length === 0) continue;

	// 			// Sort items by display order
	// 			const sortedGroupItems = groupItems.sort((a, b) => {
	// 				const aOrder = Number.parseFloat(a.displayOrder) || 0;
	// 				const bOrder = Number.parseFloat(b.displayOrder) || 0;
	// 				return aOrder - bOrder;
	// 			});

	// 			const mainItem = sortedGroupItems[0];
	// 			const IconComponent =
	// 				iconMap[mainItem.groupIcon as keyof typeof iconMap] ||
	// 				iconMap[mainItem.icon as keyof typeof iconMap];

	// 			// Check if all items have empty/null subGroup or all have the same subGroup
	// 			const subGroups = sortedGroupItems
	// 				.map((item) => item.subGroup || "")
	// 				.filter((sg) => sg.trim() !== "");
	// 			const uniqueSubGroups = [...new Set(subGroups)];

	// 			if (sortedGroupItems.length === 1) {
	// 				// Single menu item - make it directly clickable
	// 				const singleItem = sortedGroupItems[0];
	// 				navItems.push({
	// 					title: singleItem.menuName || groupName,
	// 					url: singleItem.link ? `/${singleItem.link}` : "#",
	// 					icon: IconComponent,
	// 					isActive: singleItem.link
	// 						? pathname.startsWith(`/${singleItem.link}`) ||
	// 							pathname === `/${singleItem.link}`
	// 						: false,
	// 				});
	// 			} else if (
	// 				uniqueSubGroups.length === 0 ||
	// 				uniqueSubGroups.length === 1
	// 			) {
	// 				// All items are in the same subgroup or no subgroup - create 2-level menu
	// 				const secondLevelItems: NavSecondLevelItem[] = sortedGroupItems.map(
	// 					(item) => ({
	// 						title: item.menuName || "Sub Menu Item",
	// 						url: item.link ? `/${item.link}` : "#",
	// 						isActive: item.link
	// 							? pathname.startsWith(`/${item.link}/`) ||
	// 								pathname === `/${item.link}`
	// 							: false,
	// 					}),
	// 				);

	// 				navItems.push({
	// 					title: groupName,
	// 					url: "#",
	// 					icon: IconComponent,
	// 					isActive: secondLevelItems.some((sub) => sub.isActive),
	// 					items: secondLevelItems,
	// 				});
	// 			} else {
	// 				// Multiple different subGroups - create 3-level menu
	// 				const groupedBySubGroup = sortedGroupItems.reduce(
	// 					(acc, item) => {
	// 						const subGroupKey = item.subGroup || "default";
	// 						if (!acc[subGroupKey]) {
	// 							acc[subGroupKey] = [];
	// 						}
	// 						acc[subGroupKey].push(item);
	// 						return acc;
	// 					},
	// 					{} as Record<string, MenuItem[]>,
	// 				);

	// 				const secondLevelItems: NavSecondLevelItem[] = [];

	// 				for (const [subGroupName, subGroupItems] of Object.entries(
	// 					groupedBySubGroup,
	// 				)) {
	// 					if (!subGroupItems || subGroupItems.length === 0) continue;

	// 					if (
	// 						subGroupItems.length === 1 &&
	// 						(subGroupName === "default" || !subGroupName.trim())
	// 					) {
	// 						// Single item with no meaningful subgroup - make it directly clickable at second level
	// 						const item = subGroupItems[0];
	// 						secondLevelItems.push({
	// 							title: item.menuName || "Sub Menu Item",
	// 							url: item.link ? `/${item.link}` : "#",
	// 							isActive: item.link
	// 								? pathname.startsWith(`/${item.link}/`) ||
	// 									pathname === `/${item.link}`
	// 								: false,
	// 						});
	// 					} else {
	// 						// Multiple items or meaningful subgroup - create third level
	// 						const thirdLevelItems: NavSubItem[] = subGroupItems.map(
	// 							(item) => ({
	// 								title: item.menuName || "Third Level Item",
	// 								url: item.link ? `/${item.link}` : "#",
	// 								isActive: item.link
	// 									? pathname.startsWith(`/${item.link}/`) ||
	// 										pathname === `/${item.link}`
	// 									: false,
	// 							}),
	// 						);

	// 						if (subGroupItems.length === 1) {
	// 							// Single item in subgroup - flatten it to second level
	// 							secondLevelItems.push({
	// 								title: subGroupItems[0].menuName || subGroupName,
	// 								url: subGroupItems[0].link
	// 									? `/${subGroupItems[0].link}`
	// 									: "#",
	// 								isActive: subGroupItems[0].link
	// 									? pathname.startsWith(`/${subGroupItems[0].link}/`) ||
	// 										pathname === `/${subGroupItems[0].link}`
	// 									: false,
	// 							});
	// 						} else {
	// 							// Multiple items in subgroup - keep third level structure
	// 							secondLevelItems.push({
	// 								title: subGroupName,
	// 								url: "#",
	// 								isActive: thirdLevelItems.some((third) => third.isActive),
	// 								items: thirdLevelItems,
	// 							});
	// 						}
	// 					}
	// 				}

	// 				navItems.push({
	// 					title: groupName,
	// 					url: "#",
	// 					icon: IconComponent,
	// 					isActive: secondLevelItems.some((second) => second.isActive),
	// 					items: secondLevelItems,
	// 				});
	// 			}
	// 		}

	// 		// Sort nav items by display order
	// 		const sortedNavItems = navItems.sort((a, b) => {
	// 			const aItems = groupedByMain[a.title] || [];
	// 			const bItems = groupedByMain[b.title] || [];
	// 			const aOrder = Math.min(
	// 				...aItems.map((item) => Number.parseFloat(item.displayOrder) || 0),
	// 			);
	// 			const bOrder = Math.min(
	// 				...bItems.map((item) => Number.parseFloat(item.displayOrder) || 0),
	// 			);
	// 			return aOrder - bOrder;
	// 		});

	// 		return sortedNavItems.length > 0 ? sortedNavItems : [];
	// 	} catch (error) {
	// 		console.error("Error transforming menu data:", error);
	// 		return [];
	// 	}
	// };

	const transformMenuData = (menuData: MenuItem[]): NavItem[] => {
		if (!menuData || !Array.isArray(menuData) || menuData.length === 0) {
			return [];
		}

		try {
			// Group by main group first
			const groupedByMain = menuData.reduce(
				(acc, item) => {
					if (!item || !item.group) return acc;

					if (!acc[item.group]) {
						acc[item.group] = [];
					}
					acc[item.group].push(item);
					return acc;
				},
				{} as Record<string, MenuItem[]>,
			);

			const navItems: NavItem[] = [];

			for (const [groupName, groupItems] of Object.entries(groupedByMain)) {
				if (!groupItems || groupItems.length === 0) continue;

				// Sort items by display order
				const sortedGroupItems = groupItems.sort((a, b) => {
					const aOrder = Number.parseFloat(a.displayOrder) || 0;
					const bOrder = Number.parseFloat(b.displayOrder) || 0;
					return aOrder - bOrder;
				});

				const mainItem = sortedGroupItems[0];
				const IconComponent =
					iconMap[mainItem.groupIcon as keyof typeof iconMap] ||
					iconMap[mainItem.icon as keyof typeof iconMap];

				// Check if all items have empty/null subGroup or all have the same subGroup
				const subGroups = sortedGroupItems
					.map((item) => item.subGroup || "")
					.filter((sg) => sg.trim() !== "");
				const uniqueSubGroups = [...new Set(subGroups)];

				if (sortedGroupItems.length === 1) {
					// Single menu item - make it directly clickable
					const singleItem = sortedGroupItems[0];
					navItems.push({
						title: singleItem.menuName || groupName,
						url: singleItem.link ? `/${singleItem.link}` : "#",
						icon: IconComponent,
						isActive: singleItem.link
							? pathname.startsWith(`/${singleItem.link}`) ||
								pathname === `/${singleItem.link}`
							: false,
					});
				} else if (
					uniqueSubGroups.length === 0 ||
					uniqueSubGroups.length === 1
				) {
					// All items are in the same subgroup or no subgroup - create 2-level menu
					const secondLevelItems: NavSecondLevelItem[] = sortedGroupItems.map(
						(item) => ({
							title: item.menuName || "Sub Menu Item",
							url: item.link ? `/${item.link}` : "#",
							isActive: item.link
								? pathname.startsWith(`/${item.link}/`) ||
									pathname === `/${item.link}`
								: false,
						}),
					);

					navItems.push({
						title: groupName,
						url: "#",
						icon: IconComponent,
						isActive: secondLevelItems.some((sub) => sub.isActive),
						items: secondLevelItems,
					});
				} else {
					// Multiple different subGroups - create 3-level menu
					const groupedBySubGroup = sortedGroupItems.reduce(
						(acc, item) => {
							const subGroupKey = item.subGroup || "default";
							if (!acc[subGroupKey]) {
								acc[subGroupKey] = [];
							}
							acc[subGroupKey].push(item);
							return acc;
						},
						{} as Record<string, MenuItem[]>,
					);

					const secondLevelItems: NavSecondLevelItem[] = [];

					for (const [subGroupName, subGroupItems] of Object.entries(
						groupedBySubGroup,
					)) {
						if (!subGroupItems || subGroupItems.length === 0) continue;

						if (
							subGroupItems.length === 1 &&
							(subGroupName === "default" || !subGroupName.trim())
						) {
							// Single item with no meaningful subgroup - make it directly clickable at second level
							const item = subGroupItems[0];
							secondLevelItems.push({
								title: item.menuName || "Sub Menu Item",
								url: item.link ? `/${item.link}` : "#",
								isActive: item.link
									? pathname.startsWith(`/${item.link}/`) ||
										pathname === `/${item.link}`
									: false,
							});
						} else {
							// Multiple items or meaningful subgroup - create third level
							const thirdLevelItems: NavSubItem[] = subGroupItems.map(
								(item) => ({
									title: item.menuName || "Third Level Item",
									url: item.link ? `/${item.link}` : "#",
									isActive: item.link
										? pathname.startsWith(`/${item.link}/`) ||
											pathname === `/${item.link}`
										: false,
								}),
							);

							if (subGroupItems.length === 1) {
								// Single item in subgroup - flatten it to second level
								secondLevelItems.push({
									title: subGroupItems[0].menuName || subGroupName,
									url: subGroupItems[0].link
										? `/${subGroupItems[0].link}`
										: "#",
									isActive: subGroupItems[0].link
										? pathname.startsWith(`/${subGroupItems[0].link}/`) ||
											pathname === `/${subGroupItems[0].link}`
										: false,
								});
							} else {
								// Multiple items in subgroup - keep third level structure
								secondLevelItems.push({
									title: subGroupName,
									url: "#",
									isActive: thirdLevelItems.some((third) => third.isActive),
									items: thirdLevelItems,
								});
							}
						}
					}

					navItems.push({
						title: groupName,
						url: "#",
						icon: IconComponent,
						isActive: secondLevelItems.some((second) => second.isActive),
						items: secondLevelItems,
					});
				}
			}

			// Sort nav items by display order
			const sortedNavItems = navItems.sort((a, b) => {
				const aItems = groupedByMain[a.title] || [];
				const bItems = groupedByMain[b.title] || [];
				const aOrder = Math.min(
					...aItems.map((item) => Number.parseFloat(item.displayOrder) || 0),
				);
				const bOrder = Math.min(
					...bItems.map((item) => Number.parseFloat(item.displayOrder) || 0),
				);
				return aOrder - bOrder;
			});

			return sortedNavItems.length > 0 ? sortedNavItems : [];
		} catch (error) {
			console.error("Error transforming menu data:", error);
			return [];
		}
	};

	// const transformMenuData = (menuData: MenuItem[]): NavItem[] => {
	// 	if (!menuData || !Array.isArray(menuData) || menuData.length === 0) {
	// 		return [];
	// 	}

	// 	try {
	// 		// Group by main group first
	// 		const groupedByMain = menuData.reduce(
	// 			(acc, item) => {
	// 				if (!item || !item.group) return acc;

	// 				if (!acc[item.group]) {
	// 					acc[item.group] = [];
	// 				}
	// 				acc[item.group].push(item);
	// 				return acc;
	// 			},
	// 			{} as Record<string, MenuItem[]>,
	// 		);

	// 		const navItems: NavItem[] = [];

	// 		for (const [groupName, groupItems] of Object.entries(groupedByMain)) {
	// 			if (!groupItems || groupItems.length === 0) continue;

	// 			// Sort items by display order
	// 			const sortedGroupItems = groupItems.sort((a, b) => {
	// 				const aOrder = Number.parseFloat(a.displayOrder) || 0;
	// 				const bOrder = Number.parseFloat(b.displayOrder) || 0;
	// 				return aOrder - bOrder;
	// 			});

	// 			// Group by subGroup within each main group
	// 			const subGrouped = sortedGroupItems.reduce(
	// 				(acc, item) => {
	// 					const subGroupKey = item.subGroup || "default";
	// 					if (!acc[subGroupKey]) {
	// 						acc[subGroupKey] = [];
	// 					}
	// 					acc[subGroupKey].push(item);
	// 					return acc;
	// 				},
	// 				{} as Record<string, MenuItem[]>,
	// 			);

	// 			const mainItem = sortedGroupItems[0];
	// 			const IconComponent =
	// 				iconMap[mainItem.groupIcon as keyof typeof iconMap] ||
	// 				iconMap[mainItem.icon as keyof typeof iconMap];

	// 			// Check if we have multiple subGroups or just one
	// 			const subGroupKeys = Object.keys(subGrouped);

	// 			if (
	// 				subGroupKeys.length === 1 &&
	// 				(subGroupKeys[0] === "default" || !subGroupKeys[0])
	// 			) {
	// 				// Single level or 2-level menu (no meaningful subGroups)
	// 				const items = subGrouped[subGroupKeys[0]];

	// 				if (items.length === 1) {
	// 					// Single menu item
	// 					const singleItem = items[0];
	// 					navItems.push({
	// 						title: singleItem.menuName || "Menu Item",
	// 						url: singleItem.link ? `/${singleItem.link}` : "#",
	// 						icon: IconComponent,
	// 						isActive: singleItem.link
	// 							? pathname.startsWith(`/${singleItem.link}`) ||
	// 								pathname === `/${singleItem.link}`
	// 							: false,
	// 					});
	// 				} else {
	// 					// 2-level menu (group -> menu items)
	// 					const secondLevelItems: NavSecondLevelItem[] = items.map(
	// 						(item) => ({
	// 							title: item.menuName || "Sub Menu Item",
	// 							url: item.link ? `/${item.link}` : "#",
	// 							isActive: item.link
	// 								? pathname.startsWith(`/${item.link}/`) ||
	// 									pathname === `/${item.link}`
	// 								: false,
	// 						}),
	// 					);

	// 					navItems.push({
	// 						title: groupName,
	// 						url: "#",
	// 						icon: IconComponent,
	// 						isActive: secondLevelItems.some((sub) => sub.isActive),
	// 						items: secondLevelItems,
	// 					});
	// 				}
	// 			} else {
	// 				// 3-level menu (group -> subGroups -> menu items)
	// 				const secondLevelItems: NavSecondLevelItem[] = [];

	// 				for (const [subGroupName, subGroupItems] of Object.entries(
	// 					subGrouped,
	// 				)) {
	// 					if (!subGroupItems || subGroupItems.length === 0) continue;

	// 					const thirdLevelItems: NavSubItem[] = subGroupItems.map((item) => ({
	// 						title: item.menuName || "Third Level Item",
	// 						url: item.link ? `/${item.link}` : "#",
	// 						isActive: item.link
	// 							? pathname.startsWith(`/${item.link}/`) ||
	// 								pathname === `/${item.link}`
	// 							: false,
	// 					}));

	// 					secondLevelItems.push({
	// 						title: subGroupName,
	// 						url: "#",
	// 						isActive: thirdLevelItems.some((third) => third.isActive),
	// 						items: thirdLevelItems,
	// 					});
	// 				}

	// 				navItems.push({
	// 					title: groupName,
	// 					url: "#",
	// 					icon: IconComponent,
	// 					isActive: secondLevelItems.some((second) => second.isActive),
	// 					items: secondLevelItems,
	// 				});
	// 			}
	// 		}

	// 		const sortedNavItems = navItems.sort((a, b) => {
	// 			const aItems = groupedByMain[a.title] || [];
	// 			const bItems = groupedByMain[b.title] || [];
	// 			const aOrder = Math.min(
	// 				...aItems.map((item) => Number.parseFloat(item.displayOrder) || 0),
	// 			);
	// 			const bOrder = Math.min(
	// 				...bItems.map((item) => Number.parseFloat(item.displayOrder) || 0),
	// 			);
	// 			return aOrder - bOrder;
	// 		});

	// 		return sortedNavItems.length > 0 ? sortedNavItems : [];
	// 	} catch (error) {
	// 		console.error("Error transforming menu data:", error);
	// 		return [];
	// 	}
	// };

	const clearSearch = () => {
		setSearchQuery("");
	};

	const NavMainSkeleton = () => (
		<div className="p-2 space-y-1">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-3 px-2 py-2 bg-gray-300 opacity-20 rounded-md"
				>
					<div className="h-5 w-5 rounded bg-muted animate-pulse" />
					<div className="h-4 w-32 bg-muted rounded animate-pulse" />
				</div>
			))}
		</div>
	);

	const data = {
		user: {
			name: sessionData.data?.user.name ?? "",
			
			avatar: "/avatars/shadcn.jpg",
		},
		navMain:
			filteredMenuList && Array.isArray(filteredMenuList)
				? transformMenuData(filteredMenuList)
				: [],
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="border-b-1 -mt-[1px]">
				
			</SidebarHeader>
			<SidebarContent>
				<div className="p-3 border-b">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
						<input
							type="text"
							placeholder="Search menus..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-10 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[14px]"
						/>
						{searchQuery && (
							<button
								onClick={clearSearch}
								className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
								type="button"
							>
								<X className="h-3 w-3 text-gray-600" />
							</button>
						)}
					</div>
				</div>
				{/* {data.navMain.length > 0 ? (
					// <NavMain items={data.navMain} searchQuery={searchQuery} />
				) : searchQuery ? (
					<div className="p-4 text-center text-sm text-gray-500">
						No menu items found for "{searchQuery}"
					</div>
				) : (
					<NavMainSkeleton />
				)} */}
			</SidebarContent>
			<SidebarFooter>
				{/* <NavUser user={data.user} /> */}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}