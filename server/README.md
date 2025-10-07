# SubSpace Backend

Authentication service with email/password using MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file with your MongoDB URI and JWT secret

3. Start MongoDB (if running locally)

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/login
Login with existing credentials
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET /api/auth/me
Get current user (requires Bearer token in Authorization header)
