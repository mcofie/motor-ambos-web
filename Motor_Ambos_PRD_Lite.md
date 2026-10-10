---

# Motor Ambos — Core B2B OS Launch (PRD Lite)

| Metadata | Details |
| --- | --- |
| **Product Model** | `Vertical B2B OS` |
| **Owner / Lead** | @Maxwell |
| **Status** | `Draft` |
| **Target Launch Date** | 2026-09-07 (Strict 1–2 week sprint) |
| **Figma Prototype** | [Link to specific user flow] |
| **GitHub Milestone** | [Link to GitHub Project/Epic] |

---

## 1. Problem & Context

* **User Problem:** Fleet owners and businesses struggle to track vehicle maintenance, fuel logs, and driver compliance centrally, while drivers lack a trusted, portable way to prove a vehicle's service history.
* **Studio Strategic Value:** Building Motor Ambos establishes a deep data and trust moat by aggregating verified service provider logs via NFC smart cards. It positions the studio to own the foundational OS for fleet management and automotive trust across the region.

---

## 2. Validation & Kill Gate (30-Day Metric)

* **Primary Success Metric:** $\ge$ 10 business owners active weekly; $\ge$ 50 client records logged (vehicles/drivers).
* **Leading Indicator:** Funnel conversion rate from land $\rightarrow$ business account creation + first vehicle added $\ge$ 15%.

---

## 3. Core User Flow (Happy Path)

1. **Discovery / Entry:** Fleet owner lands on `/business` via shareable link, social card, or QR code.
2. **Identity / Input:** User logs in (Supabase Auth) and inputs essential data (business details, first driver, and vehicle information).
3. **Core Action:** Business provisions a digital passport (or physical NFC Smart Card) for the vehicle and assigns the driver.
4. **Transaction / Commit:** System captures state (writes to PostgreSQL `organization_members` linking business, driver, and vehicle) and configures Role Based Access.
5. **Confirmation & Virality Loop:** Driver receives an automated WhatsApp/SMS invite to view their vehicle's digital passport, and the business sees the active driver instantly on their fleet dashboard.

---

## 4. Scope Breakdown

### In-Scope for V1 (Max 5 Deliverables)

* [ ] **Core Interface:** Responsive mobile-first B2B dashboard for managing fleet drivers, vehicles, and service logs matching Figma spec.
* [ ] **Data / State Layer:** PostgreSQL table schema (`members`, `vehicles`, `organization_members`) + Row Level Security policies.
* [ ] **API / Webhook Integration:** Supabase Auth, and SMS/WhatsApp gateway (e.g., Arkesel/Hubtel) for driver invites.
* [ ] **Confirmation Loop:** Automated transactional message to drivers upon being added to a fleet.

### Out of Scope for V1 (Anti-Scope)

* ❌ Native mobile app builds (Mobile responsive web / PWA only)
* ❌ In-app chat systems (Use direct WhatsApp click-to-chat links)
* ❌ Complex admin dashboards (Manage via Supabase dashboard or Discord webhooks)
* ❌ Custom multi-tier pricing plans or self-serve billing portals

---

## 5. Technical & Security Guardrails

* **Data Schema Additions:** `organization_members` table with foreign keys to `members` and `vehicles`.
* **Third-Party Integrations:** Supabase Auth/PostgreSQL, PostHog for telemetry, Hubtel/Arkesel SMS.
* **Security & Privacy:** Supabase RLS restricting businesses to only query and view their own drivers and vehicles; encrypted PII.
* **Fallback / Offline State:** `localStorage` caching during mobile network drops for viewing core fleet stats.

---

## 6. Pre-Launch Sanity Checklist

* [ ] Mobile viewport tested across iOS Safari and Android Chrome (375px–430px).
* [ ] Error tracking active via Sentry; core event telemetry logged in PostHog.
* [ ] OpenGraph social preview cards verified for WhatsApp/X link unfurls.
* [ ] 60-second video walkthrough posted to Discord `#ship-log`.
