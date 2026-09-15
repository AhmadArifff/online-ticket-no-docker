# online-ticket-no-docker

> A modern, cross-platform Progressive Web App (PWA) for online ticket management and sales, built with monorepo architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0-green.svg)
![Node](https://img.shields.io/badge/node-18+-blue.svg)
![Status](https://img.shields.io/badge/status-In%20Development-yellow.svg)

## 🎯 Project Overview

**Online Ticket** adalah sistem manajemen tiket online modern yang memungkinkan pengguna membeli dan mengelola tiket untuk berbagai event secara online. Aplikasi ini dibangun sebagai Progressive Web App (PWA) dengan dukungan cross-platform (web, iOS, Android) dan deployment serverless di Vercel.

### ✨ Key Features

- 📱 **Progressive Web App (PWA)** - Offline-capable, installable, responsive
- 🌐 **Cross-Platform** - Web, iOS (via PWA), Android (via PWA)
- 🚀 **Serverless Architecture** - Deployed on Vercel with zero infrastructure overhead
- 💾 **Modern Database** - PostgreSQL via Supabase with real-time capabilities
- 📦 **Monorepo Structure** - Organized with pnpm workspaces and Turbo
- 🔐 **Security First** - Built-in authentication, authorization, and data protection
- 🎨 **Modern UI** - React 18+, Tailwind CSS, responsive design
- 📊 **Real-time Updates** - WebSocket support via Supabase Realtime
- 💳 **Payment Ready** - Integrated with Stripe for secure transactions
- 📧 **Notifications** - Push notifications, email, and in-app messages

## 📋 Project Structure

```
online-ticket-no-docker/
├── packages/
│   ├── shared/              # Shared types, utilities, constants
│   ├── web/                 # Main web application (Next.js)
│   ├── api/                 # Backend API (Next.js API Routes)
│   ├── mobile/              # Mobile-optimized PWA
│   └── admin/               # Admin dashboard
├── docs/                    # Documentation
├── .github/workflows/       # CI/CD pipelines
├── PRD.md                   # Product Requirements Document
├── README.md                # This file
└── LICENSE                  # MIT License
```

Untuk dokumentasi lengkap struktur proyek, lihat [PRD.md](./PRD.md#monorepo-structure).

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x atau lebih tinggi
- **pnpm** 8.x atau lebih tinggi (recommended) atau npm/yarn
- **Git** untuk version control

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/AhmadArifff/online-ticket-no-docker.git
cd online-ticket-no-docker
```

2. **Install Dependencies**
```bash
# Using pnpm (recommended)
pnpm install

# atau using npm
npm install

# atau using yarn
yarn install
```

3. **Setup Environment Variables**
```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan credential Supabase dan services lainnya:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_KEY=[YOUR_SERVICE_KEY]

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[RANDOM_SECRET]

# Stripe (Payment)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[YOUR_KEY]
STRIPE_SECRET_KEY=[YOUR_SECRET_KEY]
```

Untuk variabel lengkap, lihat [.env.example](./.env.example).

4. **Setup Database**

Pastikan sudah membuat project Supabase dan menjalankan migrations:

```bash
# Apply database migrations
pnpm db:migrate

# atau seed database (opsional)
pnpm db:seed
```

5. **Start Development Server**
```bash
pnpm dev
```

Aplikasi akan berjalan di:
- **Web**: http://localhost:3000
- **API**: http://localhost:3000/api

### Running Specific Packages

```bash
# Development
pnpm dev --filter=web              # Run web app
pnpm dev --filter=api              # Run API only
pnpm dev --filter=shared           # Run shared package

# Build all packages
pnpm build

# Build specific package
pnpm build --filter=web

# Run tests
pnpm test

# Lint & format
pnpm lint
pnpm format
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3+
- **State Management**: Zustand / Redux Toolkit
- **HTTP Client**: TanStack Query (React Query)
- **Form**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Components**: shadcn/ui

### Backend
- **Runtime**: Node.js 18+
- **API Framework**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth + NextAuth.js
- **Real-time**: Supabase Realtime (WebSocket)
- **File Storage**: Supabase Storage
- **ORM**: Prisma / Supabase Client

### DevOps & Infrastructure
- **Hosting**: Vercel (Serverless)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Vercel Analytics

### Development Tools
- **Package Manager**: pnpm
- **Monorepo**: Turbo
- **Testing**: Jest + Vitest + Playwright
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Product Requirements Document (design, architecture, database schema)
- **[API Documentation](./docs/API.md)** - API endpoints reference
- **[Database Schema](./docs/DATABASE.md)** - Database design details
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment steps
- **[Contributing](./docs/CONTRIBUTING.md)** - How to contribute

## 🔄 Development Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/add-ticket-booking

# 2. Make changes
pnpm dev
# ... develop & test ...

# 3. Run tests & linting
pnpm test
pnpm lint

# 4. Commit changes
git add .
git commit -m "feat: add ticket booking flow"

# 5. Push & create Pull Request
git push origin feature/add-ticket-booking
```

### Deployment

**To Staging** (automatic on PR):
```bash
# GitHub Actions akan automatically deploy preview ke Vercel
```

**To Production**:
```bash
# Merge ke main branch
git checkout main
git pull origin main

# GitHub Actions akan automatically deploy ke production
# Monitor di: https://vercel.com/dashboard
```

## 📊 Project Status

### Current Version: 1.0 (In Development)

**Completed:**
- ✅ Project initialization & documentation
- ✅ Database schema design
- ✅ Monorepo structure setup

**In Progress:**
- 🔄 Authentication system
- 🔄 API scaffolding
- 🔄 UI component library

**Planned:**
- ⏳ MVP release (Q1 2027)
- ⏳ Production launch (Q2 2027)

Lihat [Development Roadmap](./PRD.md#development-roadmap) untuk timeline lengkap.

## 🤝 Contributing

Kontribusi sangat welcome! Silakan baca [CONTRIBUTING.md](./docs/CONTRIBUTING.md) untuk guidelines.

### Getting Help
- 📖 Lihat dokumentasi di folder `docs/`
- 🐛 Report bugs di [GitHub Issues](https://github.com/AhmadArifff/online-ticket-no-docker/issues)
- 💬 Diskusi di [GitHub Discussions](https://github.com/AhmadArifff/online-ticket-no-docker/discussions)

## 📄 License

Proyek ini dilisensikan di bawah **MIT License** - lihat [LICENSE](./LICENSE) file untuk detail.

## 👥 Author & Team

**Project Lead**: Ahmad Arif  
**GitHub**: [@AhmadArifff](https://github.com/AhmadArifff)

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) - Deployment platform
- [Supabase](https://supabase.com) - Database & auth service
- [Next.js](https://nextjs.org) - Framework
- [Tailwind CSS](https://tailwindcss.com) - Styling

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- 📧 Email: [contact info]
- 🐦 Twitter: [@AhmadArifff](https://twitter.com/AhmadArifff)
- 💬 Discord: [Discord Server]

---

**Status**: 🔨 In Development  
**Last Updated**: 2026-09-15  
**Next Milestone**: Database setup & API scaffolding (Q4 2026)

---

*Dibuat dengan ❤️ untuk community Indonesia*
