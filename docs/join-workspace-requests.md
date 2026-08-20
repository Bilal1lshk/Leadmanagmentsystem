# Admin-approved workspace join requests

## Goal

Let a signed-in user who does not yet belong to a workspace discover eligible organizations and request access. An organization Admin reviews the request and either approves or rejects it. Only approval creates an `OrganizationMember` record.

This is safer than letting a user join immediately with an organization ID. It also lets an Admin control who can access the organization’s leads, tasks, follow-ups, and members.

## Recommended user experience

1. A signed-in user with no organization visits `/`.
2. The onboarding screen presents **Create a workspace** and **Join a workspace**.
3. The Join screen shows organizations that opted into discovery. It should support search by organization name.
4. The user selects an organization, optionally adds a message, and submits a request.
5. The user sees `Request pending` and cannot access dashboard data yet.
6. Organization Admins see pending requests in a **Workspace settings → Join requests** page.
7. An Admin approves or rejects a request.
8. On approval, the user becomes an `employee` member and can access `/dashboard` for that organization.

## Privacy decision: do not expose every organization by default

Do not return a global list of every organization to every user. Organization names can be sensitive.

Add a `discoverable` boolean to `Organization`, defaulting to `false`. Only organizations whose Admin has enabled discovery may appear in the join-workspace list. The list should return only safe fields such as organization name, company size, and logo—not owner or member details.

If public discovery is not wanted, use an Admin-issued invite link or code instead. Both approaches can coexist: invite codes can join immediately, while directory requests need approval.

## Data model

Create a `WorkspaceJoinRequest` collection/model.

| Field | Purpose |
| --- | --- |
| `user` | The requesting user (`User` reference) |
| `organization` | The requested organization (`Organization` reference) |
| `message` | Optional request message, trimmed and length-limited |
| `status` | `pending`, `approved`, `rejected`, or `cancelled` |
| `reviewedBy` | The Admin who reviewed it (`User` reference) |
| `reviewedAt` | Timestamp of approval/rejection |
| `createdAt`, `updatedAt` | Standard audit timestamps |

Indexes:

- Unique compound index on `{ user, organization }` so a user cannot create duplicate requests.
- Index on `{ organization, status, createdAt }` for the Admin request queue.

Keep `OrganizationMember` as the single source of truth for actual access. A join request by itself must never grant access.

## API contract

All routes authenticate through the existing HTTP-only JWT cookie. Never accept a user ID from the client as authorization.

### List discoverable organizations

`GET /api/organization/discover?search=acme`

Rules:

- Requires a logged-in user with no organization membership.
- Returns only `discoverable: true` organizations.
- Supports a trimmed, rate-limited, case-insensitive name search.
- Paginate results; do not return an unbounded organization list.

Response shape:

```json
{
  "success": true,
  "organizations": [
    { "_id": "...", "name": "Acme", "companysize": "11-50" }
  ],
  "nextCursor": null
}
```

### Submit a join request

`POST /api/organization/join-requests`

Request body:

```json
{ "organizationId": "...", "message": "I'd like to join the sales team." }
```

Rules:

- Require authentication.
- Reject if the user already belongs to any organization (the current single-workspace policy).
- Reject if the organization is not discoverable or does not exist.
- Create a `pending` request only.
- Return `409` if a request already exists for this user and organization.

### View the requester’s status

`GET /api/organization/join-requests/mine`

Returns the requester’s pending/rejected requests. This drives the onboarding `Pending approval` state.

### Admin request queue

`GET /api/organization/:organizationId/join-requests`

Rules:

- Require authentication.
- Verify the caller is an `Admin` member of this exact organization.
- Return pending requests with requester name/email and message.

### Approve or reject

`PATCH /api/organization/:organizationId/join-requests/:requestId`

Request body:

```json
{ "action": "approve" }
```

Rules:

- Require an Admin membership in that organization.
- Only process a request currently in `pending` state.
- On `approve`, create `OrganizationMember` with role `employee`, then set the request to `approved` with reviewer information.
- On `reject`, set the request to `rejected` with reviewer information.
- Make the approval operation idempotent and handle duplicate membership safely.

Use a MongoDB transaction if the deployment uses a replica set. Otherwise use the same compensating-write pattern used for organization creation: if member creation fails, do not mark the request approved.

## Frontend integration

On the existing no-workspace onboarding screen:

- Add a `Join a workspace` tab.
- Fetch discoverable organizations only after the user opens the tab.
- Add search and a `Request to join` action for each organization.
- After submission, replace the form with a pending state and a refresh action.
- Polling is optional; initially, refresh the request state when the user revisits `/` or presses `Check status`.

For Admins:

- Add a Workspace Settings page.
- Add a `Join requests` badge with the pending count.
- Provide approve/reject actions with a confirmation step for approval.

Redux should hold the loaded directory, request state, and loading/error state for the current browser session. The server remains authoritative: every access API must continue verifying organization membership.

## Authorization checklist

- Only authenticated users can discover or request access.
- Only users without an organization can request access under the one-workspace policy.
- Only organization Admins can view/review that organization’s requests.
- A request does not grant access.
- Every leads/tasks/follow-ups/users endpoint continues using verified membership, not only a client-provided organization ID.
- Rate-limit discovery and submission to prevent directory scraping and spam.
- Audit approvals and rejections with reviewer and timestamp.

## Suggested rollout

1. Add the model and Admin-only API routes.
2. Add the discoverable setting, disabled by default.
3. Add the user request UI and pending state.
4. Add the Admin review UI.
5. Add notification delivery (in-app first, email later) after the core workflow works.
6. Keep the current workspace-code join flow as an optional faster path, or remove it if every membership must be explicitly approved.
