# VoiceCart V2 - User Authentication & Shopping Lists Upgrade

## Overview

This document describes the upgrade from V1 (single shared shopping list) to V2 (multi-user with named shopping lists).

## What's New in V2

### 1. User Authentication
- **Registration**: Users can create accounts with email/password
- **Login**: JWT-based authentication (tokens valid for 7 days)
- **Profile Management**: Update first/last name
- **Secure Passwords**: Bcrypt hashing with salt

### 2. Shopping Lists
- **Named Lists**: Users can create multiple lists ("Weekly Groceries", "Party", etc.)
- **Store Assignment**: Each list belongs to a specific store
- **Status Tracking**: Lists can be active, completed, or archived
- **Timestamps**: Track when lists are created and completed
- **Item Counts**: See how many items are active vs. picked up

### 3. Items System Update
- **List Ownership**: Items now belong to shopping lists, not stores directly
- **User Isolation**: Each user only sees their own items
- **Purchase Tracking**: Timestamps for when items are picked up
- **Same AI Categorization**: OpenAI still auto-categorizes items by department

## Database Changes

### New Tables

**users**
- `id` - Primary key
- `email` - Unique, login identifier
- `password_hash` - Bcrypt hashed password
- `first_name`, `last_name` - Optional profile info
- `created_at`, `updated_at`, `last_login` - Timestamps

**shopping_lists**
- `id` - Primary key
- `user_id` - Foreign key to users
- `store_id` - Foreign key to stores
- `name` - Custom list name
- `status` - active, completed, or archived
- `created_at`, `completed_at` - Timestamps
- `notes` - Optional notes

### Modified Tables

**items** (changed from V1)
- Removed: `store_id` (items no longer directly linked to stores)
- Added: `shopping_list_id` - Foreign key to shopping_lists
- Keeps: `department_id`, `name`, `status`, `picked_up_at`, etc.

### Preserved Tables (No Changes)
- `stores` - Walmart, Sam's Club, Market Basket
- `departments` - Store-specific departments

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new user account | No |
| POST | `/login` | Login and get JWT token | No |
| GET | `/me` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Register/Login Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Shopping Lists (`/api/shopping-lists`)

All endpoints require authentication (Bearer token in Authorization header).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all user's shopping lists |
| GET | `/:id` | Get single shopping list |
| POST | `/` | Create new shopping list |
| PUT | `/:id` | Update shopping list |
| DELETE | `/:id` | Delete shopping list |
| POST | `/:id/complete` | Mark list as completed |
| GET | `/:listId/items` | Get all items in list |
| POST | `/:listId/items` | Add item to list |

**Create Shopping List Request:**
```json
{
  "storeId": 1,
  "name": "Weekly Groceries",
  "notes": "Don't forget the milk!"
}
```

**Shopping List Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "store_id": 1,
  "name": "Weekly Groceries",
  "status": "active",
  "created_at": "2025-10-25T10:00:00Z",
  "store_name": "Walmart",
  "active_item_count": 5,
  "picked_up_count": 2
}
```

### Items (`/api/items`)

All endpoints require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/:id` | Update item |
| POST | `/:id/pickup` | Mark item as picked up |
| DELETE | `/:id` | Delete item (soft delete) |

## Migration from V1 to V2

### Step 1: Run Migration Script

```bash
cd backend
node src/db/migration-to-v2.js
```

This will:
1. Create `users` table
2. Create `shopping_lists` table
3. Rename `items` to `items_old`
4. Create new `items` table with `shopping_list_id`
5. Create triggers for timestamps

### Step 2: Update Environment Variables

Add to `.env`:
```
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Step 3: Restart Backend Server

Old items will be preserved in `items_old` table. You can manually migrate them or start fresh.

## Authentication Flow

### For Frontend

1. **User Registration**
   ```javascript
   const response = await fetch('/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'user@example.com',
       password: 'password123',
       firstName: 'John',
       lastName: 'Doe'
     })
   })
   const { token, user } = await response.json()
   localStorage.setItem('token', token)
   ```

2. **User Login**
   ```javascript
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'user@example.com',
       password: 'password123'
     })
   })
   const { token, user } = await response.json()
   localStorage.setItem('token', token)
   ```

3. **Making Authenticated Requests**
   ```javascript
   const token = localStorage.getItem('token')
   const response = await fetch('/api/shopping-lists', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```

## Default Behavior

When a new user registers:
1. Account is created
2. A default shopping list named "My Shopping List" is automatically created for Walmart
3. User receives JWT token for immediate login

## Security Features

1. **Password Hashing**: Bcrypt with salt (10 rounds)
2. **JWT Tokens**: Signed with secret, 7-day expiration
3. **User Isolation**: Users can only access their own data
4. **SQL Injection Protection**: Parameterized queries
5. **Input Validation**: express-validator on all inputs

## Backward Compatibility

The old V1 endpoints (`/api/stores`, `/api/departments`, `/api/items`) are still available for now but should be migrated to V2.

**Migration Path:**
1. Update frontend to use authentication
2. Update frontend to use shopping lists
3. Migrate old data if needed
4. Remove V1 item endpoints

## Testing the New Features

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Get Shopping Lists
```bash
curl http://localhost:5000/api/shopping-lists \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create New Shopping List
```bash
curl -X POST http://localhost:5000/api/shopping-lists \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": 1,
    "name": "Weekly Groceries"
  }'
```

### 5. Add Item to List
```bash
curl -X POST http://localhost:5000/api/shopping-lists/1/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "bananas"
  }'
```

## Next Steps for Frontend

1. Create Login/Register components
2. Add token management (localStorage)
3. Create Shopping Lists management UI
4. Update App.tsx to handle authentication
5. Update item management to use shopping lists
6. Add "Create New List" button
7. Show list name and store in header

## Files Created

### Backend
- `src/controllers/authController.js` - User auth logic
- `src/controllers/shoppingListsController.js` - Shopping list CRUD
- `src/controllers/itemsControllerV2.js` - Updated items for lists
- `src/middleware/auth.js` - JWT verification
- `src/routes/auth.js` - Auth endpoints
- `src/routes/shoppingLists.js` - Shopping list endpoints
- `src/routes/itemsV2.js` - Updated item endpoints
- `src/db/migration-to-v2.js` - Database migration script
- `database-schema-v2.sql` - New schema

### Docs
- `docs/v2-authentication-upgrade.md` - This file

## Package Dependencies Added

- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation/verification
- `express-validator` - Input validation
- `cookie-parser` - Cookie parsing (for future use)

## Important Notes

1. **JWT_SECRET**: MUST be set in production to a strong random string
2. **Token Expiration**: Currently set to 7 days, adjust as needed
3. **HTTPS**: In production, always use HTTPS for auth endpoints
4. **Refresh Tokens**: Consider adding refresh token flow for better security
5. **Email Verification**: Consider adding email verification for production
6. **Password Reset**: Should add password reset flow for production

## Summary

VoiceCart V2 transforms the app from a single shared shopping list into a full multi-user application where:
- Each person has their own account
- Users can create multiple named shopping lists
- Lists track creation/completion dates
- Items are properly isolated per user
- Same great voice input and AI categorization!

Ready for you, your wife, and future customers! 🎉
