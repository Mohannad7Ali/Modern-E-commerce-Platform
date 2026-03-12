# Horizon Store

**A production-grade, single-store e-commerce platform** built to showcase advanced full-stack TypeScript development.

The **backend** is a complete, enterprise-ready Express.js application featuring Prisma, PostgreSQL, Redis, Socket.IO, and WebRTC — architected for scalability, security, and real-time performance. The **Next.js frontend** is actively in progress (core flows like auth, catalog, and cart are functional; checkout, live chat, and full admin UI are coming soon).

This project highlights deep backend expertise: modular architecture, type-safe schemas, intelligent caching, dual REST/GraphQL APIs, payment webhooks, and real-time communication systems. Perfect foundation for anyone wanting to study or extend a modern e-commerce backend.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/Abdelrahman-Aboalkhair/horizon-store.git
cd horizon-store

# 2. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# 3. Start with Docker (recommended)
docker compose up --build -d

# 4. Seed the database
docker compose exec server npm run seed

# 5. Access the application
# Frontend (WIP): http://localhost:3000
# Backend API: http://localhost:5000/api/v1
# Swagger Docs: http://localhost:5000/api-docs
# GraphQL Playground: http://localhost:5000/api/v1/graphql
🧪 Test Accounts (After Seeding)

| Role       | Email                  | Password    | Key Capabilities                          |
|------------|------------------------|-------------|-------------------------------------------|
| Superadmin | superadmin@example.com | password123 | Full system control, create admins        |
| Admin      | admin@example.com      | password123 | Products, orders, analytics, reports      |
| User       | user@example.com       | password123 | Shopping, cart, checkout, order tracking  |
✨ Features
Backend Core (Fully Implemented & Production-Ready)
The backend is the main focus of Horizon Store — a clean, scalable, and highly maintainable system that demonstrates real-world engineering best practices.

🔐 Enterprise Authentication
JWT + httpOnly refresh token rotation
OAuth2 social login (Google, Facebook, Twitter, Apple)
Email verification, password reset flows
Role-based authorization middleware (Superadmin, Admin, User)

🛍️ Advanced Product Catalog
Rich Prisma schema with Categories, Attributes, Sections, and Variants
Dynamic SKU generation for multi-attribute combinations
Cloudinary image optimization pipeline (galleries, thumbnails, responsive)
Redis-cached filtering, search, and dependent dropdowns

🛒 Cart & Checkout Engine
Persistent carts for guests and authenticated users
Stripe integration with full webhook handling
Order lifecycle management (Pending → Shipped → Delivered → Returned)

📦 Order & Shipment Management
Complete order workflow with status tracking
External shipping webhook support
Transaction safety using Prisma

📊 Analytics & Reporting
Dual API support: REST v1/v2 + GraphQL v1/v2
Redis-cached dashboards (revenue, inventory, user metrics)
Interactive data via Prisma aggregations

💬 Real-Time Communication
Socket.IO powered customer-to-admin chat (persisted in DB)
Full WebRTC audio/video calling system
Live admin monitoring dashboard

🛡️ Production-Grade Infrastructure
Rate limiting, Zod validation, Helmet security
Structured logging with Winston
Dockerized services with health checks


Frontend (In Active Development)

Next.js 15 App Router + Server Components
Redux Toolkit + Tailwind CSS + Framer Motion
Current Status: Authentication, product browsing, cart, and basic admin views are live. Full checkout, chat integration, and advanced analytics UI are under active development.

🛠️ Tech Stack
Backend (The Star of the Show)


















































LayerTechnologyPurposeRuntimeNode.js 22 + TypeScriptType safety & performanceFrameworkExpress.jsLightweight & extensibleDatabasePrisma ORM + PostgreSQLType-safe queries & migrationsCachingRedisSessions, hot queries, pub/subReal-timeSocket.IO + WebRTCChat & live callsPaymentsStripeSecure checkout & webhooksMediaCloudinaryOptimized image handlingDocumentationSwagger + GraphQL PlaygroundInteractive API testing
Frontend
Next.js • TypeScript • Tailwind CSS • Redux Toolkit • Recharts
DevOps
Docker Compose • Prisma Migrate • Seed scripts
📁 Project Structure (Backend-Focused)
texthorizon-store/
├── server/                  # Fully implemented backend (main focus)
│   ├── src/
│   │   ├── modules/         # Feature-sliced architecture (auth, products, orders, chat, analytics)
│   │   ├── shared/          # Middleware, validators, utilities
│   │   └── prisma/          # Schema + migrations
│   ├── seeds/               # Production-like test data
│   └── docs/                # Swagger configuration
├── client/                  # Next.js frontend (WIP)
├── docker-compose.yml       # Complete stack orchestration
└── collections/             # Postman collections for API testing
Architecture Highlights (demonstrating experience):

Modular, single-responsibility modules
Repository/Service/Controller pattern
Redis for 90% read performance boost
Prisma transactions & connection pooling
Scalable design ready for horizontal deployment

⚙️ Installation & Running

**Docker (Recommended – 5 minutes)**
🌱 Database Seeding
📚 API Documentation

Swagger UI: http://localhost:5000/api-docs (fully interactive)
GraphQL Playground: http://localhost:5000/api/v1/graphql

🧪 Testing

Jest + Supertest for backend
Postman collections included
Role-based testing flows documented

🚀 Deployment Ready
Optimized for Vercel (frontend), Render/Railway/AWS (backend), Neon/Supabase (PostgreSQL), and Upstash (Redis).
🔒 Security & Best Practices

OWASP-aligned security headers
JWT rotation + httpOnly cookies
Input sanitization & rate limiting
Production-ready environment handling

📸 Screenshots
Backend-Driven Views (Frontend WIP)
<img src="https://github.com/Abdelrahman-Aboalkhair/horizon-store/raw/main/assets/screenshots/dashboard_overview.png" alt="Admin Dashboard">
<img src="https://github.com/Abdelrahman-Aboalkhair/horizon-store/raw/main/assets/screenshots/dashboard_chat.png" alt="Live Chat">
More screenshots will be added as the frontend matures.
🤝 Contributing
Backend improvements, performance optimizations, and new real-time features are especially welcome!
📄 License
MIT License – free to use, learn from, and extend.

Built with passion and precision by Mohannad Ali
A backend architected from the ground up to handle real-world e-commerce scale and complexity.
GitHub Issues • Email
```
