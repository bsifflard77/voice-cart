# VoiceCart Backend API

Node.js + Express + PostgreSQL backend for VoiceCart with AI-powered item categorization.

## Features

- **Multi-Store Support**: Manage multiple stores (Walmart, Sam's Club, etc.)
- **Custom Departments**: Each store can have custom departments
- **AI Categorization**: Automatic item categorization using OpenAI
- **Purchase History**: Track when items were added and picked up
- **RESTful API**: Clean, well-documented endpoints

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key

## Setup Instructions

### 1. Install PostgreSQL

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE voicecart;

# Exit psql
\q
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
```

**Required environment variables:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voicecart
DB_USER=postgres
DB_PASSWORD=your_postgres_password
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk-your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

### 5. Setup Database Tables

```bash
npm run db:setup
```

This will:
- Create all tables (stores, departments, items)
- Set up indexes and triggers
- Insert seed data (3 stores with departments)

### 6. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will be running at `http://localhost:5000`

## API Endpoints

### Stores

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | Get all stores |
| GET | `/api/stores/:id` | Get store by ID |
| POST | `/api/stores` | Create new store |
| PUT | `/api/stores/:id` | Update store |
| DELETE | `/api/stores/:id` | Delete store |

**Example: Create Store**
```bash
curl -X POST http://localhost:5000/api/stores \
  -H "Content-Type: application/json" \
  -d '{"name": "Costco"}'
```

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments/store/:storeId` | Get all departments for a store |
| GET | `/api/departments/:id` | Get department by ID |
| POST | `/api/departments` | Create new department |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Delete department |

**Example: Create Department**
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"storeId": 1, "name": "Electronics", "displayOrder": 10}'
```

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items/store/:storeId` | Get active items (grouped by department) |
| GET | `/api/items/store/:storeId/history` | Get purchase history |
| POST | `/api/items` | Create new item (with AI categorization) |
| PUT | `/api/items/:id` | Update item |
| PATCH | `/api/items/:id/pickup` | Mark item as picked up |
| DELETE | `/api/items/:id` | Delete item |

**Example: Create Item with AI Categorization**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"storeId": 1, "name": "Black Forest ham"}'
```

Response includes AI-suggested department:
```json
{
  "id": 1,
  "name": "Black Forest ham",
  "store_id": 1,
  "department_id": 2,
  "department_name": "Deli",
  "ai_suggested_department": "Deli",
  "status": "active",
  "added_at": "2025-10-23T15:30:00.000Z"
}
```

**Example: Mark Item as Picked Up**
```bash
curl -X PATCH http://localhost:5000/api/items/1/pickup
```

### Health Check

```bash
curl http://localhost:5000/health
```

## Database Schema

### Tables

**stores**
- `id` - Primary key
- `name` - Store name (unique)
- `created_at`, `updated_at` - Timestamps

**departments**
- `id` - Primary key
- `store_id` - Foreign key to stores
- `name` - Department name
- `display_order` - Sort order
- `created_at`, `updated_at` - Timestamps

**items**
- `id` - Primary key
- `store_id` - Foreign key to stores
- `department_id` - Foreign key to departments
- `name` - Item name
- `status` - active | picked_up | deleted
- `added_at` - When item was added
- `picked_up_at` - When item was picked up (nullable)
- `notes` - Optional notes
- `created_at`, `updated_at` - Timestamps

## AI Categorization

The OpenAI service automatically categorizes items into departments:

- **Model**: GPT-3.5-turbo
- **Cost**: ~$0.001 per item
- **Fallback**: If AI fails, items go to "Other" department

Examples:
- "Black Forest ham" → Deli
- "Bananas" → Produce
- "Milk" → Dairy & Eggs
- "Frozen pizza" → Frozen

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # PostgreSQL connection
│   ├── controllers/
│   │   ├── storesController.js
│   │   ├── departmentsController.js
│   │   └── itemsController.js
│   ├── routes/
│   │   ├── stores.js
│   │   ├── departments.js
│   │   └── items.js
│   ├── services/
│   │   └── openai.js         # AI categorization
│   ├── db/
│   │   └── setup.js          # Database setup script
│   └── server.js             # Main server file
├── database-schema.sql       # SQL schema
├── package.json
└── .env
```

### Testing with cURL

See `test-api.sh` for example API calls.

## Troubleshooting

**Database connection errors:**
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Verify database exists: `psql -U postgres -l`

**OpenAI errors:**
- Verify API key is valid
- Check OpenAI account has credits
- Items will still be created but go to default department

**Port already in use:**
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

## License

MIT
