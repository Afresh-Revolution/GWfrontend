# Verify Connection & Test Endpoints

## ✅ Connection Status

**Database Connection Test Results:**
- ✅ **Connected to PostgreSQL successfully!**
- Database: `postgres`
- Host: `localhost`
- Port: `5432`
- User: `postgres`

---

## Step 1: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server is running on port 5000
Connected to PostgreSQL database
PostgreSQL connection test successful: [timestamp]
```

---

## Step 2: Test Health Endpoint (First Test)

In Thunder Client, create a new request:

**Method:** `GET`  
**URL:** `http://localhost:5000/api/health`  
**Headers:** None required

**Click Send**

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2026-01-10T23:37:43.743Z"
}
```

✅ If you see `"database": "connected"`, everything is working!

---

## Step 3: Test Complete Flow

### 1️⃣ Signup (Create User)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/signup`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "full_name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Test User",
    "email": "test@example.com"
  }
}
```

⚠️ **IMPORTANT:** Copy the `token` value! You'll need it for protected endpoints.

---

### 2️⃣ Check Payment Status (Protected)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/payments/status`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token from signup.

**Expected Response (200):**
```json
{
  "hasPayment": false,
  "payment": null
}
```

✅ If you get this response, authentication is working!

---

### 3️⃣ Process Payment (Protected)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/payments/process`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "amount": 10.0,
  "currency": "USD",
  "payment_method": "card"
}
```

**Expected Response (201):**
```json
{
  "message": "Payment processed successfully",
  "payment": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "amount": "10.00",
    "currency": "USD",
    "payment_status": "completed",
    "transaction_id": "txn_1705321800000_abc123",
    "created_at": "2026-01-10T23:40:00.000Z"
  }
}
```

✅ Payment is stored in database!

---

### 4️⃣ Check Video Status (Protected)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/videos/status`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "hasVideo": false,
  "video": null
}
```

---

### 5️⃣ Upload Video (Protected)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/videos/upload`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

⚠️ **Do NOT set Content-Type header manually!**

**Body:**
1. Click on **Body** tab
2. Select **Multipart Form** or **Form Data**
3. Add field:
   - **Key:** `video`
   - **Type:** File
   - **Value:** Select a video file (max 500MB)

**Expected Response (201):**
```json
{
  "message": "Video uploaded successfully"
}
```

✅ Video is uploaded and stored!

---

### 6️⃣ Check Video Status Again (Protected)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/videos/status`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "hasVideo": true,
  "video": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "file_name": "my-video.mp4",
    "upload_status": "pending",
    "created_at": "2026-01-10T23:45:00.000Z"
  }
}
```

✅ Video is stored!

---

## Step 4: Verify Data in Database

After testing endpoints, verify data is stored in the database:

### Option 1: Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to PostgreSQL server
3. Navigate to `Databases` → `postgres` → `Schemas` → `public` → `Tables`
4. Right-click on `users` → `View/Edit Data` → `All Rows`
5. Repeat for `payments` and `videos` tables

### Option 2: Using SQL Query Tool
1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click on `postgres` database → `Query Tool`
4. Run queries:
```sql
-- Check users
SELECT id, full_name, email, created_at FROM users;

-- Check payments
SELECT id, user_id, amount, currency, payment_status, created_at FROM payments;

-- Check videos
SELECT id, user_id, file_name, file_size, upload_status, created_at FROM videos;
```

---

## Testing Checklist

Use this checklist to verify everything:

- [ ] Backend server is running
- [ ] Health endpoint returns `"database": "connected"`
- [ ] Can signup a new user
- [ ] Token is received from signup/login
- [ ] Protected endpoints work with token
- [ ] Payment is processed successfully
- [ ] Video is uploaded successfully
- [ ] Data appears in database tables
- [ ] Video file exists in `backend/uploads/` directory

---

## Common Issues

### Issue: "401 Unauthorized" on Protected Endpoints

**Solution:**
- Verify token is in Authorization header
- Format must be: `Bearer YOUR_TOKEN_HERE` (with space after "Bearer")
- Token should be copied from signup/login response
- Token should not be expired (valid for 7 days)

### Issue: "Database connection failed"

**Solution:**
- Check PostgreSQL service is running
- Verify `.env` file has correct credentials
- Check database name is `postgres` (not `GWContest`)
- Test connection: `node backend/test-connection.js`

### Issue: "No tables found"

**Solution:**
- If tables are created, they should work
- The connection test script might have an issue
- Verify tables exist using pgAdmin
- If tables don't exist, run: `psql -U postgres -d postgres -f backend/schema.sql`

---

## Success Indicators

✅ **Connection Working:**
- Health endpoint returns `"database": "connected"`
- No errors in backend console
- Database connection successful

✅ **Endpoints Working:**
- Signup/login returns token
- Protected endpoints accept token
- Data is stored in database
- Video files are saved to disk

✅ **Database Working:**
- Data appears in tables (users, payments, videos)
- Foreign keys are working (user_id links correctly)
- All endpoints store data correctly

---

## Quick Test Sequence

1. ✅ Start backend: `cd backend && npm run dev`
2. ✅ Test health: `GET /api/health`
3. ✅ Signup: `POST /api/auth/signup` (copy token)
4. ✅ Check payment: `GET /api/payments/status` (use token)
5. ✅ Process payment: `POST /api/payments/process` (use token)
6. ✅ Check video: `GET /api/videos/status` (use token)
7. ✅ Upload video: `POST /api/videos/upload` (use token, select file)
8. ✅ Verify data in database

---

## Next Steps

After verifying everything works:

1. ✅ All endpoints tested successfully
2. ✅ Data is stored in database
3. ✅ Video files are saved correctly
4. ✅ Ready to use the application!

For detailed endpoint documentation, see:
- `THUNDER_CLIENT_TESTING.md` - Complete Thunder Client guide
- `backend/API_ENDPOINTS.md` - Full API documentation
