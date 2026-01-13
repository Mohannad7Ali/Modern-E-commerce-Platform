# 🏗️ System Architecture — Modern E-Commerce Platform

## 1. Overview

This project is a **production-ready single-store e-commerce platform** designed to reflect real-world engineering practices.
The system is built using a **Monorepo architecture** with a clear separation between backend, frontend, and shared contracts.

The primary goals of this architecture are:

- Scalability
- Maintainability
- Security
- Clear separation of concerns
- Readability for senior-level code reviews

---

## 2. High-Level Architecture

Client (Browser)
↓
Next.js Frontend (App Router)
↓
Backend API (Express)
↓
Domain & Services
↓
Repositories (Prisma)
↓
PostgreSQL / Redis

The frontend communicates with the backend via:

- REST APIs (transactional operations)
- GraphQL APIs (data querying)

---

## 3. Repository Structure (Monorepo)

        /apps
          /backend → Express + Prisma backend
          /frontend → Next.js App Router frontend

        /packages
          /shared
          /types → Shared TypeScript types
          /constants → Shared constants

        /docs
          ARCHITECTURE.md
          DECISIONS.md

This structure enables:

- Shared contracts between frontend and backend
- Centralized documentation
- Easier project review and maintenance

---

## 4. Backend Architecture

### 4.1 Architectural Style

The backend follows a **Clean Architecture-inspired layered approach**.

Layers are strictly separated to avoid tight coupling.

### 4.2 Backend Layers

Controller Layer

HTTP concerns only

Request validation

Response formatting

Service Layer

Business logic

Use cases

Transaction coordination

Domain Layer

Core entities

Business rules

Domain invariants

Repository Layer

Data access

Prisma ORM interaction

Frameworks and infrastructure concerns are isolated from the domain.

---

## 5. API Strategy

### 5.1 REST APIs

Used for:

- Authentication
- Cart operations
- Orders & payments
- Admin actions

REST is preferred here due to its clarity, debuggability, and suitability for transactional flows.

### 5.2 GraphQL APIs

Used for:

- Product catalog
- Search
- Analytics dashboards

GraphQL is used selectively to reduce over-fetching and improve frontend flexibility.

---

## 6. Authentication & Authorization

### Authentication

- JWT Access Tokens (short-lived)
- Refresh Tokens stored in HttpOnly cookies
- Token rotation strategy

### Authorization

- Role-Based Access Control (RBAC)
- Roles: User, Admin, Superadmin
- Authorization enforced at backend middleware level

---

## 7. Frontend Architecture

### 7.1 Framework

- Next.js (App Router)
- TypeScript
- Tailwind CSS

### 7.2 Component Strategy

- Server Components by default
- Client Components only when required (forms, interactions)

### 7.3 State Management

| Concern        | Strategy             |
| -------------- | -------------------- |
| Authentication | Server + Cookies     |
| Cart           | Redux Toolkit        |
| UI State       | Local state          |
| Data Fetching  | Server Actions / API |

---

## 8. Non-Functional Requirements

- Security-first design
- Dockerized environment
- Logging & observability
- Performance optimization via caching (Redis)
- Clear error handling strategy

---

## 9. Out of Scope (For Now)

- Microservices
- Event-driven architecture
- Horizontal scaling
- Multi-store support

These concerns are intentionally deferred to keep the system focused and maintainable.
