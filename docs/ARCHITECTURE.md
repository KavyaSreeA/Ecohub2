# EcoHub Platform - System Architecture

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Models](#data-models)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)

---

## Overview

EcoHub Platform follows a modern **monolithic-first architecture** with microservice-ready design patterns, enabling gradual migration to microservices as the platform scales.

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between frontend, backend, and data layers
2. **Modularity**: Feature-based module organization for independent development
3. **Scalability**: Horizontal scaling support through stateless design
4. **Security First**: Authentication, authorization, and data protection at every layer
5. **API-Driven**: RESTful APIs enabling multi-platform support (web, mobile, IoT)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React SPA (Single Page Application)        │  │
│  │  Components | Pages | Context | Services | Config   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Server                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Backend Server               │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │   Auth   │  │  Routes  │  │Middleware│         │  │
│  │  └──────────┘  └──────────┘  └──────────┘         │  │
│  │                                                      │  │
│  │  ┌─────────────────────────────────────────┐       │  │
│  │  │         Business Logic Layer            │       │  │
│  │  │  • Conservation  • Energy               │       │  │
│  │  │  • Transport     • Waste Exchange       │       │  │
│  │  └─────────────────────────────────────────┘       │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   MongoDB    │  │    Redis     │  │  File Store  │     │
│  │ (Primary DB) │  │   (Cache)    │  │   (S3/GCS)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│                                                              │
│  • Payment Gateway (Stripe/Razorpay)                        │
│  • Email Service (SendGrid)                                 │
│  • Maps API (Google Maps/Mapbox)                            │
│  • AI/ML Services (OpenAI)                                  │
│  • Analytics (Google Analytics)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App (Router)
│
├── Layout Components
│   ├── Navbar (Global Navigation)
│   └── Footer (Global Footer)
│
├── Page Components
│   ├── HomePage
│   ├── ConservationPage
│   │   ├── CampaignCard
│   │   ├── ForumPost
│   │   └── EventCard
│   ├── EnergyPage
│   │   ├── EnergySourceCard
│   │   └── ProjectCard
│   ├── SolarCalculatorPage
│   │   ├── InputForm
│   │   ├── RecommendationCard
│   │   └── AnalyticsChart
│   ├── TransportPage
│   │   ├── RouteCard
│   │   └── VehicleCard
│   ├── WastePage
│   │   ├── ListingCard
│   │   └── CategoryFilter
│   ├── Dashboard
│   ├── ProfilePage
│   ├── LoginPage
│   └── RegisterPage
│
├── Context Providers
│   └── AuthContext (User Authentication State)
│
└── Services
    ├── apiService (Centralized API calls)
    └── solarAIService (Solar calculations)
```

### State Management Strategy

**Context API** for global state:
- **AuthContext**: User authentication state, login/logout functions
- Future: Add ConservationContext, EnergyContext as modules grow

**Local State** (useState):
- Form inputs
- UI toggles
- Component-specific data

**Server State** (Future: React Query):
- API data caching
- Background refetching
- Optimistic updates

### Routing Architecture

```javascript
/ (HomePage)
├── /conservation (ConservationPage)
├── /energy (EnergyPage)
├── /solar-calculator (SolarCalculatorPage)
├── /transport (TransportPage)
├── /waste (WastePage)
├── /dashboard (Dashboard - Protected)
├── /profile (ProfilePage - Protected)
├── /login (LoginPage)
├── /register (RegisterPage)
└── /events/:id (EventDetailPage)
```

### Design System

**Color Palette**:
- Primary: `#10b981` (Emerald Green)
- Secondary: `#3b82f6` (Blue)
- Accent: `#f59e0b` (Amber)
- Background: `#0a0f1e` (Dark Blue)

**Typography**:
- Font Family: Inter (system-ui fallback)
- Headings: Bold weights (600-700)
- Body: Regular (400-500)

**Components**:
- All components use Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for consistent iconography

---

## Backend Architecture

### Express.js Server Structure

```javascript
server/
├── index.js              // Main server file
├── middleware/           // Custom middleware (future)
│   ├── auth.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── routes/              // API routes (future modularization)
│   ├── auth.js
│   ├── conservation.js
│   ├── energy.js
│   ├── transport.js
│   └── waste.js
├── controllers/         // Business logic (future)
├── models/             // Data models (future)
└── utils/              // Helper functions (future)
```

### API Module Structure

The backend is organized into **4 core modules**:

#### 1. Authentication Module
- User registration and login
- JWT token generation and verification
- Password hashing with bcrypt
- Token refresh mechanism

#### 2. Conservation Module
- Campaign management (CRUD)
- Forum posts and discussions
- Event coordination
- Community engagement tracking

#### 3. Renewable Energy Module
- Energy sources catalog
- Project tracking and management
- Solar calculator (AI-powered recommendations)
- Energy statistics and analytics

#### 4. Transport Module
- Route information and planning
- Vehicle fleet tracking
- CO2 savings calculation
- User ride history

#### 5. Waste Exchange Module
- Waste listing marketplace
- Category management
- Location-based search
- Transaction tracking

### Middleware Pipeline

```javascript
Request
  ↓
CORS Configuration
  ↓
JSON Body Parser
  ↓
Authentication Check (Protected Routes)
  ↓
Route Handler
  ↓
Error Handler
  ↓
Response
```

### Database Schema (Conceptual)

#### Users Collection
```javascript
{
  id: String (UUID),
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  profile: {
    avatar: String,
    bio: String,
    location: String
  }
}
```

#### Campaigns Collection
```javascript
{
  id: String (UUID),
  title: String,
  description: String,
  goal: Number,
  raised: Number,
  image: String (URL),
  category: String (forest/ocean/wildlife),
  status: String (active/completed/paused),
  createdBy: String (user ID),
  createdAt: Date,
  updatedAt: Date
}
```

#### Energy Projects Collection
```javascript
{
  id: String (UUID),
  name: String,
  type: String (solar/wind/hydro/geothermal),
  location: String,
  capacity: String,
  status: String (operational/construction/planning),
  completionDate: Date,
  coordinates: {
    lat: Number,
    lng: Number
  }
}
```

#### Waste Listings Collection
```javascript
{
  id: String (UUID),
  title: String,
  category: String (paper/metal/plastic/e-waste/organic/glass),
  quantity: String,
  location: String,
  seller: String (user ID),
  price: String,
  image: String,
  status: String (available/pending/sold),
  createdAt: Date
}
```

---

## Data Models

### Authentication Flow

```
1. User Registration
   Client → POST /api/auth/register
   Server → Hash password → Store user → Generate JWT
   Server → Client: { token, user }

2. User Login
   Client → POST /api/auth/login
   Server → Verify credentials → Generate JWT
   Server → Client: { token, user }

3. Protected Route Access
   Client → GET /api/protected (Authorization: Bearer <token>)
   Server → Verify JWT → Execute route logic
   Server → Client: { data }

4. Token Verification
   Client → GET /api/auth/verify (Authorization: Bearer <token>)
   Server → Decode JWT → Return user data
   Server → Client: { user }
```

### API Request/Response Flow

```
Client Request
  ↓
  {
    method: "GET/POST/PUT/DELETE",
    url: "/api/module/resource",
    headers: {
      Authorization: "Bearer <jwt_token>",
      Content-Type: "application/json"
    },
    body: { data }
  }
  ↓
Server Processing
  ↓
Server Response
  ↓
  {
    success: boolean,
    data: object/array,
    message: string (optional),
    error: string (on failure)
  }
```

---

## Security Architecture

### Authentication & Authorization

1. **JWT-Based Authentication**
   - Tokens expire after 7 days
   - Stored in localStorage (client-side)
   - Included in Authorization header for protected routes

2. **Password Security**
   - bcrypt hashing with salt rounds: 10
   - Minimum password requirements (future implementation)
   - Password reset via email (future implementation)

3. **Role-Based Access Control (RBAC)**
   - Current roles: user, admin
   - Future: moderator, organization, government

### API Security

1. **CORS Configuration**
   - Allows cross-origin requests from trusted domains
   - Configurable allowed origins

2. **Rate Limiting** (Future Implementation)
   - Prevent brute force attacks
   - API usage quotas per user/IP

3. **Input Validation**
   - Server-side validation for all inputs
   - Sanitization to prevent XSS and SQL injection

4. **HTTPS Only**
   - All production traffic must use HTTPS
   - HTTP Strict Transport Security (HSTS) headers

### Data Protection

1. **Sensitive Data Encryption**
   - Environment variables for secrets
   - Database encryption at rest (production)
   - Secure key management

2. **Audit Logging** (Future Implementation)
   - Track all user actions
   - Monitor suspicious activities
   - Compliance reporting

---

## Scalability Considerations

### Horizontal Scaling

1. **Stateless Server Design**
   - No session storage on server
   - JWT for stateless authentication
   - Ready for load balancing

2. **Database Scaling**
   - MongoDB replica sets for high availability
   - Read replicas for query distribution
   - Sharding for large datasets

3. **Caching Strategy**
   - Redis for session/API caching
   - CDN for static assets
   - Browser caching headers

### Microservices Migration Path

**Phase 1 (Current)**: Monolithic application
**Phase 2**: Extract high-traffic modules
- Conservation Service
- Energy Service
- Transport Service
- Waste Exchange Service

**Phase 3**: Event-driven architecture
- Message queues (RabbitMQ/Kafka)
- Asynchronous processing
- Pub/Sub patterns

### Performance Optimization

1. **Frontend**
   - Code splitting with React.lazy
   - Image optimization and lazy loading
   - Service Workers for offline support

2. **Backend**
   - Database query optimization
   - API response pagination
   - Compression middleware (gzip)

3. **Infrastructure**
   - Container orchestration (Kubernetes)
   - Auto-scaling based on load
   - Multi-region deployment

---

## Technology Decisions

### Why React?
- Large ecosystem and community
- Component reusability
- Virtual DOM for performance
- Strong TypeScript support

### Why Express.js?
- Minimal and flexible
- Large middleware ecosystem
- Easy to scale
- Industry standard for Node.js

### Why MongoDB?
- Flexible schema for rapid development
- Horizontal scaling support
- JSON-like documents match JavaScript objects
- Rich query language

### Why Docker?
- Consistent environments across dev/staging/production
- Easy deployment and rollback
- Resource isolation
- Microservices ready

---

## Future Architecture Enhancements

1. **GraphQL API** - For flexible data fetching
2. **WebSocket Support** - Real-time features (chat, notifications)
3. **Serverless Functions** - For specific compute-intensive tasks
4. **Machine Learning Integration** - Enhanced solar calculations, predictive analytics
5. **Mobile Apps** - React Native for iOS/Android
6. **IoT Integration** - Smart sensors for environmental monitoring

---

*Last Updated: January 2026*
