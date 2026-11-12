---
name: database-architect
description: Comprehensive architecture guide for designing scalable schemas, normalization, indexing strategies, relationships, and zero-downtime migrations for modern SQL (PostgreSQL) and NoSQL databases.
---

# Database Architect & Schema Engineering Playbook

Use this skill when designing, reviewing, or refactoring relational database models, schemas, and migrations for fullstack web applications.

## 1. Schema Design Principles
- **Primary Keys**: Prefer time-sortable, globally unique identifiers like `UUIDv7` or `cuid2` over raw serial integers to prevent enumeration attacks and simplify distributed sharding.
- **Data Integrity**:
  - Always enforce `NOT NULL` on required attributes with sensible defaults.
  - Foreign Keys must have explicit `ON DELETE` rules (`CASCADE` for child collections, `RESTRICT` or `SET NULL` for reference entities).
  - Use `CHECK` constraints for bounded enumerations and values (e.g., status strings, positive quantities).

## 2. Indexing Strategy
- Index every foreign key column (`user_id`, `organization_id`, `team_id`) to accelerate `JOIN` queries.
- Create composite indexes tailored for specific query patterns (e.g., `(organization_id, created_at DESC)` for activity feeds).
- Use partial/conditional indexes where queries filter on a constant subset (e.g., `CREATE INDEX ON orders (created_at) WHERE status = 'pending'`).

## 3. Migration Workflows
- **Zero-Downtime Safe Practices**:
  - Never drop a column or rename it directly in production. Use a multi-phase migration (Add new column -> Dual write -> Backfill -> Read from new -> Drop old).
  - Run long-running index creations concurrently in PostgreSQL (`CREATE INDEX CONCURRENTLY`).
  - Keep migration scripts idempotent and strictly version-controlled with tools like **Drizzle Kit**, **Prisma Migrate**, or **Alembic**.

