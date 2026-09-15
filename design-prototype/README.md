# Gather visual prototype

This is the fixture-only HTML prototype for the customer discovery, checkout, payment, ticket wallet, ticket detail, authentication, and system-state flows defined in `PRD.md`.

## Preview

Open `index.html` directly in a browser. The prototype has no production API, authentication, payment provider, or Supabase connection.

## Covered states

- Responsive desktop, tablet, and mobile layouts
- Search filtering with empty state
- Card/list view toggle
- Filter chips
- Save event interaction
- Toast feedback
- CSS 3D ticket object with reduced-motion fallback
- Keyboard focus and semantic landmarks
- Ticket QR detail with valid, used, invalid, and offline states
- Bright scan mode, QR zoom, ticket download, and wallet save preview
- System state gallery: 404, 500, maintenance, offline, loading, empty, and access denied
- Organizer dashboard with sales metrics, event switcher, chart, activity, and export preview
- Event editor with live preview, autosave state, ticket type editor, validation, and publish guard
- Admin operations with orders, users/audit tabs, filters, permission watch, and runtime toggles
- Prototype Hub with the complete route map and customer, organizer, admin, and recovery flows

## Prototype pages

| Page | File | Status |
|---|---|---|
| Home / discovery | `index.html` | Partial |
| Event listing | `pages/events.html` | Partial |
| Event detail | `pages/event-detail.html` | Partial |
| Login and signup | `pages/auth.html` | Partial |
| Verification and reset | `pages/auth-status.html` | Partial |
| Checkout | `pages/checkout.html` | Partial |
| Payment result | `pages/payment-result.html` | Partial |
| Ticket wallet | `pages/ticket-wallet.html` | Partial |
| Ticket and QR detail | `pages/ticket-detail.html` | Implemented fixture |
| System states | `pages/system-states.html` | Implemented fixture |
| Organizer dashboard | `pages/organizer-dashboard.html` | Implemented fixture |
| Event editor | `pages/organizer-editor.html` | Implemented fixture |
| Admin operations | `pages/admin-operations.html` | Implemented fixture |
| Prototype map | `pages/prototype-hub.html` | Integration entry point |

## Integrated review path

Open `pages/prototype-hub.html` to review every fixture route. The customer flow is Home -> Events -> Event detail -> Checkout -> Payment -> Wallet -> QR detail. Organizer, admin, and recovery routes are available from the same map, and `PRD.md` contains the route transition contract.

The prototype remains fixture-only. It has no production authentication, payment provider, Supabase connection, service worker, or API integration.
