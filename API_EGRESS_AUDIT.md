# API and Database Egress Audit

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
