"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CustomBreadcrumb() {
	const pathname = usePathname();

	// Function to capitalize and format breadcrumb titles
	const formatTitle = (segment: string) => {
		// Handle common cases
		if (segment === '') return '';
		
		
		const hyphenCount = (segment.match(/-/g) || []).length;
		
		
		if (hyphenCount > 1) {
			return null; 
		}
		
		if (hyphenCount === 1) {
			return segment
				.replace(/-/g, ' ')
				.replace(/\b\w/g, (char) => char.toUpperCase());
		}
		
		// No hyphens, just capitalize
		return segment
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	// Function to detect if a segment is a dynamic route parameter
	const isDynamicSegment = (segment: string) => {
		// Common patterns for dynamic route IDs / slugs
		const dynamicPatterns = [
			/^[0-9]+$/, // Pure numeric IDs (e.g., "123", "456")
			/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i, // UUID v4
			/^[a-f0-9]{24}$/i, // MongoDB ObjectIds
			/^[a-zA-Z0-9_]{10,}$/, // Long random strings (no hyphen); keep underscore-only long tokens
			// Note: do NOT classify single-hyphen routes (e.g., 'first-premium') as dynamic
			/\b\w{21,}\b/,

			/^(?:[a-z0-9]+-){2,}[a-z0-9]+$/i, // Only treat multi-hyphen slugs as dynamic
		];
		return dynamicPatterns.some((pattern) => pattern.test(segment));
	};

	// Generate breadcrumbs from pathname
	const generateBreadcrumbs = () => {
		const segments = pathname.split('/').filter(Boolean);
		const breadcrumbs: {
			title: string; href: string | null; // No href for current page
			isCurrentPage: boolean;
		}[] = [];

		// Filter out dynamic/slug segments anywhere in the path
		const filteredSegments = segments.filter((segment) => !isDynamicSegment(segment));

		// Add each remaining segment (excluding Home)
		filteredSegments.forEach((segment, index) => {
			const formattedTitle = formatTitle(decodeURIComponent(segment));
			if (formattedTitle === null) return;
			const href = '/' + filteredSegments.slice(0, index + 1).join('/');
			const isCurrentPage = index === filteredSegments.length - 1;
			breadcrumbs.push({ title: formattedTitle, href: isCurrentPage ? null : href, isCurrentPage });
		});

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	// Don't render breadcrumb if there are no valid breadcrumb items
	if (breadcrumbs.length === 0) {
		return null;
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((item, index) => (
					<React.Fragment key={`${item.href || item.title}-${index}`}>
						<BreadcrumbItem>
							{item.href ? (
								<BreadcrumbLink asChild>
									<Link 
										href={item.href} 
										className="hover:text-blue-600 transition-colors duration-200"
									>
										{item.title}
									</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="font-medium text-foreground">
									{item.title}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 && (
							<BreadcrumbSeparator />
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}