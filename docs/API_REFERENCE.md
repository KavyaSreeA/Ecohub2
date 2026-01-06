# EcoHub Platform - API Reference

Complete API documentation for EcoHub Platform REST APIs.

## Base URL

```
Development: http://localhost:4000/api
Production: https://your-domain.com/api
```

## Table of Contents

- [Authentication](#authentication)
- [Conservation APIs](#conservation-apis)
- [Renewable Energy APIs](#renewable-energy-apis)
- [Transport APIs](#transport-apis)
- [Waste Exchange APIs](#waste-exchange-apis)
- [Dashboard APIs](#dashboard-apis)
- [Error Handling](#error-handling)

---

## Authentication

### Register User

Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### Login User

Authenticate existing user.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Verify Token

Validate JWT token and get user data.

**Endpoint**: `GET /auth/verify`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## Conservation APIs

### Get All Campaigns

Retrieve all conservation campaigns.

**Endpoint**: `GET /conservation/campaigns`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "title": "Save the Amazon Rainforest",
    "description": "Protect 1 million acres of rainforest",
    "goal": 100000,
    "raised": 75000,
    "image": "https://images.unsplash.com/...",
    "category": "forest",
    "status": "active"
  },
  ...
]
```

---

### Get Campaign by ID

Retrieve specific campaign details.

**Endpoint**: `GET /conservation/campaigns/:id`

**URL Parameters**:
- `id` (required): Campaign ID

**Response** (200 OK):
```json
{
  "id": "1",
  "title": "Save the Amazon Rainforest",
  "description": "Protect 1 million acres of rainforest",
  "goal": 100000,
  "raised": 75000,
  "image": "https://images.unsplash.com/...",
  "category": "forest",
  "status": "active"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Campaign not found"
}
```

---

### Get Forum Posts

Retrieve community forum posts.

**Endpoint**: `GET /conservation/forum`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "title": "Tips for reducing plastic usage",
    "message": "Here are my top 10 tips...",
    "author": "EcoWarrior",
    "likes": 45,
    "comments": 12,
    "createdAt": "2024-01-15"
  },
  ...
]
```

---

### Get Events

Retrieve conservation events.

**Endpoint**: `GET /conservation/events`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "title": "Beach Cleanup Day",
    "date": "2024-02-15",
    "location": "Santa Monica Beach",
    "participants": 150,
    "image": "https://images.unsplash.com/..."
  },
  ...
]
```

---

### Get Conservation Stats

Retrieve conservation module statistics.

**Endpoint**: `GET /conservation/stats`

**Response** (200 OK):
```json
{
  "totalCampaigns": 4,
  "totalRaised": 180000,
  "activeEvents": 3,
  "forumPosts": 3
}
```

---

## Renewable Energy APIs

### Get Energy Sources

Retrieve all renewable energy sources.

**Endpoint**: `GET /energy/sources`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "name": "Solar Power",
    "icon": "sun",
    "description": "Harness the power of the sun",
    "capacity": "500 MW",
    "growth": "+15%"
  },
  ...
]
```

---

### Get Energy Projects

Retrieve all energy projects.

**Endpoint**: `GET /energy/projects`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "name": "Desert Sun Solar Farm",
    "type": "solar",
    "location": "Nevada, USA",
    "capacity": "250 MW",
    "status": "operational",
    "completionDate": "2023-06-15"
  },
  ...
]
```

---

### Get Energy Stats

Retrieve energy module statistics.

**Endpoint**: `GET /energy/stats`

**Response** (200 OK):
```json
{
  "totalCapacity": "1,800 MW",
  "co2Saved": "2.5M tons",
  "homesSupplied": "450,000",
  "projectsActive": 24
}
```

---

### Solar Calculator (AI-Powered)

Calculate solar panel requirements and ROI.

**Endpoint**: `POST /energy/solar-calculate`

**Request Body**:
```json
{
  "rooftopArea": 1000,
  "monthlyBill": 150,
  "roofType": "sloped",
  "sunlightExposure": "excellent",
  "location": "California"
}
```

**Parameters**:
- `rooftopArea` (number): Rooftop area in square feet
- `monthlyBill` (number): Average monthly electricity bill in USD
- `roofType` (string): Options: "flat", "sloped", "metal", "tile", "complex"
- `sunlightExposure` (string): Options: "excellent", "good", "moderate", "limited"
- `location` (string): Geographic location

**Response** (200 OK):
```json
{
  "success": true,
  "aiModel": "ecohub-solar-advisor-v1",
  "result": {
    "recommendedPanels": 45,
    "systemSizeKw": 18.5,
    "totalCost": 832500,
    "subsidyAmount": 333000,
    "netCost": 499500,
    "monthlyGeneration": 2590,
    "monthlySavings": 150,
    "annualSavings": 1800,
    "paybackPeriodYears": 27.75,
    "annualCo2Offset": 25483,
    "suitabilityScore": 100
  }
}
```

---

## Transport APIs

### Get Routes

Retrieve sustainable transport routes.

**Endpoint**: `GET /transport/routes`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "name": "Downtown Express",
    "type": "bus",
    "from": "Central Station",
    "to": "Business District",
    "duration": "25 min",
    "co2Saved": "2.5 kg",
    "frequency": "Every 10 min"
  },
  ...
]
```

---

### Get Vehicles

Retrieve electric vehicle fleet.

**Endpoint**: `GET /transport/vehicles`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "type": "Electric Bus",
    "count": 150,
    "co2Reduction": "85%",
    "image": "bus"
  },
  ...
]
```

---

### Get Transport Stats

Retrieve transport module statistics.

**Endpoint**: `GET /transport/stats`

**Response** (200 OK):
```json
{
  "totalRides": "1.2M",
  "co2Saved": "850 tons",
  "activeUsers": "45,000",
  "routesCovered": 120
}
```

---

## Waste Exchange APIs

### Get Waste Listings

Retrieve all waste exchange listings.

**Endpoint**: `GET /waste/listings`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "title": "Recyclable Cardboard Boxes",
    "category": "paper",
    "quantity": "50 kg",
    "location": "Brooklyn, NY",
    "seller": "PackageCo",
    "price": "Free",
    "image": "package",
    "status": "available"
  },
  ...
]
```

---

### Create Waste Listing

Create a new waste exchange listing.

**Endpoint**: `POST /waste/listings`

**Request Body**:
```json
{
  "title": "Scrap Aluminum",
  "category": "metal",
  "quantity": "75 kg",
  "location": "Austin, TX",
  "seller": "MetalCo",
  "price": "$200",
  "image": "wrench"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid-here",
  "title": "Scrap Aluminum",
  "category": "metal",
  "quantity": "75 kg",
  "location": "Austin, TX",
  "seller": "MetalCo",
  "price": "$200",
  "image": "wrench",
  "status": "available"
}
```

---

### Get Waste Categories

Retrieve waste material categories.

**Endpoint**: `GET /waste/categories`

**Response** (200 OK):
```json
[
  {
    "id": "1",
    "name": "Paper & Cardboard",
    "icon": "file-text",
    "count": 156
  },
  ...
]
```

---

### Get Waste Stats

Retrieve waste exchange statistics.

**Endpoint**: `GET /waste/stats`

**Response** (200 OK):
```json
{
  "totalListings": 816,
  "wasteExchanged": "12,500 tons",
  "co2Prevented": "8,200 tons",
  "activeSellers": 342
}
```

---

## Dashboard APIs

### Get Dashboard Stats

Retrieve aggregated statistics for all modules.

**Endpoint**: `GET /dashboard/stats`

**Response** (200 OK):
```json
{
  "conservation": {
    "campaigns": 4,
    "raised": 180000,
    "events": 3
  },
  "energy": {
    "totalCapacity": "1,800 MW",
    "co2Saved": "2.5M tons",
    "homesSupplied": "450,000",
    "projectsActive": 24
  },
  "transport": {
    "totalRides": "1.2M",
    "co2Saved": "850 tons",
    "activeUsers": "45,000",
    "routesCovered": 120
  },
  "waste": {
    "totalListings": 816,
    "wasteExchanged": "12,500 tons",
    "co2Prevented": "8,200 tons",
    "activeSellers": 342
  }
}
```

---

## Health Check

### Get Service Health

Check API server health status.

**Endpoint**: `GET /health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-01-06T12:00:00.000Z",
  "services": {
    "conservation": "active",
    "energy": "active",
    "transport": "active",
    "waste": "active",
    "solarCalculator": "active"
  }
}
```

---

## Error Handling

### Standard Error Response

All API errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

**Current**: No rate limiting (development)

**Production Recommendations**:
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users
- Burst allowance: 20 requests per minute

---

## Authentication Flow

1. **Register/Login**: Receive JWT token
2. **Store Token**: Save in localStorage or secure cookie
3. **Include Token**: Add to Authorization header for protected routes
4. **Refresh**: Tokens expire after 7 days, require re-login

**Authorization Header Format**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Versioning

**Current Version**: v1 (implicit)

**Future Versioning Strategy**:
- URL-based: `/api/v2/resource`
- Header-based: `Accept: application/vnd.ecohub.v2+json`

---

## CORS Configuration

**Allowed Origins** (configurable):
- Development: `http://localhost:5173`, `http://localhost:3000`
- Production: `https://your-domain.com`

**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**: Content-Type, Authorization

---

## Pagination (Future Enhancement)

```
GET /api/resource?page=1&limit=20
```

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20
  }
}
```

---

## Webhook Support (Future)

For real-time updates on:
- Campaign donations
- Event registrations
- Waste listing transactions
- Payment confirmations

---

*Last Updated: January 2026*
