# Product Requirements Document (PRD)
## Sistem Online Tiket Cross-Platform dengan PWA

**Status**: Rework Required - Agentic Alignment v1.4
**Version**: 1.4
**Last Updated**: 2026-09-16
**Governance Framework**: OODA Loop + Separation of Duty  
**Author**: vergenscande  

---

## 📋 Table of Contents
1. [Primary Goal & Constraints](#primary-goal--constraints)
2. [Agentic Governance Model](#agentic-governance-model)
3. [Decision Authority & Approval Gates](#decision-authority--approval-gates)
4. [Executive Summary](#executive-summary)
5. [Project Overview](#project-overview)
6. [Technical Architecture](#technical-architecture)
7. [Monorepo Structure](#monorepo-structure)
8. [Visual Design Prototype](#visual-design-prototype)
9. [Feature Requirements (OODA-Aligned)](#feature-requirements-ooda-aligned)
10. [Technology Stack](#technology-stack)
11. [Deployment Strategy](#deployment-strategy)
12. [Database Schema](#database-schema)
13. [Concurrency & Atomic Locking Strategy](#concurrency--atomic-locking-strategy)
14. [Error Handling & Structured Logging](#error-handling--structured-logging)
15. [Tech Critic Review (Assumptions & Risks)](#tech-critic-review-assumptions--risks)
16. [Security Considerations](#security-considerations)
17. [Development Roadmap](#development-roadmap)

---

## Primary Goal & Constraints

### Primary Goal (PRIMARY_GOAL)
```
Build a scalable, serverless PWA for online ticket management that:
- Supports millions of concurrent transactions
- Provides sub-2-second load time with offline capability
- Maintains 99.9% uptime with zero-infrastructure operations
- Enables seamless cross-platform experience (web + mobile)
```

### Established Constraints (LOCKED)

⚠️ **These constraints are LOCKED and require explicit user approval to change:**

| Constraint | Decision | Rationale | Change Policy |
|-----------|----------|-----------|----------------|
| **Hosting Platform** | Vercel Serverless | Zero ops overhead, auto-scaling | Requires user approval + 2-week migration plan |
| **Database** | Supabase PostgreSQL | Real-time capabilities, built-in auth | Requires user approval + data migration strategy |
| **Frontend Framework** | Next.js 14+ | SSR/SSG, PWA support, API routes | Requires user approval + codebase rewrite |
| **Monorepo Tooling** | pnpm + Turbo | Fast builds, incremental compilation | Requires user approval + workspace migration |
| **Language** | TypeScript strict mode | Type safety, catch bugs early | Enforced on all packages |
| **Package Structure** | Monorepo (shared/web/api/mobile/admin) | Scalability, DRY principle | Changes require architectural review |
| **Payment Gateway** | Stripe / Xendit | PCI-DSS compliant, mature ecosystem | Changes require security audit |
| **Storage** | Supabase Storage (S3-compatible) | Consistent with DB infrastructure | Changes require migration plan |

---

## Agentic Governance Model

### Separation of Duty (No Self-Review)

Development follows strict role separation:

| Role | Responsibility | Authority |
|------|---------------|-----------|
| **Builder** (Dev/Engineer) | Implement features, unit tests | Execute code changes |
| **Tech Critic** | Challenge assumptions, find risks | Block risky implementations |
| **QA Engineer** | Verify acceptance criteria, edge cases | Approve feature quality |
| **Security Engineer** | Threat modeling, OWASP check | Approve security implementation |
| **Product Manager** | Feature scope, business validation | Approve business logic |

### Machine-Readable Verdicts

Every significant implementation requires one of:
```
✅ APPROVED   - Meets all standards, no critical issues
🔄 REWORK     - Specific findings must be fixed, details in comment
🚫 BLOCKED    - Fatal violation, escalate to user for decision
```

Example:
```
Feature: User Authentication
Builder: Implemented with NextAuth.js
Tech Critic Verdict: 🔄 REWORK
Issues:
  1. Missing rate-limiting on login endpoint
  2. No structured logging for auth failures
  3. Hardcoded JWT secret in .env (should rotate)
Fix By: [Date]
```

### OODA Execution Contract

Every feature and architectural decision follows this sequence:

1. **Observe**: record requirements, dependencies, evidence, and open assumptions.
2. **Orient**: identify security, concurrency, performance, and product constraints.
3. **Decide**: define the smallest implementation, acceptance criteria, owner, and reviewer.
4. **Act**: implement on a feature branch, run focused checks, and submit evidence for independent review.

The Builder cannot approve their own implementation. A feature is not complete until the required reviewer verdict is recorded as `approved`.

### Review Evidence Contract

Each review must include:

| Field | Requirement |
|---|---|
| `scope` | Feature, decision, or risk being reviewed |
| `evidence` | Test output, load-test report, security result, or deployment preview |
| `findings` | Specific defects, assumptions, and residual risks |
| `verdict` | Exactly one of `approved`, `rework`, `blocked-escalate` |
| `owner` | Person responsible for resolving `rework` findings |
| `next_review` | Trigger or date for re-review |

## Decision Authority & Approval Gates

### Verdict Authority

| Verdict | Authority | Required action | SLA |
|---|---|---|---|
| `approved` | Assigned independent reviewer | Allow the dependent work to proceed | Within 2 business days |
| `rework` | Reviewer who raised the finding | Builder fixes the named findings and resubmits evidence | Before merge |
| `blocked-escalate` | Expert Reviewer / project owner | Stop dependent work and decide mitigation, scope change, or constraint change | Within 24 hours |

The **Expert Reviewer (user/project owner)** is the final authority for blocked architectural, security, deployment, and scope decisions. A blocked verdict may only be cleared by a new recorded verdict after the mitigation evidence is reviewed. Locked constraints cannot be changed by the Builder or Tech Critic.

### Approval Gates

| Gate | Required reviewers | Evidence before approval |
|---|---|---|
| Architecture and stack | Expert Reviewer + Tech Critic | Decision record, dependency/version validation, threat and scalability assumptions |
| Visual design prototype | Expert Reviewer + Tech Critic + QA | HTML prototype preview, responsive screenshots, interaction checklist, accessibility and performance findings |
| Database and RLS | Backend Builder + Security Reviewer + Expert Reviewer | Migration review, RLS tests, rollback plan |
| Payment and inventory | Backend Builder + QA + Security Reviewer | Idempotency, webhook retry/reconciliation, concurrency report with zero overbooking |
| Production deployment | QA + Security Reviewer + Expert Reviewer | CI result, smoke test, observability check, rollback rehearsal |

If a named reviewer is unavailable, the gate is `blocked-escalate`; the Builder must not self-approve the missing review.

### Decisions Still Requiring Explicit Lock

The following alternatives are proposals, not implementation permissions, until the Expert Reviewer records an `approved` decision:

- Authentication: Supabase Auth or NextAuth.js
- State management: Zustand or Redux Toolkit
- Data access: Supabase Client or Prisma
- Queue: Bull Queue or pg-boss
- Logging: Pino or Winston
- Email provider: SendGrid or Resend
- Redis-compatible lock provider and production plan

Until each choice is locked, implementation must not introduce both alternatives or silently choose one.

---

## Executive Summary

**Online Ticket** adalah aplikasi sistem manajemen tiket berbasis Progressive Web App (PWA) yang memungkinkan pengguna untuk membeli, mengelola, dan menggunakan tiket secara online dengan dukungan cross-platform (web, iOS, Android).

### Key Objectives
- ✅ Aplikasi responsif dan offline-capable dengan PWA technology
- ✅ Multi-platform support (web, mobile via PWA)
- ✅ Serverless architecture dengan Vercel deployment
- ✅ Database real-time dengan Supabase (PostgreSQL)
- ✅ File storage terdesentralisasi menggunakan Supabase Storage
- ✅ Monorepo structure untuk scalability dan maintainability
- ✅ Modern development workflow dengan state-of-the-art tooling

---

## Project Overview

### Business Goals
1. **User Acquisition**: Mudah diakses dari web dan mobile
2. **Scalability**: Dapat menangani jutaan transaksi tiket
3. **Real-time Updates**: Notifikasi real-time untuk pembelian dan perubahan status
4. **Offline Support**: Pengguna dapat melihat tiket mereka tanpa koneksi internet
5. **Cost Efficiency**: Serverless architecture meminimalkan operational cost

### Target Users
- **Pengguna Akhir**: Pembeli tiket event, konser, bioskop, transportasi
- **Event Organizer**: Admin yang mengelola event dan tiket
- **System Admin**: Tim teknis untuk maintenance dan support

### Success Metrics
- Time to load: < 2 detik (web), < 3 detik (mobile)
- Offline availability: 95%+ uptime
- Database response: < 200ms (p95)
- Mobile conversion rate: > 40% dari total traffic
- User retention: > 60% (30-day)

---

## Technical Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────┐
│         Client Layer (PWA)                   │
│  ┌──────────────────────────────────────┐   │
│  │  Web UI (Next.js App Router)         │   │
│  │  Service Worker (Offline Support)    │   │
│  │  Local Cache (IndexedDB/LocalStorage)│   │
│  └──────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│      API Gateway & Middleware                │
│  ┌──────────────────────────────────────┐   │
│  │  Vercel Edge Functions               │   │
│  │  Authentication (approved provider)  │   │
│  │  Rate Limiting & DDoS Protection    │   │
│  └──────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │ REST/GraphQL
┌──────────────────▼──────────────────────────┐
│      Backend Services (Vercel Serverless)   │
│  ┌──────────────────────────────────────┐   │
│  │  API Routes (Node.js/Next.js)        │   │
│  │  Business Logic Layer                │   │
│  │  Event Processing & Notifications    │   │
│  └──────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┬────────────┐
        │                     │            │
┌───────▼──────┐   ┌──────────▼──┐   ┌────▼─────────┐
│   Supabase   │   │ Supabase    │   │  Vercel      │
│ PostgreSQL   │   │  Storage    │   │  Analytics   │
│   (DB)       │   │  (Files)    │   │  (Logs)      │
└──────────────┘   └─────────────┘   └──────────────┘
```

### Architecture Principles
- **Serverless First**: Zero infrastructure management
- **Stateless APIs**: Horizontal scalability
- **Event-Driven**: Asynchronous processing untuk non-blocking operations
- **Database Optimization**: Indexed queries, connection pooling
- **Security by Default**: End-to-end encryption, role-based access control

---

## Monorepo Structure

### Directory Layout
```
online-ticket-no-docker/
├── packages/
│   ├── shared/                          # Shared utilities & types
│   │   ├── src/
│   │   │   ├── types/                   # TypeScript interfaces
│   │   │   ├── utils/                   # Common utilities
│   │   │   ├── constants/               # App constants
│   │   │   └── hooks/                   # Custom React hooks
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                             # Main web application (Next.js)
│   │   ├── src/
│   │   │   ├── app/                     # App Router pages
│   │   │   │   ├── (auth)/              # Authentication pages
│   │   │   │   ├── (dashboard)/         # Dashboard layout
│   │   │   │   ├── (public)/            # Public pages
│   │   │   │   └── api/                 # API routes
│   │   │   ├── components/              # React components
│   │   │   │   ├── common/
│   │   │   │   ├── features/
│   │   │   │   └── layouts/
│   │   │   ├── lib/                     # Client utilities
│   │   │   │   ├── supabase.ts          # Supabase client config
│   │   │   │   ├── db.ts                # Database queries
│   │   │   │   └── auth.ts              # Auth helpers
│   │   │   ├── services/                # External services integration
│   │   │   ├── store/                   # State management (Zustand/Redux)
│   │   │   ├── styles/                  # Global styles & Tailwind
│   │   │   ├── public/                  # Static assets
│   │   │   └── middleware.ts            # Next.js middleware
│   │   ├── public/
│   │   │   ├── manifest.json            # PWA manifest
│   │   │   ├── service-worker.ts        # Service Worker
│   │   │   └── icons/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api/                             # Backend API (Next.js API Routes)
│   │   ├── src/
│   │   │   ├── routes/                  # API endpoint handlers
│   │   │   │   ├── auth/
│   │   │   │   ├── tickets/
│   │   │   │   ├── events/
│   │   │   │   ├── users/
│   │   │   │   └── payments/
│   │   │   ├── middleware/              # Custom middleware
│   │   │   │   ├── auth.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── services/                # Business logic
│   │   │   │   ├── ticketService.ts
│   │   │   │   ├── eventService.ts
│   │   │   │   └── paymentService.ts
│   │   │   ├── db/                      # Database layer
│   │   │   │   ├── client.ts            # Supabase client
│   │   │   │   └── queries/
│   │   │   ├── utils/                   # Helper functions
│   │   │   └── types/                   # Type definitions
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mobile/                          # PWA-optimized mobile version
│   │   ├── src/
│   │   │   ├── pages/                   # Mobile-specific pages
│   │   │   ├── components/              # Mobile components
│   │   │   └── styles/                  # Mobile-specific styles
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin/                           # Admin dashboard (optional)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── apps/                                # Standalone applications (if needed)
│   └── cli/                             # CLI tools for management
│
├── docs/                                # Documentation
│   ├── API.md                           # API documentation
│   ├── DATABASE.md                      # Database schema
│   ├── DEPLOYMENT.md                    # Deployment guide
│   └── CONTRIBUTING.md                  # Contribution guidelines
│
├── design-prototype/                    # Standalone HTML visual prototype
│   ├── pages/                            # Page-by-page screens and flows
│   ├── styles/                           # Tokens, layout, components
│   ├── scripts/                          # Fixture-only interactions and motion
│   ├── assets/                           # Approved prototype assets
│   ├── fixtures/                         # Non-sensitive sample data
│   └── README.md                         # Local preview and review guide
│
├── .github/
│   ├── workflows/                       # CI/CD workflows
│   │   ├── test.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   └── ISSUE_TEMPLATE/
│
├── .env.example                         # Environment template
├── .gitignore
├── .eslintrc.json                       # ESLint configuration
├── .prettierrc                          # Prettier configuration
├── tsconfig.json                        # Root TypeScript config
├── turbo.json                           # Turbo configuration (monorepo orchestration)
├── package.json                         # Root package.json
├── yarn.lock / pnpm-lock.yaml          # Lock file
├── README.md
├── PRD.md
└── LICENSE
```

### Monorepo Tools
- **Package Manager**: pnpm (fast, disk space efficient)
- **Monorepo Orchestration**: Turbo (incremental builds, caching)
- **Dependency Management**: Workspace protocol
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Jest, Vitest, Playwright E2E

---

## Visual Design Prototype

### Purpose and Sequence

Before building the production UI inside the monorepo, the team must create a standalone visual prototype using plain HTML, CSS, and browser JavaScript. This prototype is a rough but interactive representation used to validate information architecture, visual direction, responsive behavior, motion, and interaction states with the Expert Reviewer.

The delivery sequence is locked:

```text
Observe requirements
  -> Build standalone HTML visual prototype
  -> Review every page and interaction state
  -> Record approved design evidence
  -> Translate approved patterns into monorepo components
  -> Implement production behavior and data integration
```

The HTML prototype must not become a parallel production application. It may use fixture data only, must not contain real credentials, and must not be connected to Supabase, payment providers, authentication, or production APIs.

### Prototype Structure

```text
design-prototype/
├── index.html                 # Prototype entry and page navigation
├── pages/                     # One HTML page or route per screen
├── styles/
│   ├── tokens.css             # Color, type, spacing, motion tokens
│   ├── layout.css             # Responsive layout primitives
│   └── components.css         # Buttons, forms, cards, dialogs, states
├── scripts/
│   ├── prototype-router.js     # Fixture-only navigation
│   ├── interactions.js         # Tabs, filters, dialogs, forms, states
│   └── motion.js               # Reduced-motion-aware transitions
├── assets/
│   ├── images/                # Approved visual assets or placeholders
│   └── icons/
├── fixtures/                  # Non-sensitive representative data
└── README.md                  # How to preview and review the prototype
```

The prototype should open locally in a browser without a build step where possible. If a local server is needed for module loading, it must use a documented static command and remain separate from the production development server.

### Visual Direction and Design System

The visual system must feel intentional, accessible, and appropriate for a ticket marketplace rather than a generic dashboard:

- Define CSS custom properties for color roles, typography, spacing, radii, elevation, focus, and motion duration.
- Use an expressive display typeface for event identity and a highly readable UI typeface for controls and transactional content. Font loading must have a fallback and must not block content.
- Use a balanced palette with a clear brand accent, neutral surfaces, semantic success/warning/error colors, and sufficient contrast. Do not rely on purple-on-white defaults or a single-hue interface.
- Prefer structured full-width sections and focused cards only for repeated items, dialogs, and genuinely framed tools. Do not nest cards inside cards.
- Use familiar icons for compact actions and provide accessible names/tooltips for unfamiliar icon-only controls.
- Define mobile, tablet, and desktop breakpoints through layout constraints rather than scaling every value with viewport width.

### Motion, 3D, and Interactive Design Rules

Every page prototype must demonstrate the states that users will experience, not only the default screenshot:

- **Motion**: page entrance, staggered event discovery, filter transitions, modal/dialog transitions, loading/success/error transitions, and checkout progress. Motion must communicate hierarchy and state, not decorate every element.
- **3D elements**: use purposeful CSS 3D or Three.js enhancements for event hero objects, ticket/card perspective, map or venue previews, and interactive ticket previews. 3D must remain optional progressive enhancement, have a static fallback, preserve readable content, and respect `prefers-reduced-motion`.
- **Interactions**: navigation, search, filters, tabs, pagination, favorite/save, ticket quantity stepper, checkout stepper, dialogs, tooltips, copy/download actions, QR/ticket preview, organizer forms, and offline/retry states must be clickable in the prototype.
- **Responsive behavior**: each page must be tested at mobile, tablet, and desktop widths. Navigation, tables, grids, forms, dialogs, and ticket previews must reflow without overlap or horizontal clipping.
- **Accessibility**: keyboard navigation, visible focus, semantic landmarks, labels, error descriptions, color-independent status, sufficient contrast, touch targets, and reduced-motion behavior are required in the prototype.
- **Performance**: avoid large decorative assets, render only necessary 3D scenes, lazy-load noncritical media, and provide a loading state for every interactive surface.

### Global Click Feedback Contract

Every clickable element in the rough HTML prototype and the later monorepo UI must provide immediate, intentional feedback. A click is not considered complete when only the data state changes; the visual response must also explain that the action was received.

| Interaction moment | Required feedback | Constraint |
|---|---|---|
| Pointer hover | Subtle color, elevation, border, or position change | Must not cause layout shift or obscure adjacent content |
| Pointer/touch press | `:active` compression or tactile scale response, typically 0.97-0.99 | Must complete quickly and remain usable on touch screens |
| Click/tap activation | Short ripple or localized highlight from the activation point | Must be clipped to the control and never become decorative noise |
| Keyboard focus | Visible focus ring and equivalent active state | Cannot rely on color alone |
| Async action | Loading indicator or pending state with the control disabled | Prevent duplicate submission and preserve accessible name |
| Success | Check, color, or toast transition that confirms the result | Must be announced through an accessible status region when meaningful |
| Failure | Error shake or border transition plus actionable message | Respect reduced motion and never communicate failure through motion alone |
| Toggle/selection | Animated state transition and `aria-pressed`/selected state | State must remain understandable without animation |

Implementation rules:

- Use one reusable interaction utility/class for buttons, links, chips, cards, tabs, menus, steppers, dialogs, and category controls.
- Use CSS transitions/keyframes for local feedback; use JavaScript only to calculate ripple position or coordinate state changes.
- Keep click feedback between 120-280ms unless the action is a documented loading or page-transition state.
- Do not add animation to sensitive payment or QR scanning surfaces that could distract from reading or scanning.
- Every animated control requires `prefers-reduced-motion: reduce` behavior that removes displacement and reduces feedback to an instant color/border/focus change.
- Every prototype page review must record click-feedback coverage for default, hover, focus, press, success, pending, error, disabled, and reduced-motion states.

### Page-by-Page Design Breakdown

Each page below requires a standalone prototype state, responsive layout, interaction states, and an independent review verdict before production implementation.

| Page / ID | Purpose and visual composition | Styling, motion, and 3D direction | Required interactions and states |
|---|---|---|---|
| `home-001` Home / discovery | Strong event-led first viewport, search, featured events, categories, trust and service signals | Editorial event imagery, restrained depth, staggered event reveals, optional 3D event object with static image fallback | Search, category navigation, featured carousel, loading, empty, offline, keyboard focus |
| `event-001` Event listing | Filterable event grid/list with location, date, price, category, and sort controls | Dense scan-friendly layout, filter drawer on mobile, card hover/press motion, optional map depth layer | Search, filters, sort, pagination, favorites, no results, loading, API failure |
| `event-002` Event detail | Hero media, event facts, venue, organizer, ticket types, availability, reviews | Hero media transition, ticket-tier emphasis, venue/map preview with optional 3D perspective | Choose ticket type, quantity, favorite, share, realtime availability, sold-out, expired event |
| `auth-001` Login and signup | Focused authentication form with provider actions and clear trust cues | Minimal motion, inline validation, no distracting 3D around sensitive forms | Password visibility, provider login, validation errors, loading, rate limit, success, recovery |
| `auth-002` Verification and reset | Clear status-led flow for email verification and password reset | Progress/status animation with reduced-motion fallback | Resend, change email, expired link, invalid token, completed state |
| `checkout-001` Checkout | Stepper for attendee details, order summary, payment handoff, and terms | Persistent summary on desktop, bottom sheet on mobile, progress transition, no decorative 3D that competes with payment | Quantity edit, voucher, terms, submit, timeout, locked inventory, validation and retry |
| `payment-001` Payment result | Success, pending, failed, and cancelled outcomes with next actions | Outcome-specific semantic styling, concise confirmation motion, ticket reveal transition | Retry payment, view order, contact support, webhook pending, duplicate request |
| `ticket-001` Ticket wallet | Scannable list of upcoming, past, used, refunded, and cancelled tickets | Ticket cards with controlled perspective/3D preview, offline badge, subtle list motion | Search, filter, open ticket, transfer, refund request, loading, empty, offline |
| `ticket-002` Ticket and QR detail | Large QR, event identity, ticket facts, entry instructions, safety status | High-contrast scan surface, optional physical-ticket perspective, no motion during scanning | Brightness mode, zoom, download, add to wallet, offline warning, used/invalid state |
| `organizer-001` Organizer dashboard | Sales, attendance, events, alerts, and quick actions | Operational density, charts with progressive reveal, restrained data animation | Date range, event switcher, export, loading, permission denied, no data |
| `organizer-002` Event editor | Multi-step event and ticket-type creation form | Section transitions, image crop preview, clear unsaved-change state | Draft/save/publish, ticket tier editor, image upload, validation, conflict, autosave failure |
| `admin-001` Admin operations | Users, events, orders, reports, config, and audit activity | Table-first responsive layout, status tokens, no decorative 3D in high-risk operations | Search, filters, bulk actions, confirmation dialog, audit detail, permission denied |
| `system-001` System states | 404, 500, maintenance, offline, empty, loading, and access denied | Calm branded fallback, purposeful recovery motion, static fallback for all effects | Retry, go home, report issue, reconnect, cached content, keyboard recovery |

### Prototype Acceptance Criteria

- All page IDs in the breakdown exist in the prototype navigation or documented flow.
- Each page has desktop, tablet, and mobile states plus loading, empty, error, success, and permission/offline states where applicable.
- Every listed interaction is demonstrable with fixture data and has a visible state transition.
- Motion and 3D have static and reduced-motion fallbacks; no critical information depends on animation or WebGL.
- Keyboard, focus, contrast, touch target, and semantic HTML checks pass for every page.
- The Expert Reviewer and Tech Critic record `approved` before the pattern enters the monorepo UI package.
- Every clickable element passes the Global Click Feedback Contract, including visible press feedback and reduced-motion behavior.
- Prototype review evidence includes screenshots or preview URL, interaction checklist, accessibility findings, performance notes, owner, and next review date.

### Prototype Implementation Tracking

Status is updated together with prototype changes so visual decisions remain traceable.

| Page ID | Current implementation | Remaining prototype work | Evidence / file |
|---|---|---|---|
| `home-001` | Partial | Featured carousel, loading, offline state, and complete keyboard review | `design-prototype/index.html` |
| `event-001` | Partial | Functional pagination, date/price/radius filters, loading, API failure, and map fallback | `design-prototype/pages/events.html` |
| `event-002` | Partial | Realtime availability fixture, sold-out/expired states, related events, and venue fallback | `design-prototype/pages/event-detail.html` |
| `auth-001` | Partial | Rate-limit, duplicate-email, recovery, terms validation, and provider state fixtures | `design-prototype/pages/auth.html` |
| `auth-002` | Partial | Expired/invalid token and completed verification states | `design-prototype/pages/auth-status.html` |
| `checkout-001` | Partial | Interactive stepper, timeout, locked inventory, and retry states | `design-prototype/pages/checkout.html` |
| `payment-001` | Partial | Retry/support behavior, webhook-pending detail, and duplicate-request fixture | `design-prototype/pages/payment-result.html` |
| `ticket-001` | Partial | Refunded/cancelled data, transfer/refund states, and offline transition test | `design-prototype/pages/ticket-wallet.html` |
| `ticket-002` | Implemented fixture | QR visual review, brightness/zoom/download verification, and invalid/used acceptance evidence | `design-prototype/pages/ticket-detail.html` |
| `organizer-001` | Pending | Build dashboard fixture and permission/no-data states | Not created |
| `organizer-002` | Pending | Build editor fixture, unsaved changes, conflict, and autosave failure | Not created |
| `admin-001` | Pending | Build operations fixture, RBAC denial, confirmation, and audit detail | Not created |
| `system-001` | Implemented fixture | Connect shared states to page review evidence and keyboard recovery checks | `design-prototype/pages/system-states.html` |

Current prototype verdict: `rework`.
The prototype must not enter the monorepo UI package until the remaining pages, state coverage, responsive/accessibility evidence, and independent review verdicts are recorded.

### Prototype Visual Change Log

| Date | Change | Reason | Tracking impact |
|---|---|---|---|
| 2026-09-16 | Added high-contrast ticket detail surface with QR fixture, zoom, bright scan mode, download, wallet save, and ticket states | Close the broken wallet-to-ticket flow and cover `ticket-002` interaction direction | `ticket-002` moved from pending to implemented fixture |
| 2026-09-16 | Added system-state gallery for 404, 500, maintenance, offline, loading, empty, and access denied | Establish a shared visual language for recovery and degraded states | `system-001` moved from pending to implemented fixture |
| 2026-09-16 | Updated prototype README page inventory | Keep implementation status visible beside the prototype | Tracking baseline established |

### Prototype-to-Monorepo Handoff

After visual approval, the Builder creates a translation map from prototype primitives to production components. The handoff must identify tokens, components, page templates, responsive rules, motion presets, 3D boundaries, accessibility behavior, and fixture-to-API data contracts. The prototype remains available as a visual reference but is not treated as the production source of truth.

---

## Feature Requirements (OODA-Aligned)

### Phase 1: MVP (v1.0) - Core Functionality

#### Feature Group: User Authentication & Profile

**OODA Decomposition:**
- `auth-001`: Email/Password Signup (Subtask)
  - Acceptance Criteria:
    - ✅ User can register with valid email & strong password
    - ✅ Weak passwords rejected with clear error message
    - ✅ Duplicate email rejected gracefully
    - ✅ No hardcoded password rules in code (use DB config table)
    - ✅ Structured logging: `{level: 'info', event: 'user_signup', user_id, timestamp}`
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `auth-002`: Social Login (OAuth2 via Supabase)
  - Acceptance Criteria:
    - ✅ Google login flow works end-to-end
    - ✅ GitHub login flow works end-to-end
    - ✅ User email auto-populated from provider
    - ✅ Existing user auto-linked if email matches
    - ✅ No CSRF vulnerabilities (verified by Security Engineer)
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `auth-003`: Email Verification
  - Acceptance Criteria:
    - ✅ Verification email sent within 5 seconds of signup
    - ✅ Verification link expires in 24 hours
    - ✅ User cannot access features until verified
    - ✅ Resend limit: 5x per day (configurable via env)
    - ✅ All timestamps in UTC (no hardcoding)
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `auth-004`: Password Reset
  - Acceptance Criteria:
    - ✅ Reset link expires in 1 hour
    - ✅ Old password not required for reset
    - ✅ Rate limit: 3 reset emails per hour per user
    - ✅ Structured logging for all reset attempts (including failed)
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `auth-005`: User Profile Management
  - Acceptance Criteria:
    - ✅ User can update first name, last name, phone
    - ✅ Email change requires re-verification
    - ✅ All updates trigger audit log entry
    - ✅ No personal data in error messages
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `auth-006`: Avatar Upload to Supabase Storage
  - Acceptance Criteria:
    - ✅ Accept JPEG, PNG, WebP (max 5MB)
    - ✅ Auto-resize to 256x256px + 512x512px variants
    - ✅ Old avatar deleted when new one uploaded
    - ✅ Serve from CDN with cache headers
    - ✅ No path traversal vulnerabilities
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

#### Feature Group: Event Management

**Dependencies:** Requires `auth-001` (user must be logged in)

- `event-001`: Browse Events with Filtering
  - Acceptance Criteria:
    - ✅ List events paginated (20 per page)
    - ✅ Filter by: date range, category, price range, location radius
    - ✅ Sort by: trending, newest, lowest price, soonest
    - ✅ Search full-text on title + description
    - ✅ All filter values come from DB config (zero hardcoding)
    - ✅ Performance: query returns in < 200ms (p95)
  - Dependencies: None
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `event-002`: Event Detail Page
  - Acceptance Criteria:
    - ✅ Display: title, description, date, venue, organizer, ticket types
    - ✅ Show availability count (real-time via Supabase Realtime)
    - ✅ Display customer reviews if available
    - ✅ Organizer contact info visible (phone/email configurable)
    - ✅ Related events recommendation (similar category/date)
  - Dependencies: `event-001`
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `event-003`: Event Booking & Ticket Purchase (CRITICAL - Concurrency)
  - **⚠️ CONCURRENCY RISK:** This feature requires atomic locking (see [Concurrency Strategy](#concurrency--atomic-locking-strategy))
  - Acceptance Criteria:
    - ✅ User selects ticket type & quantity
    - ✅ System acquires distributed lock on ticket inventory (Redis TTL=30s)
    - ✅ Seat availability decremented atomically
    - ✅ Lock released after payment confirmation OR timeout
    - ✅ No overbooking scenarios (verified by QA with 1000 concurrent users)
    - ✅ Failed transactions automatically release lock and return inventory
    - ✅ Structured logging: `{event: 'ticket_purchase_attempt', user_id, event_id, quantity, lock_acquired, lock_released_at}`
  - Dependencies: `auth-001`, `event-002`, `payment-001`
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `event-004`: Multiple Ticket Types Support
  - Acceptance Criteria:
    - ✅ Organizer can create VIP, Standard, Economy tiers
    - ✅ Each tier has separate inventory & pricing
    - ✅ Tier features (perks) stored in JSONB column (extensible)
    - ✅ Bulk purchase (e.g., "5x Standard + 2x VIP") works atomically
  - Dependencies: `event-003`
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `event-005`: Real-time Seat Availability (WebSocket)
  - Acceptance Criteria:
    - ✅ Connected users receive availability updates < 1 second
    - ✅ Uses Supabase Realtime subscriptions
    - ✅ Graceful fallback if WebSocket unavailable (polling every 5s)
    - ✅ Connection limit: 10,000 concurrent subscriptions per event (configurable)
  - Dependencies: `event-003`, `event-004`
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

#### Feature Group: Ticket Management

- `ticket-001`: View Purchased Tickets
  - Acceptance Criteria:
    - ✅ User sees all owned tickets in dashboard
    - ✅ Sort by event date, purchase date
    - ✅ Show status: Valid, Used, Refunded, Cancelled
    - ✅ Quick-action buttons: View QR, Transfer, Refund Request
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `ticket-002`: QR Code Generation & Display
  - Acceptance Criteria:
    - ✅ Generate unique QR per ticket instance
    - ✅ QR encodes: ticket_id + event_id + hash(ticket_secret)
    - ✅ Display QR at 300x300px minimum (PWA-compatible size)
    - ✅ QR cacheable offline (downloaded with ticket data)
    - ✅ No sensitive data in QR payload (use server-side lookup)
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `ticket-003`: Offline Ticket Access
  - Acceptance Criteria:
    - ✅ Service Worker caches ticket data + QR on purchase
    - ✅ User can view tickets without internet
    - ✅ Sync to server when reconnected
    - ✅ No double-usage vulnerability (verify on backend before marking used)
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

#### Feature Group: Payment Processing

- `payment-001`: Stripe Integration
  - Acceptance Criteria:
    - ✅ Checkout flow secure (via Stripe Hosted Page or Elements)
    - ✅ PCI-DSS Level 1 compliance (no card data in our DB)
    - ✅ Webhook: payment.intent.succeeded → ticket creation
    - ✅ Webhook: payment.intent.canceled → inventory release
    - ✅ Retry logic: 3 attempts on webhook failure with exponential backoff
    - ✅ Structured logging: `{event: 'payment_webhook', status, amount, timestamp}`
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

- `payment-002`: Invoice Generation
  - Acceptance Criteria:
    - ✅ PDF invoice generated after payment success
    - ✅ Stored in Supabase Storage under `/invoices/{order_id}/`
    - ✅ Email invoice link to customer within 5 seconds
    - ✅ Invoice unique number format: `INV-{YYYYMMDD}-{sequential}`
    - ✅ No hardcoding of company info (use env vars)
  - Reviewer Verdict: [ ] Approved / [ ] Rework / [ ] Blocked

### Phase 2: Enhancement (v1.1+)
- [ ] Loyalty program & points system
- [ ] Social features (ratings, reviews)
- [ ] Group booking
- [ ] Subscription events
- [ ] Mobile app wrapper (React Native / Flutter)
- [ ] Advanced analytics

### Phase 3: Scale (v2.0+)
- [ ] Marketplace features
- [ ] Third-party integrations
- [ ] AI-powered recommendations
- [ ] Machine learning for fraud detection
- [ ] Internationalization (i18n)
- [ ] Multi-currency support

---

## Technology Stack

### Frontend Stack
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 14.x+ | App framework with SSR/SSG |
| **UI Library** | React | 18.x+ | Component library |
| **Styling** | Tailwind CSS | 3.x+ | Utility-first CSS |
| **State Management** | Zustand / Redux Toolkit | Latest | Global state management |
| **HTTP Client** | Axios / TanStack Query | Latest | API communication & caching |
| **Form Handling** | React Hook Form | Latest | Form validation & management |
| **Validation** | Zod | Latest | Schema validation |
| **Icons** | Lucide React | Latest | Icon library |
| **UI Components** | shadcn/ui | Latest | Pre-built components |

### Visual Prototype Stack
| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Markup** | Semantic HTML | HTML Living Standard | Standalone page structure and accessibility baseline |
| **Styling** | CSS custom properties + CSS modules/files | Current browser baseline | Design tokens, responsive layout, states, and fallback styling |
| **Interaction** | Browser JavaScript modules | Current browser baseline | Fixture-only navigation, forms, dialogs, filters, and state transitions |
| **Motion** | CSS transitions/keyframes with optional Motion library reference | To be locked | Page entrance, feedback, and reduced-motion-aware transitions |
| **3D enhancement** | CSS 3D or Three.js reference scene | To be locked | Purposeful event/ticket perspective with static fallback |
| **Validation** | Playwright + axe/Lighthouse checks | To be locked | Responsive, accessibility, interaction, and performance evidence |

### Backend Stack
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18.x+ | JavaScript runtime |
| **Framework** | Next.js (API Routes) | 14.x+ | Serverless API handler |
| **Authentication** | Supabase Auth / NextAuth.js | Latest | User authentication |
| **Database** | PostgreSQL (Supabase) | 14.x+ | Primary database |
| **ORM** | Prisma / Supabase Client | Latest | Database abstraction |
| **Real-time** | Supabase Realtime | Latest | WebSocket subscriptions |
| **File Storage** | Supabase Storage | Latest | File upload/download |
| **Task Queue** | Bull Queue / pg-boss | Latest | Background jobs |
| **Logging** | Winston / Pino | Latest | Structured logging |

### DevOps & Infrastructure
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Hosting** | Vercel | Serverless deployment platform |
| **Database** | Supabase (PostgreSQL) | Database & Auth service |
| **Storage** | Supabase Storage | Object storage (S3-compatible) |
| **Version Control** | GitHub | Source code management |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Monitoring** | Vercel Analytics + Sentry | Performance & error tracking |
| **CDN** | Vercel Edge Network | Global content delivery |
| **Email** | SendGrid / Resend | Email delivery |
| **SMS** | Twilio (optional) | SMS notifications |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Package Manager** | pnpm |
| **Monorepo Manager** | Turbo |
| **Testing Framework** | Jest + Vitest + Playwright |
| **Linting** | ESLint |
| **Code Formatting** | Prettier |
| **Type Checking** | TypeScript |
| **Git Hooks** | Husky + lint-staged |
| **Documentation** | TypeDoc + MDX |
| **API Documentation** | Swagger/OpenAPI |

---

## Deployment Strategy

### Environment Configuration
```
development  → localhost:3000 (local development)
    ↓
staging      → staging.online-ticket.vercel.app (QA & testing)
    ↓
production   → app.online-ticket.vercel.app (Live)
```

### Deployment Pipeline
1. **Local Development**
   - Clone repository
   - Install dependencies: `pnpm install`
   - Set up `.env.local` with Supabase keys
   - Start dev server: `pnpm dev`

2. **Version Control (GitHub)**
   - Commit to feature branch
   - Create Pull Request
   - Automated tests run (GitHub Actions)
   - Code review & approval required

3. **CI/CD Pipeline (GitHub Actions)**
   ```yaml
   - Lint & Format Check
   - Unit & Integration Tests
   - Build Verification
   - Security Scanning (SAST)
   - Deploy to Staging (Vercel Preview)
   ```

4. **Staging Deployment (Vercel)**
   - Automatic preview deployments on PR
   - Full QA testing
   - Performance monitoring
   - Manual smoke testing

5. **Production Deployment (Vercel)**
   - Manual trigger on main branch
   - Blue-green deployment strategy
   - Zero-downtime deployment
   - Automated rollback on failure
   - Database migrations (managed separately)

### Database Migrations
```bash
# Create migration
pnpm db:create-migration <name>

# Apply migrations
pnpm db:migrate

# Rollback migration
pnpm db:rollback
```

### Monitoring & Observability
- **Real User Metrics**: Vercel Analytics (Core Web Vitals)
- **Application Performance**: Sentry (Error tracking)
- **API Performance**: Vercel Analytics (Response time)
- **Database Performance**: Supabase Dashboard
- **Security**: OWASP monitoring, rate limiting metrics

---

## Concurrency & Atomic Locking Strategy

### Critical Concurrency Scenarios

**⚠️ HIGH RISK**: The following scenarios require atomic locking to prevent race conditions:

#### 1. Ticket Inventory Race Condition
**Problem**: 10,000 users simultaneously buying last 100 tickets

```
User A: SELECT available_quantity FROM ticket_types WHERE id = 'ABC' → 100
User B: SELECT available_quantity FROM ticket_types WHERE id = 'ABC' → 100
User A: UPDATE ticket_types SET available_quantity = 99 → SUCCESS
User B: UPDATE ticket_types SET available_quantity = 99 → SUCCESS (OVERBOOKING!)
```

**Solution: Distributed Atomic Lock**
```typescript
// packages/api/src/services/ticketService.ts

interface LockConfig {
  lockKey: string;           // Redis key
  ttl: number;               // 30 seconds
  maxRetries: number;        // 3 attempts
  retryDelayMs: number;      // 100ms exponential backoff
}

async function acquireInventoryLock(
  eventId: string,
  ticketTypeId: string
): Promise<{ lockId: string; success: boolean }> {
  const lockKey = `ticket-lock:${eventId}:${ticketTypeId}`;
  const lockId = generateUUID();
  
  // TRY: Acquire lock with TTL
  const locked = await redis.set(lockKey, lockId, 'EX', 30, 'NX');
  
  if (!locked) {
    throw new InventoryLockedError('Ticket inventory temporarily locked');
  }
  
  return { lockId, success: true };
}

async function purchaseTicket(
  userId: string,
  eventId: string,
  ticketTypeId: string,
  quantity: number
): Promise<Result<Ticket[]>> {
  // 1. GUARD CLAUSE: Validate input early
  if (!userId || !eventId || quantity <= 0) {
    return { success: false, error: 'Invalid purchase parameters' };
  }

  let lockId: string | null = null;

  try {
    // 2. ACQUIRE LOCK
    const lockResult = await acquireInventoryLock(eventId, ticketTypeId);
    lockId = lockResult.lockId;

    // 3. CHECK AVAILABILITY
    const ticketType = await db.ticketTypes.findUnique({ id: ticketTypeId });
    
    if (!ticketType || ticketType.available_quantity < quantity) {
      return {
        success: false,
        error: 'Insufficient ticket availability',
      };
    }

    // 4. DECREMENT INVENTORY (atomically)
    const updated = await db.ticketTypes.update({
      where: { id: ticketTypeId },
      data: { 
        available_quantity: { decrement: quantity }
      },
    });

    // 5. STRUCTURED LOGGING
    logger.info({
      event: 'ticket_purchase_attempt',
      user_id: userId,
      event_id: eventId,
      ticket_type_id: ticketTypeId,
      quantity,
      remaining: updated.available_quantity,
      lock_id: lockId,
      timestamp: new Date().toISOString(),
    });

    // 6. CREATE TICKETS
    const tickets = await db.tickets.createMany({
      data: Array(quantity).fill({
        userId,
        ticketTypeId,
        eventId,
        status: 'valid',
      }),
    });

    return { success: true, data: tickets };
    
  } catch (error) {
    // 7. ERROR HANDLING: Log structured + release lock
    logger.error({
      event: 'ticket_purchase_failed',
      user_id: userId,
      error_code: error.code,
      error_message: error.message,
      lock_id: lockId,
      timestamp: new Date().toISOString(),
    });

    // ROLLBACK: Return inventory
    if (lockId) {
      await db.ticketTypes.update({
        where: { id: ticketTypeId },
        data: { 
          available_quantity: { increment: quantity }
        },
      });
    }

    return { success: false, error: error.message };
    
  } finally {
    // 8. ALWAYS: Release lock
    if (lockId) {
      await redis.del(`ticket-lock:${eventId}:${ticketTypeId}`);
    }
  }
}
```

**Lock Strategy Specification:**
| Aspect | Requirement | Implementation |
|--------|-------------|-----------------|
| **Lock Type** | Distributed Mutex | Redis SET with NX + EX |
| **TTL** | 30 seconds (must not exceed payment timeout) | Configurable via env |
| **Retry** | 3 attempts with exponential backoff | 100ms → 200ms → 400ms |
| **Fallback** | If lock fails, return clear error | "Inventory temporarily unavailable" |
| **Lock Release** | Automatic after payment OR TTL expiry | Both via Redis expiry + explicit delete |

### Shared Resource Locking Matrix

Redis is a coordination mechanism, not the source of truth. Every mutation must also be protected by a database transaction or an atomic conditional update. Lock release must use an ownership token and compare-and-delete operation so an expired lock cannot be deleted by a later request.

| Resource | Race condition | Required control | Verification |
|---|---|---|---|
| Ticket inventory | Concurrent purchases exceed stock | Redis TTL lock + conditional DB decrement in transaction | 1,000 concurrent purchase test; zero negative inventory and zero overbooking |
| Reservation expiry | Expiry job competes with payment confirmation | Reservation state transition with version/idempotency check | Replayed expiry and payment events produce one final state |
| Payment/order creation | Duplicate checkout or webhook delivery | `Idempotency-Key` unique constraint + webhook event unique constraint | Duplicate requests return the original result |
| Invoice sequence | Concurrent invoice generation uses the same number | Database sequence or transactional counter, never application-side increment | Parallel generation produces unique sequential identifiers |
| Promo redemption | Multiple users consume the same limited allocation | Atomic conditional decrement inside a transaction | Redemption count never exceeds configured limit |
| Ticket check-in | The same ticket is scanned concurrently | Atomic `valid -> used` transition with conditional update | At most one successful check-in per ticket |

Profile edits do not require a distributed lock; they require optimistic versioning and conflict detection because they are not a scarce shared inventory resource.

### Lock Safety Rules

- Lock TTL, retry count, and timeout are configuration values, validated at startup.
- A lock failure returns a typed `LOCK_UNAVAILABLE` result; it must not throw through the API boundary.
- Database rollback is only performed when the transaction outcome is known. If the outcome is uncertain, reconciliation resolves inventory from the durable order and reservation state.
- Lock release is attempted in `finally`, logged, and retried safely; release failure must not hide the original error.
- Lock keys must use a stable resource identifier and must never contain PII.

#### 2. Payment Processing Idempotency
**Problem**: User clicks "Pay" twice, creates 2 orders

**Solution: Payment Idempotency Key**
```typescript
// Request body must include idempotency_key (UUID)
const idempotencyKey = headers.get('Idempotency-Key');

// Check if payment already processed
const existingOrder = await db.orders.findUnique({
  where: { idempotency_key: idempotencyKey },
});

if (existingOrder) {
  return { success: true, data: existingOrder }; // Return cached result
}

// ... process payment ...
```

#### 3. Event Seat Map Update
**Problem**: Multiple organizers updating same event seats

**Solution: Optimistic Locking with version field**
```sql
CREATE TABLE events (
  ...
  total_capacity INTEGER,
  available_seats INTEGER,
  version INTEGER DEFAULT 1,  -- Optimistic lock
  ...
);

UPDATE events 
SET available_seats = 95, version = version + 1
WHERE id = 'event-123' AND version = 100;  -- Only if version matches
```

---

## Error Handling & Structured Logging

### Result Pattern (Enforced on All Service Layer)

Every service function must return explicit Result type:

```typescript
// packages/shared/src/types/index.ts

type Success<T> = {
  success: true;
  data: T;
};

type Failure = {
  success: false;
  error: string;
  errorCode?: string;
  details?: Record<string, unknown>;
};

type Result<T> = Success<T> | Failure;

// ✅ GOOD
async function getUserProfile(userId: string): Promise<Result<User>> {
  if (!userId) {
    return { success: false, error: 'User ID required', errorCode: 'INVALID_INPUT' };
  }
  // ...
  return { success: true, data: user };
}

// ❌ BAD (throwing exception without context)
async function getUserProfile(userId: string): Promise<User> {
  if (!userId) throw new Error('User ID required');  // No structure!
  // ...
}
```

### Structured Logging (JSON Only)

No unstructured logs. Every log entry must be JSON with:
- `timestamp`: ISO 8601
- `level`: 'info' | 'warn' | 'error' | 'debug'
- `event`: Short event name (e.g., 'user_signup', 'payment_webhook')
- `context`: User ID, request ID, session ID
- Additional fields relevant to event

```typescript
// packages/api/src/utils/logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// ✅ GOOD: Structured logging
logger.info({
  timestamp: new Date().toISOString(),
  level: 'info',
  event: 'user_signup',
  user_id: user.id,
  email: user.email,  // No passwords!
  provider: 'email',
  request_id: requestId,
  duration_ms: 234,
});

// ❌ BAD: Unstructured
console.log(`User ${user.id} signed up`);  // Not JSON, hard to query
```

### Logging Governance

All logs must follow these controls:

| Control | Requirement |
|---|---|
| PII masking | Mask email, phone, address, tokens, authorization headers, and payment identifiers. Never log passwords, secrets, card data, or raw webhook signatures. |
| Retention | `info` and `debug` logs: 30 days; `warn` and `error` logs: 90 days, subject to the approved privacy policy. |
| Sampling | 100% of security, payment, inventory, and error events; configurable sampling for high-volume informational events. |
| Correlation | Every request and background job carries `request_id`, `operation_id`, and, where applicable, `user_id` or `order_id`. |
| Alerting | Alert on payment reconciliation failures, repeated lock failures, authentication abuse, and error-rate thresholds defined in `system_config`. |
| Access | Production logs are restricted by role and audit logged. |

The logger must sanitize arbitrary error objects before serialization. Client responses must expose a stable `errorCode` and `errorId`, never stack traces or provider secrets.

### Fail-Gracefully Contract

The Result pattern applies to service, database, API, middleware, and external-provider boundaries:

- Validate inputs with guard clauses before network or database work.
- Apply a bounded timeout to every external call; the value is configuration-driven.
- Retry only transient failures with capped exponential backoff and an idempotency key where supported.
- After the retry budget is exhausted, return a typed failure and structured log; never use an empty `catch` block.
- Use a circuit breaker or provider health state for repeatedly failing dependencies.
- Provide a safe degraded response where possible, such as cached public event data; never serve stale authorization, inventory, payment, or ticket-validation decisions.
- Webhook handlers must acknowledge only after durable idempotent persistence, or return a retryable failure.

### Guard-Clause Enforcement

Every service and route handler must reject invalid authentication, authorization, input, configuration, and resource state at the top of the function. Pull requests must include a guard-clause review item, and linting/type checks must pass before an independent reviewer evaluates behavior.

### Zero Hardcoding Rules

**All configuration must come from:**
1. Environment variables (sensitive data)
2. Database config tables (feature flags, business rules)
3. Never hardcoded in source code

```typescript
// ❌ BAD: Hardcoded
if (user.role === 'admin') { ... }  // Hardcoded role check

// ✅ GOOD: Configurable
const adminRole = process.env.ADMIN_ROLE_NAME;  // From env
if (user.role === adminRole) { ... }

// ✅ EVEN BETTER: From database config
const roleConfig = await db.roleConfigs.findUnique({ name: 'admin' });
if (user.role === roleConfig.id) { ... }
```

**Config Table Schema:**
```sql
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id)
);

-- Examples
INSERT INTO system_config (key, value) VALUES
('password_min_length', '{"value": 8}'),
('password_require_special', '{"value": true}'),
('admin_role_name', '{"value": "admin"}'),
('max_concurrent_reservations', '{"value": 5}');
```

The `system_config` table is the source of truth for business-tunable values such as pagination limits, password and token expiry, rate limits, reservation TTL, lock retry policy, cache TTL, upload limits, log sampling, and alert thresholds. Secrets and deployment-specific values remain in environment variables. Configuration is loaded through a typed validator at startup; missing or invalid required configuration fails deployment, while optional features fail closed.

### Global Error Handler

Every API endpoint must use centralized error handler:

```typescript
// packages/api/src/middleware/errorHandler.ts

export async function handleError(error: unknown, requestId: string) {
  const errorId = generateUUID();

  // Structure the error
  const structured = {
    errorId,
    requestId,
    timestamp: new Date().toISOString(),
    message: error instanceof Error ? error.message : 'Unknown error',
    code: error instanceof AppError ? error.code : 'INTERNAL_SERVER_ERROR',
  };

  // Log it
  logger.error(structured);

  // Return to client (no internal details)
  return {
    success: false,
    error: structured.message,
    errorId,  // For support to trace
  };
}

// ❌ BAD: No error structure
try {
  doSomething();
} catch (e) {
  console.log(e);  // Unstructured!
  res.status(500).send('Error');
}

// ✅ GOOD: Structured error handling
try {
  doSomething();
} catch (error) {
  const response = await handleError(error, requestId);
  res.status(getStatusCode(error)).json(response);
}
```

---

## Tech Critic Review (Assumptions & Risks)

### Assumptions We're Making

| # | Assumption | Risk Level | Mitigation |
|---|-----------|-----------|-----------|
| 1 | Supabase will scale to 1M concurrent users | **MEDIUM** | Load testing on staging, fallback plan to scale PostgreSQL |
| 2 | Vercel serverless will handle 10K req/s | **MEDIUM** | Vercel has SLO for this, but test with k6 load testing |
| 3 | Real-time WebSocket won't bottleneck at 50K concurrent | **MEDIUM** | Use Supabase Realtime pools, may need separate real-time service later |
| 4 | Stripe/Xendit webhooks are reliable | **LOW** | Built retry + manual reconciliation reconciliation job |
| 5 | Payment flow completes < 5 minutes | **LOW** | Set explicit timeout, show status polling UI |
| 6 | Users won't intentionally try to overbooking | **HIGH** | Atomic locking + comprehensive logging required |
| 7 | Service Worker caching won't create stale offline data | **MEDIUM** | Implement sync strategy, version cached data |

### Identified Risks

#### 🔴 **CRITICAL RISKS**

1. **Overbooking Due to Race Condition**
   - **Impact**: Revenue loss, customer refunds, reputation damage
   - **Probability**: HIGH (multiple concurrent purchases)
   - **Mitigation**: 
    - ✅ Specified: Atomic locking on inventory
    - ⏳ Required before payment gate: Load test with 1000 concurrent users
    - ⏳ Required before payment gate: Integration test with Stripe webhook delays

2. **Service Worker Offline Data Corruption**
   - **Impact**: Users see expired/invalid tickets offline
   - **Probability**: MEDIUM
   - **Mitigation**:
    - ✅ Specified: Versioning on cached data
    - ⏳ Required before PWA gate: Implement IndexedDB integrity checks

3. **Payment Webhook Failure → Tickets Not Created**
   - **Impact**: Customer paid but no ticket, refund required
   - **Probability**: LOW (Stripe is reliable) but IMPACT is HIGH
   - **Mitigation**:
    - ✅ Specified: 3-retry exponential backoff
    - ⏳ Required before payment gate: Manual reconciliation job (compare payments vs tickets)

#### 🟠 **HIGH RISKS**

4. **Vercel Cold Start Delays on Spike**
   - **Impact**: Slow checkout during popular event sale
   - **Probability**: MEDIUM
   - **Mitigation**:
    - ⏳ Required before production gate: Pre-warm functions 5 min before event sale
    - ⏳ Required before production gate: Use Vercel Edge Functions for static routes

5. **Real-time Availability Not Reflected Immediately**
   - **Impact**: Users buy "sold out" tickets thinking available
   - **Probability**: LOW (WebSocket < 1 sec)
   - **Mitigation**:
    - ✅ Specified: Realtime < 1 second SLA
    - ⏳ Required before booking gate: Client-side optimistic locking UI

#### 🟡 **MEDIUM RISKS**

6. **PostgreSQL Connection Pool Exhaustion**
   - **Impact**: Timeouts during traffic spike
   - **Probability**: MEDIUM
   - **Mitigation**:
    - ✅ Specified: Supabase managed connection pooling
    - ⏳ Required before production gate: Monitor connection count, alert at 80%

7. **Supabase Storage Rate Limiting on Avatar Upload**
   - **Impact**: Slow avatar uploads during onboarding
   - **Probability**: LOW
   - **Mitigation**:
    - ✅ Specified: Client-side image resize before upload
    - ⏳ Required before production gate: Implement upload queue with retry

### Red Flags Requiring Security Review

- [ ] **Before Payment Integration**: Security engineer must sign-off on Stripe integration
- [ ] **Before Real-time Launch**: Verify WebSocket doesn't leak user data via subscriptions
- [ ] **Before Production**: Penetration testing for authentication bypass
- [ ] **Before Admin Features**: Role-based access control audit (no privilege escalation)

### Risk Mitigation Ownership

Every mitigation must have an owner, deadline, evidence, and independent reviewer. An unassigned `TODO` is not considered a mitigation.

| Risk | Mitigation owner | Deadline | Verification evidence | Reviewer |
|---|---|---|---|---|
| Overbooking and inventory race | Backend Builder | Before payment gate | Concurrency report with zero overbooking | QA Engineer + Tech Critic |
| Payment webhook failure | Backend Builder | Before payment gate | Idempotency and reconciliation test report | QA Engineer + Security Engineer |
| Offline ticket staleness | Frontend Builder | Before PWA gate | Offline/online state-transition E2E report | QA Engineer |
| Cold-start latency | DevOps/Builder | Before production gate | Load test and Core Web Vitals report | Expert Reviewer |
| RLS or RBAC bypass | Security Engineer | Before production gate | RLS policy test and threat-model sign-off | Expert Reviewer |

Any missed deadline or failed verification changes the related verdict to `blocked-escalate` until the owner supplies a new mitigation plan.

---

## Database Schema (OODA-Aligned)

### Core Tables

#### users
```sql
-- ✅ ZERO-HARDCODING: Roles configurable via role_configs table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url VARCHAR(500),
  phone_number VARCHAR(20),
  role_id UUID REFERENCES role_configs(id),  -- Foreign key to roles table (non-hardcoded)
  status VARCHAR(50),  -- References status_configs table
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_id),
  INDEX(role_id),
  INDEX(status)
);

-- ✅ Role configuration (non-hardcoded, configurable)
CREATE TABLE role_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,  -- 'user', 'organizer', 'admin' etc
  description TEXT,
  permissions JSONB NOT NULL,  -- Array of permission codes
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(name),
  INDEX(active)
);

-- ✅ Status configuration (non-hardcoded)
CREATE TABLE status_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50),  -- 'user', 'event', 'order', 'ticket'
  status_name VARCHAR(100),  -- 'active', 'pending', 'completed'
  display_label VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_type, status_name),
  INDEX(entity_type),
  INDEX(is_active)
);
```

#### events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  venue_name VARCHAR(255) NOT NULL,
  venue_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cover_image_url VARCHAR(500),
  status VARCHAR(50) NOT NULL, -- Resolved through status_configs for entity_type='event'
  total_capacity INTEGER,
  available_seats INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(organizer_id),
  INDEX(status),
  INDEX(start_date)
);
```

#### ticket_types
```sql
CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  available_quantity INTEGER NOT NULL,
  features TEXT[], -- JSON array of features
  sales_start TIMESTAMP,
  sales_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(event_id)
);
```

#### tickets
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
  event_id UUID NOT NULL REFERENCES events(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  qr_code VARCHAR(500),
  status VARCHAR(50) NOT NULL, -- Resolved through status_configs for entity_type='ticket'
  seat_number VARCHAR(50),
  checked_in_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(user_id),
  INDEX(event_id),
  INDEX(status),
  UNIQUE(order_id, ticket_number)
);
```

#### orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL, -- Resolved through status_configs for entity_type='order'
  payment_method VARCHAR(100),
  payment_id VARCHAR(255),
  invoice_number VARCHAR(50) UNIQUE,
  items_count INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX(user_id),
  INDEX(status),
  INDEX(created_at)
);
```

#### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- Resolved through notification configuration
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(user_id),
  INDEX(is_read)
);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(user_id),
  INDEX(created_at)
);
```

### Indexes for Performance
```sql
-- Performance indexes
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_tickets_user_event ON tickets(user_id, event_id);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- Full text search
CREATE INDEX idx_events_search ON events USING GIN (
  to_tsvector('english', title || ' ' || description)
);
```

### Supabase Storage Buckets
```
buckets:
├── avatars/                    # User profile pictures
│   └── {user_id}/{filename}
├── event-covers/               # Event cover images
│   └── {event_id}/{filename}
├── tickets/                    # Ticket PDFs
│   └── {ticket_id}/{filename}
├── invoices/                   # Invoice documents
│   └── {order_id}/{filename}
└── temp/                        # Temporary uploads
    └── {user_id}/{filename}
```

---

## Security Considerations

### Authentication & Authorization
- ✅ **Supabase Auth**: OAuth 2.0, JWT tokens
- ✅ **Role-Based Access Control (RBAC)**: user, organizer, admin roles
- ✅ **Row Level Security (RLS)**: Supabase RLS policies
- ✅ **Session Management**: Secure session handling with refresh tokens
- ✅ **2FA (Optional)**: TOTP support via Supabase Auth

### Data Protection
- ✅ **HTTPS/TLS**: All traffic encrypted
- ✅ **Data Encryption**: Sensitive data encrypted at rest (Supabase)
- ✅ **Password Hashing**: bcrypt + salting (via Supabase)
- ✅ **API Key Management**: Environment variables, never exposed in code
- ✅ **CORS Configuration**: Restricted to allowed origins

### API Security
- ✅ **Rate Limiting**: Per-user and global rate limits
- ✅ **Input Validation**: Zod schemas on all endpoints
- ✅ **SQL Injection Prevention**: Parameterized queries via ORM
- ✅ **CSRF Protection**: CSRF tokens for state-changing operations
- ✅ **Request Signing**: Optional signature verification for sensitive endpoints

### Data Privacy
- ✅ **GDPR Compliance**: Data deletion, export capabilities
- ✅ **PII Protection**: Minimal data retention
- ✅ **Audit Logging**: All sensitive operations logged
- ✅ **Access Control**: Database-level access restrictions
- ✅ **Backup Strategy**: Regular encrypted backups with retention policy

### Infrastructure Security
- ✅ **DDoS Protection**: Vercel's built-in DDoS mitigation
- ✅ **WAF (Web Application Firewall)**: Vercel Edge Network
- ✅ **Secret Management**: GitHub Secrets for sensitive environment variables
- ✅ **Vulnerability Scanning**: GitHub Dependabot + OWASP checks
- ✅ **Code Signing**: GPG signed commits (recommended)

### Third-Party Security
- ✅ **Payment Security**: PCI-DSS compliance via Stripe/Xendit
- ✅ **Third-Party Audits**: Regular security assessments
- ✅ **Dependency Management**: Regular updates, security patches
- ✅ **Vendor Risk Assessment**: Evaluate third-party services

---

## Development Roadmap

### Timeline & Milestones

#### Q4 2026 - Foundation & Setup (Months 1-3)
- [x] Project initialization & monorepo setup
- [x] Database schema design & implementation
- [ ] Standalone HTML visual prototype for every MVP page
- [ ] Page-by-page design review and approval gate
- [ ] Authentication system (Supabase Auth)
- [ ] API scaffolding & documentation
- [ ] UI component library setup
- [ ] Development environment setup

**Deliverable**: Approved visual prototype, design-to-component translation map, and API skeleton ready

#### Q1 2027 - MVP Features (Months 4-6)
- [ ] User registration & profile management
- [ ] Event browsing & search
- [ ] Ticket purchase flow
- [ ] Payment integration (Stripe)
- [ ] Basic admin panel
- [ ] Push notifications

**Deliverable**: v1.0 MVP released to staging

#### Q2 2027 - Optimization & Launch (Months 7-9)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Load testing & scaling
- [ ] Mobile responsiveness
- [ ] Offline functionality (Service Worker)
- [ ] Launch to production

**Deliverable**: v1.0 production release

#### Q3 2027 - Post-Launch (Months 10-12)
- [ ] Bug fixes & stability improvements
- [ ] User feedback implementation
- [ ] Analytics dashboard
- [ ] Email template system
- [ ] v1.1 feature planning

**Deliverable**: v1.1 roadmap finalized

#### Q4 2027+ - Scale & Expand (Year 2)
- [ ] Advanced features (loyalty, reviews, etc.)
- [ ] Mobile app wrapper
- [ ] International expansion
- [ ] Enterprise features
- [ ] Machine learning integration

---

## Success Criteria

### Technical KPIs
| Metric | Target | Current |
|--------|--------|---------|
| Page Load Time | < 2s | TBD |
| API Response (p95) | < 200ms | TBD |
| Database Query (p95) | < 100ms | TBD |
| Uptime | 99.9% | TBD |
| Lighthouse Score | 90+ | TBD |

### Business KPIs
| Metric | Target | Status |
|--------|--------|--------|
| User Acquisition (3 months) | 10,000 | TBD |
| Mobile Traffic | > 40% | TBD |
| Conversion Rate | > 5% | TBD |
| Customer Retention (30-day) | > 60% | TBD |
| NPS Score | > 40 | TBD |

---

## Appendix

### A. Environment Variables Template
```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_KEY=[SERVICE_KEY]

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[RANDOM_SECRET]

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[KEY]
STRIPE_SECRET_KEY=[KEY]

# External Services
SENDGRID_API_KEY=[KEY]
SENTRY_DSN=[DSN]

# Analytics
NEXT_PUBLIC_GA_ID=[GA_ID]
```

### B. References & Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

### C. Team & Contacts
- **Project Lead**: vergenscande
- **Tech Lead**: [To be assigned]
- **DevOps**: [To be assigned]
- **QA Lead**: [To be assigned]

---

**Document Version History**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-15 | vergenscande | Initial PRD creation |
| 1.2 | 2026-09-15 | vergenscande | Added agentic decision authority, approval gates, shared-resource locking, fail-graceful contract, logging governance, and accountable risk tracking |
| 1.3 | 2026-09-15 | vergenscande | Added HTML-first visual prototype phase, page-by-page design breakdown, motion/3D interaction rules, and prototype-to-monorepo approval gate |
| 1.4 | 2026-09-16 | vergenscande | Added prototype implementation tracking, visual change log, ticket detail fixture, and system-state fixture |

---

*Last Updated: 2026-09-16*
*Next Review: 2026-10-15*
