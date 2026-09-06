# LeadWise MVP Feature Overview

## Product Summary

LeadWise is a web-based lead management system for small sales teams. It gives teams one workspace to organize leads, move opportunities through a pipeline, schedule follow-ups, manage tasks, and review sales activity.

## MVP Positioning

Yes, this product can reasonably be represented as an MVP if the goal is to validate the core workflow:

> A small team can create a workspace, manage members, track leads through a pipeline, schedule follow-ups, assign tasks, and review basic sales activity from one application.

The current feature set is broad enough for an MVP demonstration, portfolio project, pilot release, or early user validation. It should not yet be described as a fully mature CRM or enterprise-ready platform without additional operational validation.

## Implemented MVP Features

### 1. Authentication and Access

- User registration with name, email, password, and role.
- User login and logout flows.
- Session-aware access to protected dashboard pages.
- Google authentication entry point.
- Route protection for authenticated dashboard areas.
- Role-aware access for workspace administration.

### 2. Workspace and Organization Management

- Create or configure a workspace during onboarding.
- Discover available workspaces.
- Join a workspace through a join request.
- View and manage workspace members.
- Assign employee and viewer roles.
- Review and manage workspace join requests.
- Store organization membership separately from user accounts.

### 3. Lead Management

- View all leads.
- Create new leads.
- View an individual lead.
- Edit lead information.
- Delete leads.
- Update lead status.
- Organize lead information for sales follow-up.

### 4. Sales Pipeline

- Visual pipeline view for lead progression.
- Move leads through sales stages by updating status.
- Dashboard pipeline summary.
- Lead priority and source visibility in dashboard views.

### 5. Tasks

- View tasks.
- Create tasks.
- View individual task details.
- Edit tasks.
- Delete tasks.
- Update task status.
- Support task-oriented sales work from the dashboard.

### 6. Follow-ups

- View follow-ups.
- Create scheduled follow-ups.
- View individual follow-up details.
- Edit follow-up information.
- Delete follow-ups.
- Update follow-up status.

### 7. Dashboard and Reporting

- Dashboard overview with lead and activity summaries.
- Recent leads table.
- Lead source chart.
- Lead priority view.
- Follow-up summary.
- Task and pipeline-oriented dashboard widgets.
- Analytics page for basic reporting.
- Notifications area in the dashboard experience.

### 8. AI Assistant

- Chatbot available throughout the application.
- Conversational input for LeadWise-related questions.
- Loading state while the AI service responds.
- Error message when the AI service is unavailable.
- Responsive chat panel for desktop and mobile screens.

### 9. User Experience and Technical Foundation

- Responsive layouts for desktop and mobile.
- App Router architecture with Next.js.
- TypeScript application code.
- MongoDB persistence through Mongoose models.
- Redux state management for authentication, organizations, leads, tasks, and users.
- Shared UI components and dashboard navigation.
- Privacy Policy and Terms of Service routes for public trust and authentication review.
- Site-wide metadata, sitemap, and robots configuration for SEO.

## Primary MVP User Journey

1. A user creates an account or signs in with Google.
2. The user creates or joins a workspace.
3. A workspace administrator reviews members and join requests.
4. The team creates and organizes leads.
5. Leads move through the pipeline as their status changes.
6. Team members schedule follow-ups and create tasks.
7. The team reviews dashboard summaries and analytics.
8. The AI assistant provides an additional help interface inside the product.

## Intended MVP Users

- Small sales teams.
- Startup founders managing early customer opportunities.
- Individual sales representatives.
- Agencies or service businesses that need lightweight lead tracking.
- Teams replacing spreadsheets with a shared lead workflow.

## Current MVP Boundaries

The following areas should be treated as future work or production-hardening items unless they have been separately tested and confirmed:

- Automated end-to-end and integration test coverage.
- Automated deployment checks and rollback strategy.
- Error monitoring, audit logging, and operational alerting.
- Email notifications and calendar integrations.
- Data export and import tools.
- Advanced search, filtering, and bulk actions.
- Granular permissions beyond the current workspace roles.
- Billing, subscriptions, and usage limits.
- Multi-factor authentication and advanced account recovery.
- Formal data retention, deletion, and privacy-request workflows.
- AI usage limits, prompt safety controls, and vendor data policies.
- Backup, recovery, performance, and security review at production scale.

## Recommended Product Description

Use this wording for a portfolio, demo, or early pilot:

> LeadWise is an MVP lead management platform that helps small teams organize leads, manage pipeline stages, schedule follow-ups, assign tasks, and collaborate within shared workspaces. It includes authentication, role-based workspace access, dashboard analytics, responsive layouts, and an integrated AI assistant.

Avoid claiming that it is enterprise-ready, fully compliant, or production-hardened until the boundary items above have been implemented and verified.
