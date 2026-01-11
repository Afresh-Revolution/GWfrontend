# GeniusWav Contest Portal

A full-stack application for a video contest portal where users can sign up, login, make payments, and upload videos.

## Project Structure

```
GeniusWav-Contest/
├── backend/          # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/   # Database configuration
│   │   ├── middleware/ # Authentication middleware
│   │   ├── routes/   # API routes (auth, videos, payments)
│   │   └── server.ts # Express server
│   └── schema.sql    # Database schema
│
└── frontend/         # Vite + React + TypeScript frontend
    └── src/
        ├── components/ # React components
        ├── contexts/   # React context (Auth)
        ├── pages/      # Page components
        └── services/   # API service functions
```

## Features

- User authentication (Signup/Login)
- User profile management with unique IDs
- Payment processing (demo implementation)
- Video upload (one video per user, max 500MB)
- Modern, responsive UI with SCSS styling
- Toast notification system for user feedback
- Protected routes and JWT authentication

## Setup Instructions

### Prerequisites

- **PostgreSQL** (version 12 or higher) - [Download PostgreSQL](https://www.postgresql.org/download/)
- Node.js (v18 or higher)
- npm or yarn

> 📘 **Quick Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete setup instructions  
> 📘 **Database Setup**: See [DATABASE_SETUP.md](./backend/DATABASE_SETUP.md) for detailed PostgreSQL setup (local and deployment)  
> 📘 **API Documentation**: See [API_ENDPOINTS.md](./backend/API_ENDPOINTS.md) for complete API reference

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory (use `.env.example` as reference):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-database-password
```

4. Set up the PostgreSQL database:

   **Create the database:**

   ```bash
   # Using the default 'postgres' database
   # Just run the schema on the existing postgres database:
   psql -U postgres
   \q
   ```

   **Run the schema file:**

   ```bash
   psql -U postgres -d postgres -f backend/schema.sql
   ```

   **Note:** The application uses the default `postgres` database. If you prefer to create a separate database, you can do so and update `DB_NAME` in `.env`.

   This will:

   - Enable the `pgcrypto` extension for UUID generation
   - Create `users`, `videos`, and `payments` tables
   - Set up indexes for optimal performance

5. Create the uploads directory:

```bash
mkdir -p src/uploads
```

6. Start the development server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `.env` file if you need to change the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### SCSS Styling

The frontend uses **SCSS (Sass)** exclusively for styling:

- Main styles: `src/index.scss` (global styles and utilities)
- Variables: `src/styles/variables.scss` (colors, spacing, typography, breakpoints)
- Mixins: `src/styles/mixins.scss` (reusable styles, buttons, inputs, responsive breakpoints)
- Component styles: SCSS Modules (`.module.scss` files) for component-scoped styles

SCSS is automatically processed by Vite - no additional configuration needed. The `sass` package is included in devDependencies.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Videos

- `GET /api/videos/status` - Check video upload status (requires auth)
- `POST /api/videos/upload` - Upload video file (requires auth)

### Payments

- `GET /api/payments/status` - Check payment status (requires auth)
- `POST /api/payments/process` - Process payment (requires auth)

## Database Schema (PostgreSQL)

The application uses **PostgreSQL** with the following schema:

### Tables

1. **`users`** - User information with UUID primary keys

   - `id` (UUID, Primary Key) - Auto-generated unique identifier
   - `full_name` (VARCHAR)
   - `email` (VARCHAR, UNIQUE)
   - `password_hash` (VARCHAR) - Bcrypt hashed passwords
   - `created_at`, `updated_at` (TIMESTAMP)

2. **`videos`** - Video uploads (one per user, enforced by UNIQUE constraint)

   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `file_name`, `file_path` (VARCHAR)
   - `file_size` (BIGINT)
   - `mime_type` (VARCHAR)
   - `upload_status` (VARCHAR) - pending, processing, completed, failed
   - **UNIQUE(user_id)** - Ensures one video per user at database level

3. **`payments`** - Payment transaction records
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `amount` (DECIMAL)
   - `currency` (VARCHAR)
   - `payment_status` (VARCHAR)
   - `payment_method`, `transaction_id` (VARCHAR)

### PostgreSQL Features Used

- **UUID** data type for unique identifiers
- **pgcrypto** extension for `gen_random_uuid()` function
- **Foreign keys** with CASCADE delete
- **Indexes** on frequently queried columns (email, user_id)
- **UNIQUE constraints** for data integrity

See `backend/schema.sql` for the complete schema.

## Notes

- The payment system is currently a mock implementation. For production, integrate with a real payment gateway (Stripe, PayPal, etc.).
- Video files are stored in `backend/src/uploads/` directory. For production, consider using cloud storage (AWS S3, Cloudinary, etc.).
- JWT tokens expire after 7 days.
- Maximum video file size is 500MB.

## Technologies Used

### Backend

- **Node.js** + **Express.js** + **TypeScript**
- **PostgreSQL** database (using `pg` library)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Zod** for request validation
- Connection pooling for optimal database performance

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- **SCSS/Sass** for styling (with CSS Modules)
- Axios
