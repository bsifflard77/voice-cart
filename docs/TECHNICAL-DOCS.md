# VoiceCartz V2 Technical Documentation

**Version:** 2.0
**Last Updated:** October 26, 2025

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Authentication System](#authentication-system)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [PWA Implementation](#pwa-implementation)
7. [Development Setup](#development-setup)
8. [Deployment Guide](#deployment-guide)

---

## Architecture Overview

VoiceCartz follows a modern three-tier architecture:

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  - React 18 + TypeScript            │
│  - Vite Build Tool                  │
│  - TailwindCSS                      │
│  - Service Worker (PWA)             │
└──────────────┬──────────────────────┘
               │ HTTPS/REST API
┌──────────────▼──────────────────────┐
│         Backend (Node.js)           │
│  - Express.js Server                │
│  - JWT Authentication               │
│  - RESTful API                      │
│  - OpenAI Integration               │
└──────────────┬──────────────────────┘
               │ PostgreSQL Protocol
┌──────────────▼──────────────────────┐
│       Database (PostgreSQL)         │
│  - User Accounts                    │
│  - Shopping Lists                   │
│  - Items & Departments              │
└─────────────────────────────────────┘
```

### Key Design Principles

1. **Stateless Backend** - JWT tokens for authentication
2. **Offline-First Frontend** - Service worker caching
3. **API-Driven** - Clean separation of concerns
4. **Progressive Enhancement** - Works without JavaScript (basic features)
5. **Mobile-First** - Responsive design, touch-friendly

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 5.x | Build Tool |
| TailwindCSS | 3.x | Styling |
| Axios | 1.x | HTTP Client |
| Web Speech API | Native | Voice Input |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22.x | Runtime |
| Express.js | 4.x | Web Framework |
| PostgreSQL | 18.x | Database |
| JWT | 9.x | Authentication |
| bcrypt | 5.x | Password Hashing |
| OpenAI | 4.x | AI Categorization |

### Development Tools

- **nodemon** - Auto-restart server
- **sharp** - Image processing
- **dotenv** - Environment variables

---

## Authentication System

### Overview

VoiceCartz V2 uses JWT (JSON Web Tokens) for stateless authentication.

### Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token in localStorage
   ↓
5. Client sends token in Authorization header
   ↓
6. Server validates token on each request
```

### Token Structure

```javascript
{
  userId: number,      // User's database ID
  email: string,       // User's email
  iat: timestamp,      // Issued at
  exp: timestamp       // Expires (7 days)
}
```

### Password Security

- **Hashing Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Minimum Length:** 6 characters
- **Storage:** Only hashed password stored in DB

### Session Management

- **Token Expiration:** 7 days
- **Storage:** localStorage
- **Refresh:** Manual re-login required
- **Logout:** Token removed from localStorage

---

## API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-10-26T12:00:00.000Z"
  }
}
```

#### POST /auth/login

Login to existing account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### GET /auth/me

Get current user profile (requires auth).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-10-26T12:00:00.000Z",
  "lastLogin": "2025-10-26T13:00:00.000Z"
}
```

#### PUT /auth/profile

Update user profile (requires auth).

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

### Shopping Lists Endpoints

#### GET /shopping-lists

Get all user's shopping lists (requires auth).

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "store_id": 1,
    "name": "Weekly Groceries",
    "status": "active",
    "created_at": "2025-10-26T12:00:00.000Z",
    "updated_at": "2025-10-26T12:00:00.000Z",
    "store_name": "Walmart",
    "active_items_count": 5,
    "picked_up_items_count": 2
  }
]
```

#### POST /shopping-lists

Create a new shopping list (requires auth).

**Request:**
```json
{
  "storeId": 1,
  "name": "Party Supplies"
}
```

**Response (201):**
```json
{
  "id": 2,
  "user_id": 1,
  "store_id": 1,
  "name": "Party Supplies",
  "status": "active",
  "created_at": "2025-10-26T13:00:00.000Z"
}
```

#### GET /shopping-lists/:id

Get single shopping list (requires auth).

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "store_id": 1,
  "name": "Weekly Groceries",
  "status": "active",
  "store_name": "Walmart"
}
```

#### PUT /shopping-lists/:id

Update shopping list (requires auth).

**Request:**
```json
{
  "name": "Monthly Groceries",
  "storeId": 2
}
```

#### DELETE /shopping-lists/:id

Delete shopping list (requires auth).

**Response (200):**
```json
{
  "message": "Shopping list deleted successfully"
}
```

#### POST /shopping-lists/:id/complete

Mark list as completed (requires auth).

**Response (200):**
```json
{
  "message": "Shopping list completed",
  "list": { ... }
}
```

#### GET /shopping-lists/:listId/items

Get all items in a list (requires auth).

**Response (200):**
```json
{
  "items_by_department": {
    "Produce": [
      {
        "id": 1,
        "shopping_list_id": 1,
        "name": "Bananas",
        "status": "active",
        "department_name": "Produce"
      }
    ],
    "Dairy": [ ... ]
  },
  "total_items": 10
}
```

#### POST /shopping-lists/:listId/items

Add item to list (requires auth).

**Request:**
```json
{
  "name": "Milk",
  "notes": "2 gallons"
}
```

**Response (201):**
```json
{
  "id": 5,
  "shopping_list_id": 1,
  "name": "Milk",
  "status": "active",
  "department_id": 2,
  "department_name": "Dairy"
}
```

### Items V2 Endpoints

#### PUT /v2/items/:id

Update item (requires auth).

**Request:**
```json
{
  "name": "Whole Milk",
  "notes": "Organic"
}
```

#### POST /v2/items/:id/pickup

Mark item as picked up (requires auth).

**Response (200):**
```json
{
  "id": 5,
  "status": "picked_up",
  "picked_up_at": "2025-10-26T14:00:00.000Z"
}
```

#### DELETE /v2/items/:id

Delete item (requires auth).

**Response (200):**
```json
{
  "message": "Item deleted successfully"
}
```

### Stores & Departments

#### GET /stores

Get all stores.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Walmart",
    "created_at": "2025-10-20T00:00:00.000Z"
  }
]
```

#### GET /departments/store/:storeId

Get departments for a store.

**Response (200):**
```json
[
  {
    "id": 1,
    "store_id": 1,
    "name": "Produce",
    "display_order": 1
  }
]
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### Shopping Lists Table

```sql
CREATE TABLE shopping_lists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Items Table (V2)

```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  shopping_list_id INTEGER REFERENCES shopping_lists(id) ON DELETE CASCADE,
  department_id INTEGER REFERENCES departments(id),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  notes TEXT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stores Table

```sql
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Departments Table

```sql
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## PWA Implementation

### Manifest Configuration

**File:** `/public/manifest.json`

```json
{
  "name": "VoiceCartz - Voice Shopping List",
  "short_name": "VoiceCartz",
  "display": "standalone",
  "background_color": "#f0f9ff",
  "theme_color": "#0ea5e9",
  "icons": [ /* 8 sizes */ ]
}
```

### Service Worker

**File:** `/public/service-worker.js`

**Caching Strategy:**
1. **Install:** Cache essential app files
2. **Fetch:** Cache-first for static assets, network-first for API
3. **Activate:** Clean up old caches

**Features:**
- Offline page rendering
- Background sync (placeholder)
- Push notifications (placeholder)
- Automatic cache updates

### Registration

**File:** `/src/utils/registerServiceWorker.ts`

```typescript
navigator.serviceWorker.register('/service-worker.js')
  .then(registration => {
    // Check for updates
    // Notify user when new version available
  })
```

### Platform Support

**iOS Safari:**
- apple-touch-icon meta tags
- status bar styling
- viewport-fit for notched devices

**Android Chrome:**
- mobile-web-app-capable
- theme-color
- manifest.json

**Windows:**
- browserconfig.xml
- tile icons
- tile colors

---

## Development Setup

### Prerequisites

- Node.js 22.x or higher
- PostgreSQL 18.x or higher
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/voicecartz.git
cd voicecartz

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Configuration

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=voicecartz

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000

OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=your-secret-key-change-in-production
```

**Frontend (.env.development):**
```env
VITE_API_URL=http://localhost:5000
```

### Database Setup

```bash
# Create database
createdb voicecartz

# Run schema
psql -d voicecartz -f backend/database-schema-v2.sql

# Insert sample data
psql -d voicecartz -f backend/seed-data.sql
```

### Running Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Deployment Guide

### Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure production database
- [ ] Set up environment variables on hosting platform
- [ ] Test service worker in production
- [ ] Verify PWA manifest and icons
- [ ] Test on actual mobile devices

### Build Commands

**Frontend:**
```bash
cd frontend
npm run build
# Output: dist/ folder
```

**Backend:**
```bash
cd backend
# No build needed - runs directly with Node.js
```

### Environment Variables (Production)

**Backend:**
```env
DB_HOST=production-db-host
DB_PORT=5432
DB_USER=production_user
DB_PASSWORD=strong_password
DB_NAME=voicecartz_prod

PORT=5000
NODE_ENV=production

FRONTEND_URL=https://voicecartz.com

OPENAI_API_KEY=sk-prod-key
JWT_SECRET=strong-random-secret-min-32-chars
```

**Frontend:**
```env
VITE_API_URL=https://api.voicecartz.com
```

---

## Performance Optimization

### Frontend

1. **Code Splitting** - Lazy load routes
2. **Image Optimization** - Use WebP format
3. **Service Worker** - Cache static assets
4. **Minification** - Vite handles automatically
5. **Tree Shaking** - Remove unused code

### Backend

1. **Database Indexing** - Index frequently queried columns
2. **Connection Pooling** - pg connection pool
3. **Caching** - Redis for session data (future)
4. **Rate Limiting** - Prevent abuse
5. **Compression** - gzip responses

### Database

```sql
-- Add indexes for common queries
CREATE INDEX idx_items_shopping_list ON items(shopping_list_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id);
CREATE INDEX idx_users_email ON users(email);
```

---

## Security Best Practices

### Authentication

- ✅ Password hashing with bcrypt
- ✅ JWT token expiration
- ✅ HTTPS in production
- ✅ Secure cookie flags
- ❌ Rate limiting (todo)
- ❌ Two-factor auth (future)

### API Security

- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (React escaping)
- ❌ Rate limiting (todo)
- ❌ API throttling (future)

### Data Protection

- ✅ User data isolation (shopping lists)
- ✅ Soft deletes where appropriate
- ✅ Encrypted passwords
- ❌ Database encryption at rest (platform dependent)

---

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token persistence across page reloads
- [ ] Logout functionality

**Shopping Lists:**
- [ ] Create new list
- [ ] View all lists
- [ ] Select a list
- [ ] Complete a list
- [ ] Delete a list

**Items:**
- [ ] Add item via voice
- [ ] Add item via manual input
- [ ] Mark item as picked up
- [ ] Delete item
- [ ] View items by department

**PWA:**
- [ ] Install on iOS
- [ ] Install on Android
- [ ] Offline functionality
- [ ] Icon appearance
- [ ] Update notifications

### Future: Automated Testing

```bash
# Unit tests (todo)
npm test

# Integration tests (todo)
npm run test:integration

# E2E tests (todo)
npm run test:e2e
```

---

## Monitoring & Logging

### Development

```javascript
// Frontend
console.log('Action:', action)

// Backend
console.log('Request:', req.method, req.url)
console.error('Error:', error)
```

### Production (Recommended)

- **Frontend:** Sentry, LogRocket
- **Backend:** Winston, Morgan
- **Database:** PostgreSQL logs
- **Uptime:** UptimeRobot, Pingdom

---

## API Rate Limits (Future)

Recommended limits for production:

- **Registration:** 5 per hour per IP
- **Login:** 10 per hour per IP
- **API Calls:** 100 per minute per user
- **Voice Input:** 50 per minute per user

---

## Troubleshooting

### Common Development Issues

**Backend won't start:**
- Check PostgreSQL is running
- Verify .env file exists
- Check database credentials
- Ensure port 5000 is available

**Frontend won't connect:**
- Check VITE_API_URL in .env
- Verify backend is running
- Check CORS configuration
- Clear browser cache

**Service Worker issues:**
- Unregister old service workers
- Clear browser cache
- Check service-worker.js is accessible
- Verify manifest.json is valid

---

## Contributing

### Code Style

- **TypeScript:** Strict mode
- **React:** Functional components, hooks
- **Naming:** camelCase for variables, PascalCase for components
- **Imports:** Absolute paths preferred

### Git Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with descriptive message
5. Push and create pull request

---

**For deployment options, see [HOSTING-OPTIONS.md](./HOSTING-OPTIONS.md)**
