# 🧠 Architecture Decision Records (ADR)

This document records key architectural decisions made during the planning phase.
Each decision includes context, alternatives, and justification.

---

## ADR-001: Monorepo Architecture

### Context

The project includes a backend API, frontend application, and shared contracts.

### Decision

Use a **Monorepo** structure containing frontend, backend, and shared packages.

### Alternatives Considered

- Polyrepo (separate repositories)

### Reasoning

- Easier coordination between frontend and backend
- Simplified local development
- Better visibility for code reviewers
- Common practice in modern engineering teams

---

## ADR-002: Backend Architecture Style

### Context

The backend must remain maintainable as features grow.

### Decision

Adopt a **Clean Architecture-inspired layered structure**.

### Alternatives Considered

- Fat controllers
- MVC without service/domain separation

### Reasoning

- Improves separation of concerns
- Facilitates testing
- Reduces coupling to frameworks (Express, Prisma)

---

## ADR-003: REST + GraphQL API Strategy

### Context

Different types of operations require different API styles.

### Decision

- Use REST for transactional and command-based operations
- Use GraphQL for data-heavy read operations

### Alternatives Considered

- REST-only
- GraphQL-only

### Reasoning

- REST is clearer for mutations and payments
- GraphQL reduces over-fetching for complex queries

---

## ADR-004: Authentication Strategy

### Context

The system requires secure authentication suitable for production environments.

### Decision

- JWT access tokens
- Refresh tokens stored in HttpOnly cookies
- Token rotation

### Alternatives Considered

- Session-based auth
- JWT without refresh tokens

### Reasoning

- Industry-standard approach
- Improved security
- Better user experience

---

## ADR-005: Frontend State Management

### Context

The frontend has varying state complexity.

### Decision

- Redux Toolkit only for complex global state (cart)
- Prefer server-side data fetching

### Alternatives Considered

- Redux for all state
- Client-only data fetching

### Reasoning

- Reduced complexity
- Better performance
- Aligns with Next.js App Router philosophy
