# Elite Fullstack & Non-AI Craftsmanship Rules

These rules apply to all web design, frontend, backend, API, and database tasks in this workspace.

## 1. Zero "AI-Made" Aesthetics (Strict Mandate)
- **Forbidden Patterns**:
  - No generic centered hero headers with predictable purple/violet linear gradients.
  - No 3-column feature cards with identical placeholder Lucide icons and canned bullet points.
  - No oversized, floating pill buttons with generic `bg-gradient-to-r from-purple-500 to-indigo-500`.
  - No low-contrast gray text on dark gray surfaces that fails accessibility.
  - No uniform border-radius on every element without rhythm (e.g., blanket `rounded-2xl`).

- **Required Craftsmanship Standards**:
  - **Typography First**: Use purposeful typographic hierarchy with deliberate fonts (Geist Sans, Inter, Instrument Sans, Plus Jakarta Sans). Use `text-wrap: balance` on headlines and `text-wrap: pretty` on paragraphs.
  - **Color Systems & Optical Contrast**: Build on semantic color tokens with high dynamic range. Use `oklch()` color spaces for natural tints and dark mode depth instead of muddy blacks.
  - **Micro-Interactions & Tactile Feedback**: All interactive elements (buttons, inputs, tabs, modal dialogs) must have subtle state feedback: active press scale (`active:scale-[0.98]`), spring transitions, tactile hover states, and clear focus-visible outlines.
  - **Asymmetric & Intentional Layouts**: Balance grids with intentional asymmetry, side anchors, subtle hairline borders (`border-white/[0.08]` or `border-zinc-200`), and generous whitespace.

## 2. Frontend Engineering (Next.js & React 19)
- Use **Next.js App Router** with React Server Components (RSC) for data-heavy sections and Client Components (`"use client"`) only where user interactivity/state requires it.
- Use **Tailwind CSS** (v4 preferred) coupled with **Radix UI** primitives or **shadcn/ui** building blocks. Never invent custom accessible primitives when tested primitives exist.
- Employ **CSS View Transitions** for page transitions, and native Popover/Dialog APIs with backdrop filters.

## 3. Database Architecture & Durability
- Default database: **PostgreSQL** (via Supabase, Neon, or standard Postgres).
- Always define explicit constraints: Primary Keys (`UUIDv7` or `cuid2` for distributed safety), Foreign Keys with cascade actions, `NOT NULL` constraints, and index foreign key columns.
- Structure schemas with proper normalization (3NF) before denormalizing for performance.
- Use **Drizzle ORM** or **Prisma** with structured, reversible schema migration files.

## 4. API Design & Security
- **Consistent Response Envelopes**:
  `{ success: true, data: T, meta?: { page, limit, total } }`
  or
  `{ success: false, error: { code: string, message: string, details?: any } }`
- **Validation**: Strict schema validation with **Zod** or **Valibot** on every input payload (query parameters, route parameters, body).
- **Security**: Implement rate limiting, CORS configuration, CSRF prevention for state-changing routes, and strict JWT or session token lifecycle checks.

