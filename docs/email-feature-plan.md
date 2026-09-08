# LeadWise Email Feature Plan

## Goal

Allow LeadWise users to send professional emails to leads from inside the application, connect emails to follow-ups, and keep a basic history of email activity for each lead.

## Recommended MVP Scope

The first version should focus on reliable one-to-one email sending:

- Send an email from a lead detail page.
- Select the lead's email address automatically.
- Write a subject and message.
- Send immediately through a transactional email provider.
- Save a record of the attempt and its status.
- Show sent email history on the lead detail page.
- Allow users to send a follow-up email from an existing follow-up record.
- Prevent sending when the lead has no valid email address.
- Show clear success and failure messages in the UI.

Avoid building bulk campaigns, newsletters, marketing automation, or a full inbox in the first release. Those features add unsubscribe, consent, deliverability, segmentation, and compliance requirements.

## Product Decisions To Make

Before implementation, decide:

- Which email provider will be used: Resend, SendGrid, Postmark, Mailgun, or another provider.
- The verified sender email and sender display name.
- Whether users send from one LeadWise address or connect their own mailbox.
- Whether replies go to a shared inbox or directly to the sending user.
- Whether email sending is available to Admins only or to employees as well.
- Whether viewers can see email history.
- Whether emails are sent immediately only, or can also be scheduled.
- What maximum message length and attachment rules should apply.
- How many emails each organization can send per day.

For the simplest MVP, use one verified LeadWise sender address and a `Reply-To` address belonging to the current user when available.

## User Experience Changes

### Lead Detail Page

Add an email action with:

- Recipient field populated from the lead.
- Subject input.
- Message textarea.
- Optional reply-to address.
- Send button with loading state.
- Disabled state when the lead has no email address.
- Confirmation after successful sending.
- Inline error message after failure.

### Follow-up Flow

Add an email channel to follow-ups:

- Channel: email, call, or note.
- Optional subject and message for email follow-ups.
- Send now action for email follow-ups.
- Optional scheduled send in a later phase.
- Status values such as `draft`, `scheduled`, `sent`, `failed`, and `cancelled`.

### Email History

Show a compact timeline on each lead containing:

- Date and time.
- Sender.
- Recipient.
- Subject.
- Delivery status.
- Failure reason when available.

Do not display sensitive provider credentials or internal provider payloads in the UI.

## Backend Work Required

### 1. Email Provider Integration

Add a server-only email service module, for example:

- `app/lib/email.ts`
- `app/lib/email-templates.ts`

The service should:

- Accept a validated recipient, subject, message, and reply-to address.
- Call the selected provider SDK or HTTPS API.
- Return a provider message ID.
- Normalize provider errors into safe application errors.
- Never expose the provider API key to the browser.

Use the provider SDK only from server code or route handlers. Do not call the provider directly from a client component.

### 2. API Route

Add a protected route such as:

- `POST /api/email/send`
- Or `POST /api/leads/[leadId]/email`

The route should:

1. Authenticate the current user.
2. Resolve the active organization.
3. Verify that the user belongs to that organization.
4. Check the user's organization role.
5. Load the lead from the same organization.
6. Validate the lead email, subject, and message.
7. Apply rate limits.
8. Send through the provider.
9. Save the email activity.
10. Return a safe success or error response.

Never trust an organization ID, sender ID, or lead ID supplied by the client without checking ownership on the server.

### 3. Email Activity Model

Add a model such as `app/models/emailActivity.ts` with fields similar to:

- `organization`: organization reference.
- `lead`: lead reference.
- `sentBy`: user reference.
- `provider`: provider name.
- `providerMessageId`: provider message ID.
- `from`: sender address.
- `replyTo`: optional reply-to address.
- `to`: recipient address.
- `subject`: email subject.
- `body`: stored message content, subject to retention policy.
- `status`: `queued`, `sent`, `delivered`, `bounced`, `failed`.
- `failureReason`: safe failure description.
- `createdAt`: sent/request time.
- `updatedAt`: last status update.

Add indexes for organization, lead, and creation date so lead history loads efficiently.

### 4. Provider Webhook

For delivery tracking, add a webhook route such as:

- `POST /api/email/webhook`

The webhook should:

- Verify the provider signature.
- Find the activity using the provider message ID.
- Update delivery, bounce, complaint, or failure status.
- Ignore duplicate webhook events safely.
- Avoid logging message bodies, tokens, or personal data.

Webhook processing can be deferred until after immediate sending is working.

## Environment Variables

Add server-only values to `.env.local` and deployment settings:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=replace-with-provider-key
EMAIL_FROM="LeadWise <hello@example.com>"
EMAIL_TO=test-recipient@example.com
EMAIL_REPLY_TO=support@example.com
EMAIL_WEBHOOK_SECRET=replace-with-webhook-secret
```

Use the real verified domain and support address before production. Do not commit secrets or expose them in `NEXT_PUBLIC_*` variables.

Update the deployment provider with the same values and verify the sender domain through SPF, DKIM, and DMARC records.

## Security and Abuse Prevention

Required for the MVP:

- Keep provider credentials on the server only.
- Require authentication for every send request.
- Enforce organization membership and role permissions.
- Limit recipients to the selected lead unless an explicit feature allows otherwise.
- Validate and normalize email addresses.
- Limit subject and body length.
- Sanitize or safely render message content.
- Add per-user and per-organization rate limits.
- Prevent duplicate sends when a request is retried.
- Return generic provider errors to the browser.
- Avoid storing unnecessary personal data.
- Define how users request deletion of email history.
- Add unsubscribe handling before building bulk or marketing email features.

## Legal and Trust Updates

Update the existing Privacy Policy and Terms of Service to explain:

- That LeadWise processes lead contact information to send emails.
- Which email provider processes the data.
- How long email activity is retained.
- How users can request deletion or correction.
- That users are responsible for lawful outreach and consent.
- That LeadWise is not a tool for spam or unsolicited bulk email.
- How delivery failures, bounces, and complaints are handled.

Add a link to the policies near the send-email form if the product sends external communications on behalf of users.

## Testing Checklist

### Unit Tests

- Valid email addresses are accepted.
- Invalid or missing email addresses are rejected.
- Empty subjects and messages are rejected.
- Maximum lengths are enforced.
- Provider errors become safe application errors.
- Duplicate request protection works.

### API Tests

- Unauthenticated users cannot send emails.
- Users cannot send from another organization.
- Viewers cannot send if the permission policy forbids it.
- A lead from another organization cannot be accessed.
- Successful sends create an activity record.
- Failed sends create a failed activity record when appropriate.

### UI Tests

- Send button shows a loading state.
- Button cannot be clicked repeatedly during sending.
- Success and failure states are visible.
- Mobile layout works on narrow screens.
- Long subjects and messages do not break the layout.
- A lead without an email receives a clear explanation.

### Provider Verification

- Sender domain is verified.
- Test email reaches Gmail and Outlook.
- Reply-to behavior works.
- Bounce and complaint events update the activity status.
- SPF, DKIM, and DMARC are configured.

## Suggested Implementation Order

1. Select provider and verify the sender domain.
2. Add environment variables and server email service.
3. Add the email activity model.
4. Add protected send-email API route.
5. Add send-email UI to the lead detail page.
6. Add email history to the lead detail page.
7. Add permissions and rate limits.
8. Add tests and provider verification.
9. Add webhook delivery tracking.
10. Add scheduled follow-up email support.

## Definition of Done for the MVP

The feature is ready for an MVP pilot when:

- An authorized user can send an email from a lead page.
- The email arrives at a real test inbox.
- The app shows a safe success or failure result.
- The send attempt is stored against the correct organization and lead.
- Unauthorized users cannot send messages.
- Provider secrets are server-side only.
- Rate limits and basic validation are active.
- Privacy Policy and Terms of Service describe the feature.
- The feature works on desktop and mobile.
- The flow has automated or repeatable manual tests.
