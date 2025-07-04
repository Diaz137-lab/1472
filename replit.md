# QuotexWallet - Cryptocurrency Trading Platform

## Overview

QuotexWallet is a modern cryptocurrency trading platform built as a full-stack web application. It provides users with the ability to buy, sell, and manage cryptocurrency portfolios through an intuitive interface. The application features real-time price tracking, portfolio management, trading capabilities, and institutional services.

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
- June 30, 2025. Completed comprehensive admin panel implementation with user management, balance controls, and action history tracking
- June 30, 2025. Rebranded from FutureWallet to QuotexWallet
- July 1, 2025. Successfully migrated from Replit Agent to standard Replit environment with PostgreSQL database
- July 1, 2025. Enhanced admin console with improved "Manage Accounts" section and optimized Total Balance display

## Recent Changes

### Brand Update (June 30, 2025)
- Complete rebrand from FutureWallet to QuotexWallet
- Updated all UI components, page titles, and branding elements
- Modified authentication pages, headers, and footer references
- Updated email addresses and contact information
- Revised documentation and project files

### Admin Panel Implementation (June 30, 2025)
- Added complete admin interface at /admin route
- Implemented user management with verification status display
- Created balance adjustment system with credit/debit functionality
- Built comprehensive audit trail for all administrative actions
- Added real-time statistics dashboard
- Integrated admin navigation link in header menu
- Created mock test data with sample users and balance actions
- Backend API routes for admin operations fully functional

### Secure Admin System Implementation (June 30, 2025)
- Implemented secure admin authentication with custom credentials (Username: "Oldies101!", Password: "Foundation101")
- Added three-tier security system requiring three 6-digit verification codes (all set to "666666") for fund transfers
- Created fund management system with $10,000,000 transaction limit per operation
- Established comprehensive admin console with user balance controls
- Integrated secure API endpoints with JWT token authentication and one-time code verification
- Successfully migrated from Replit Agent to standard Replit environment with PostgreSQL database

### Database Migration and Agent-to-Replit Migration (June 30, 2025)
- Successfully migrated from Replit Agent to standard Replit environment
- Migrated from in-memory storage to PostgreSQL database
- Added address field to user schema for expanded user profiles
- Executed database schema migrations using Drizzle ORM
- Configured environment variables for database connectivity
- Verified all API endpoints are functioning with persistent storage
- Initialized database with 5 test users including Kelly Ann James (address: 58 Benjamina Drive, Red Bank Plains, QLD, Australia)
- Set up $20,000,000 system balance with proper admin balance action tracking

### Current System State
- Full-featured cryptocurrency trading platform operational under QuotexWallet brand
- Complete user authentication and portfolio management with persistent database storage
- Trading interface with buy/sell capabilities
- Market explorer with real-time price data
- Enhanced secure admin panel with gradient UI design and individual user balance displays
- Professional UI with modern gradient backgrounds and improved visual hierarchy
- PostgreSQL database backend with 5 initialized users and $20,000,000 admin balance
- Successfully migrated from Replit Agent to standard Replit environment

### Latest Enhancements (July 4, 2025)
- **Complete Migration**: Successfully migrated from Replit Agent to standard Replit environment
- **Database Initialization**: Resolved database connection issues and properly initialized PostgreSQL with all required tables
- **Enhanced Admin Console**: Redesigned professional interface with intuitive user management
- **Real-time Fund Management**: Instant balance updates with quick credit buttons ($100-$50K)
- **Custom Amount Input**: Flexible funding system with custom amount capabilities
- **Improved Transaction Display**: Enhanced formatting with proper action types and Bitcoin conversions
- **Live Bitcoin Pricing**: Real-time Bitcoin price integration with CoinGecko API
- **Professional UI**: Fixed responsive design with proper text formatting and click functionality
- **Comprehensive Transaction History**: Complete audit trail with detailed transaction modals
- **Fixed Navigation Issues**: All header buttons (Wallet, Exchange, Institutional, Explore) now work perfectly
- **Enhanced User Experience**: Added proper redirects, authentication flows, and interactive feedback
- **Functional Trading System**: Trading interface with proper user authentication and portfolio updates
- **Working Contact Forms**: Institutional page contact form with validation and success notifications
- **Live Exchange Functionality**: Real-time currency conversion with preview swap capabilities
- **Enhanced Search**: Explorer page with working cryptocurrency search and filtering
- **Bitcoin-Themed Enhancement**: Complete visual overhaul with Bitcoin-focused design, floating animations, and gradient backgrounds
- **Smart Form System**: Implemented intelligent address auto-fill with ZIP code detection and form validation
- **Real-time Price Integration**: Live Bitcoin price display throughout the platform with CoinGecko API
- **Kelly Ann James Account**: Credited Kelly Ann James with $520,000 account balance with live Bitcoin conversion display
- **Fixed Admin Modal**: Resolved admin login modal close button functionality
- **Enhanced Header Navigation**: Professional gradient navigation buttons with hover tooltips and smooth transitions
- **Improved Homepage Navigation**: Enhanced all section navigation buttons with gradient designs and proper routing
- **Enhanced Dashboard**: Bitcoin-focused portfolio display with live conversion rates and professional design
- **Professional Vibes**: Upgraded entire platform with modern gradient designs, smooth animations, and enhanced user experience

## User Preferences

Preferred communication style: Simple, everyday language.