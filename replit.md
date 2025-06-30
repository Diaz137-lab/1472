# FutureWallet - Cryptocurrency Trading Platform

## Overview

FutureWallet is a modern cryptocurrency trading platform built as a full-stack web application. It provides users with the ability to buy, sell, and manage cryptocurrency portfolios through an intuitive interface. The application features real-time price tracking, portfolio management, trading capabilities, and institutional services.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **API Pattern**: RESTful API with Express routes
- **Session Management**: Express sessions with PostgreSQL storage

### Development Environment
- **Build Tool**: Vite for frontend bundling
- **TypeScript**: Full-stack type safety
- **Hot Reload**: Vite HMR for development
- **Code Organization**: Monorepo structure with shared types

## Key Components

### Database Schema
Located in `shared/schema.ts`, the database includes:
- **Users**: Authentication and profile information
- **Portfolios**: User portfolio aggregation and total values
- **Holdings**: Individual cryptocurrency positions
- **Transactions**: Trading history and order management
- **Crypto Assets**: Reference data for supported cryptocurrencies

### Authentication System
- Registration and login endpoints
- Password-based authentication (basic implementation)
- Session-based user state management
- User portfolio initialization on registration

### Trading Engine
- Buy/sell order processing
- Portfolio balance updates
- Transaction history tracking
- Real-time price integration (mock data structure)

### Data Storage Strategy
- In-memory storage implementation (`MemStorage` class)
- Interface-based design (`IStorage`) for easy database migration
- Prepared for PostgreSQL integration via Drizzle ORM

## Data Flow

1. **User Registration/Login**: Creates user account and initializes empty portfolio
2. **Portfolio Management**: Aggregates holdings and calculates total values
3. **Trading Operations**: Processes buy/sell orders and updates holdings
4. **Price Updates**: Mock price data displayed through charts and tickers
5. **Transaction History**: Records all trading activities for audit trail

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **recharts**: Chart rendering library
- **wouter**: Lightweight React router

### Development Tools
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Backend bundling for production
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Development Mode
- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- Concurrent frontend/backend development server

### Production Build
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild bundles Express server to `dist/index.js`
3. Static file serving: Express serves built frontend assets
4. Database: PostgreSQL connection via environment variables

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- Development vs production environment detection
- Replit-specific development tooling integration

## Changelog
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.