# Ecommerce Modern Platform

**A production-grade, single-store e-commerce platform** built to showcase advanced full-stack TypeScript development.

The **backend** is a complete, enterprise-ready Express.js application featuring Prisma, PostgreSQL, Redis, Socket.IO, and WebRTC — architected for scalability, security, and real-time performance. The **Next.js frontend** is actively in progress (core flows like auth, catalog, and cart are functional; checkout, live chat, and full admin UI are coming soon).

This project highlights deep backend expertise: modular architecture, type-safe schemas, intelligent caching, dual REST/GraphQL APIs, payment webhooks, and real-time communication systems. Perfect foundation for anyone wanting to study or extend a modern e-commerce backend.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Mohannad7Ali/Modern-E-commerce-Platform
cd Modern-E-commerce-Platform

# 2. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# 3. Start with Docker (recommended)
docker compose up --build -d

# 4. Seed the database
docker compose exec server npm run seed

# 5. Access the application
# Frontend (WIP): http://localhost:3000
# Backend API: http://localhost:7000/api/v1
# Swagger Docs: http://localhost:7000/api/docs
# GraphQL Playground: http://localhost:7000/api/v1/graphql
```

## 🔐 Test Accounts

For testing purposes, you can use the following pre-configured accounts to explore different roles and permissions:

| Role              | Email                    | Password      | Key Capabilities                                      |
| :---------------- | :----------------------- | :------------ | :---------------------------------------------------- |
| 👑 **Superadmin** | `superadmin@example.com` | `password123` | Full system control, admin management, system logs    |
| 👨‍💼 **Admin**      | `admin@example.com`      | `password123` | Product management, orders, analytics, and reports    |
| 🛒 **User**       | `user@example.com`       | `password123` | Shopping, cart, checkout, and personal order tracking |

## Features

### 💻 Backend (Fully Implemented & Production-Ready)

- **Enterprise Authentication:** JWT with `httpOnly` refresh token rotation, OAuth2 social login, email verification, password reset flows, and role-based middleware.
- **Advanced Product Catalog:** Robust Prisma schema featuring Categories, Attributes, Sections, and Variants with dynamic SKU generation.
- **Performance:** Redis caching for hot queries and Cloudinary integration for optimized image handling.
- **Cart & Checkout Engine:** Persistent shopping carts, seamless Stripe integration, and full order lifecycle management.
- **Order & Shipment Management:** Status tracking with external shipping webhook support and data integrity via Prisma transactions.
- **Real-Time Communication:** Full-duplex chat using Socket.IO and WebRTC for high-quality audio/video calls.
- **Infrastructure:** Production-grade security with Rate limiting, Helmet, Winston logging, and Dockerized services.

### 🎨 Frontend (In Active Development)

- **Modern Architecture:** Built with **Next.js 15 (App Router)** and React Server Components (RSC).
- **State & Styling:** Efficient state management with Redux Toolkit and modern styling via Tailwind CSS.
- **User Experience:** Smooth transitions with Framer Motion and data visualization using Recharts.
- **Core Flows:** Fully implemented authentication, product browsing, persistent cart, and initial admin dashboards.

---

## 🛠️ Tech Stack

| Layer         | Technology                | Purpose                                       |
| :------------ | :------------------------ | :-------------------------------------------- |
| **Runtime**   | Node.js 22 + TypeScript   | Scalable execution & Type safety              |
| **Backend**   | Express.js                | Lightweight & extensible API framework        |
| **Database**  | Prisma ORM + PostgreSQL   | Type-safe queries & structured data           |
| **Caching**   | Redis                     | Session management & performance optimization |
| **Frontend**  | Next.js 15 + Tailwind CSS | UI/UX & Server-side rendering                 |
| **State**     | Redux Toolkit             | Centralized client-side state                 |
| **Real-time** | Socket.IO + WebRTC        | Live chat & Video/Audio streaming             |
| **Payments**  | Stripe                    | Secure payment processing & webhooks          |
| **Media**     | Cloudinary                | Cloud-based image optimization                |
| **DevOps**    | Docker + Prisma Migrate   | Containerization & automated migrations       |

## 📁 Project Structure

The project follows a **Monorepo**-like structure to keep the backend and frontend tightly coupled but logically separated.

```text
Ecommerce/
├── 📂 server/                  # Fully implemented Node.js backend
│   ├── 📂 src/
│   │   ├── 📂 modules/         # Feature-sliced architecture (auth, products, orders, chat, analytics)
│   │   ├── 📂 shared/          # Global middleware, validators, and utilities
│   │   └── 📂 prisma/          # Database schema, migrations, and seeds
│   ├── 📂 seeds/               # Production-grade mock data for testing
│   └── 📂 docs/                # Swagger API documentation & OpenAPI config
├── 📂 client/                  # Next.js 15 frontend (Active Development)
│   ├── 📂 components/          # Shadcn UI & reusable business components
│   ├── 📂 store/               # Redux Toolkit slices & RTK Query APIs
│   └── 📂 hooks/               # Custom React hooks (auth, ui, toast)
├── 🐳 docker-compose.yml       # Full stack orchestration (PostgreSQL, Redis, App)
```

## ⚙️ Installation & Running

### 🐳 Docker (Recommended)

The fastest way to get the entire stack (Backend, Database, Redis) up and running.

```bash
# Clone the repository
git clone https://github.com/Mohannad7Ali/Modern-E-commerce-Platform
cd Modern-E-commerce-Platform

# Start the services
docker-compose up --build
```

## 🔒 Security & Best Practices

The **Horizon Store** architecture prioritizes security and data integrity, implementing industry-standard protocols to mitigate common vulnerabilities.

### 🛡️ Core Security Features

- **OWASP-Aligned Security:** Implementation of security headers via `Helmet` to protect against XSS, Clickjacking, and MIME-sniffing.
- **Advanced Authentication:** \* Dual-token system: Short-lived **JWT Access Tokens** + **Refresh Tokens**.
  - Security-first storage: Tokens are delivered via **`httpOnly` and `Secure` cookies** to prevent client-side script access.
  - **Token Rotation:** Automatic refresh token rotation to invalidate compromised sessions.
- **Traffic & Request Protection:**
  - **Rate Limiting:** Protects sensitive endpoints (Auth, Payments) from brute-force and DoS attacks.
  - **Input Sanitization:** Strict data validation using `Zod` and `Prisma` to prevent NoSQL/SQL Injection.
- **Production-Ready Management:**
  - **Environment Handling:** Secure handling of secrets using `.env` with strict validation to ensure no service starts without required configurations.
  - **Error Sanitization:** Detailed logging via `Winston` in development, while masking stack traces in production to prevent information leakage.
  - **CORS Policy:** Strict Whitelisting of frontend domains to control cross-origin resource access.

---

### 🧪 Quality Assurance

- **Schema Validation:** Every API request is validated against a schema before reaching the controller.
- **Transaction Safety:** Use of Prisma Transactions to ensure atomicity in complex operations like order placement and payment processing.

## 📸 Screenshots

### Backend-driven views (Frontend WIP)

<p align="center">
  <img src="https://github.com/Mohannad7Ali/Modern-E-commerce-Platform/raw/main/assets/screenshots/dashboard_overview.png" alt="Admin Dashboard" width="48%">
  <img src="https://github.com/Mohannad7Ali/Modern-E-commerce-Platform/raw/main/assets/screenshots/dashboard_chat.png" alt="Live Chat" width="48%">
  <img src="https://github.com/Mohannad7Ali/Modern-E-commerce-Platform/raw/main/assets/screenshots/analytics_dashboard.png" alt="analytics_dashboard" width="48%">
  <img src="https://github.com/Mohannad7Ali/Modern-E-commerce-Platform/raw/main/assets/screenshots/homepage.png" alt="homepage" width="48%">
  <img src="https://github.com/Mohannad7Ali/Modern-E-commerce-Platform/raw/main/assets/screenshots/sign-up.png" alt="homepage" width="48%">
  <img src="https://github.com/Mohannad7Ali/Modern-E-commerce-Platform/raw/main/assets/screenshots/track_your_order.png" alt="track_your_order" width="48%">
</p>

> **Note:** The frontend is currently in active development. These screenshots showcase the administrative dashboards and real-time communication modules.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- **Backend:** Especially welcome are improvements to API performance and database query optimizations.
- **Real-Time:** New features for Socket.IO or WebRTC (like screen sharing or group calls) are highly encouraged.
- **Frontend:** Help us complete the administrative dashboards and refine the user experience.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information. This project is free to use, learn from, and extend for your own purposes.

---

<p align="center">
  Built with <b>passion</b> and <b>precision</b> by <a href="https://github.com/Mohannad7Ali">Mohannad Ali</a>.
</p>
