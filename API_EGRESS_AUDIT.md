# API and Database Egress Audit

## 2026-07-17 implementation update

### Fixed

- `src/app/[location]/(public)/(pages)/locations/components/state-page/state-page.tsx`: the state page received the full state locality list in its server payload and immediately fetched the same list again from `/api/location-directory`. The client refetch was removed. Expected improvement: one complete state-locality response and one database read removed per state-page view (roughly 50% of that page's locality-query traffic).
- `src/lib/cache.ts`: `getSeoCitiesByStateFromDB` used React request memoization only. It now uses `unstable_cache` with the `locations` tag and a seven-day TTL. Expected improvement: repeated state page/API hits share one database result across requests and instances supported by the Next.js data cache; steady-state database egress approaches one projected state dataset per state per cache period.
- `src/app/[location]/(public)/(pages)/categories/[slug]/page.tsx` and `page-client.tsx`: category detail was fetched in a hydration-time `useEffect`. It is now read on the server through the existing seven-day `getCategoryBySlug` cache and passed to the client. Metadata and page rendering share the same persistent cache entry. Expected improvement: removes one browser API response per category-page view and repeated database reads between cache refreshes.
- `src/app/api/signup/location/route.ts`: the selected-location lookup used `SELECT *` against `australia_locations`. It now selects only the nine fields required to resolve a city. Expected improvement: avoids transferring unused static-table columns (notably descriptions/metadata) for every location selection.

### Static-data paths already optimized

- `src/lib/cache.ts`: active categories, category details/questions, professional packages, popular locations, states, state summaries, counts, nearby locations, and location index queries use explicit projections plus tagged `unstable_cache` entries. The full 9.3 MB `australia_locations` table is not stored as one Next.js cache value; results are bounded or partitioned by state to stay below the platform's per-entry limit.
- `src/app/api/signup/location/route.ts`: autocomplete is server-side, requires a query from the UI, caps results at 30 by default/100 maximum, aborts stale requests, and returns only projected columns. CDN caching is enabled. This replaces loading all Australian locations in the browser.
- `src/hooks/useCategories.ts`: SWR shares the category response, disables focus/reconnect refetches, and deduplicates for one hour.
- `src/app/api/admin/australia-locations/route.ts`: admin location browsing is server-paginated and search-filtered rather than returning the complete table.

### Dynamic data deliberately not cached

Authenticated notifications, conversations/messages, leads, credits, subscriptions, profile settings, refunds, tasks, and affiliate data remain uncached at the shared server layer because their results are user-specific or rapidly changing. Client deduplication/manual refresh is preferable for these paths.

### Remaining high-value follow-ups

- `src/components/notification/NotificationBell.tsx` and `src/hooks/useNotificationTitle.ts`: both observe notification changes, while responsive navbar branches can mount more than one bell. Cleanup exists, but the overlapping listeners should be consolidated into one notification provider. Expected improvement: up to two redundant realtime feeds per signed-in tab.
- `src/app/[location]/(public)/(pages)/messages/[convoId]/page-client.tsx`: creates one sidebar realtime channel per conversation and correctly removes them on cleanup. A user-level server broadcast/channel would reduce channel count from O(conversations) to O(1), but requires a coordinated realtime schema/event change and was not changed here.
- `src/hooks/useLead.ts` and `src/components/dashboard/ProviderDashboard/Providerdashboard.tsx`: the dashboard uses the full `/api/leads` payload for a count. Add an authenticated count-only endpoint before changing this, preserving authorization and user-specific behavior. Expected improvement: joined lead payload reduced to a single count on dashboard views.

Date: 2026-07-11

This note records likely repeated API/database traffic patterns found in the codebase.

## Main Findings

1. Notification realtime subscriptions are duplicated.

- `src/app/[location]/(public)/layout.tsx` mounts `NotificationHandler` globally.
- `src/hooks/useNotificationTitle.ts` opens two Supabase realtime channels for notification inserts and updates.
- `src/components/notification/NotificationBell.tsx` also fetches `/api/notifications` and opens another Supabase realtime channel.
- `NotificationBell` is mounted from both desktop and mobile navbar branches.

Impact: signed-in users can have overlapping realtime listeners for the same notification table/user, increasing Supabase realtime traffic.

Recommended fix: centralize notification state/subscription in one provider or hook, then let the bell and document title consume the same state.

2. `/api/leads` is heavy and reused for small dashboard counts.

- `src/hooks/useLead.ts` fetches full leads for the provider leads page.
- `src/components/dashboard/ProviderDashboard/Providerdashboard.tsx` also calls `/api/leads` just to count leads.
- `src/app/api/leads/route.ts` returns a large joined payload with customer data, answers, counts, status, and location fields.

Impact: the dashboard performs an expensive full lead query when it only needs summary values.

Recommended fix: add a lightweight endpoint such as `/api/leads/summary` or `/api/leads/count`.

3. Provider leads page loads credit estimates for all tasks.

- `src/components/showinglead/Leadpage.tsx` calls `fetchCreditEstimates()` after leads load.
- `src/services/credits.ts` maps that to `/api/admin/create-credit-estimate`.
- `src/app/api/admin/create-credit-estimate/route.ts` selects all tasks when no `task_id` is provided.

Impact: provider leads can trigger credit calculations for every task, not only visible/eligible leads.

Recommended fix: fetch estimates only for visible task IDs, or include estimated credits in the `/api/leads` response.

4. Credit topup fetches balance twice.

- `src/hooks/useCredit.ts` fetches balance on mount when `professionalId` exists.
- `src/components/payments/CreditTopup.tsx` calls `fetchBalance()` again when the modal/page opens.

Impact: small but unnecessary duplicate database query.

Recommended fix: avoid the explicit `fetchBalance()` in `CreditTopup` if `useCredit` already loaded it, or convert credit data to SWR/shared cache.

5. Some SWR hooks use default focus revalidation on DB-heavy routes.

Examples:

- `src/hooks/Admin/useAdminTasks.ts`
- `src/hooks/Admin/useTasksWithoutBudget.ts`
- `src/hooks/Admin/useAffiliatesAdmin.ts`
- `src/hooks/Admin/usePendingPayouts.ts`
- `src/hooks/useLeadProfile.ts`

Impact: switching tabs/windows can refetch admin/profile endpoints unexpectedly.

Recommended fix: set `revalidateOnFocus: false` for DB-heavy admin/profile hooks and use manual refresh where needed.

6. Messages page creates one realtime channel per conversation.

- `src/app/[location]/(public)/(pages)/messages/[convoId]/page-client.tsx` loops through conversations and subscribes to `sidebar:${convo.id}` for each one.

Impact: not an API polling loop, but users with many conversations can create many realtime channels.

Recommended fix: prefer one user-level/sidebar channel or one database change feed filtered by user where possible.

## Not Found

No runaway `setInterval` repeatedly calling database APIs was found. The intervals seen were mostly UI cleanup/check timers.

The main risk is duplicated fetch/realtime subscriptions and using large DB-backed routes for small UI needs.
