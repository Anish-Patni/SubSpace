# SubSpace 🚀

> **Your intelligent subscription management companion**

SubSpace is a full-stack web application that helps you track, manage, and optimize your subscription services. Built with React, Node.js, and MongoDB, it features AI-powered subscription extraction, automatic renewal reminders, and comprehensive analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)

---

## ✨ Features

### 🎯 Core Functionality
- **📊 Dashboard Overview**: Real-time visualization of all your subscriptions
- **💰 Cost Analytics**: Track total monthly spending and subscription trends
- **📅 Calendar View**: Visualize renewal dates in an intuitive calendar interface
- **🔔 Smart Reminders**: Email notifications for upcoming renewals (1, 3, and 7 days)
- **📈 Analytics Dashboard**: Comprehensive spending insights with interactive charts

### 🔐 Security & Authentication
- JWT-based authentication
- Secure password hashing with bcryptjs
- Protected API routes
- Session management

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Dark/Light mode support
- Smooth animations and transitions
- Command menu (⌘K) for quick navigation
- Toast notifications for user feedback

### 📱 Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Date Handling**: React Day Picker

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Email Service**: Client-side email notifications
- **Scheduling**: Node-cron
- **Validation**: Express Validator

---

## 📁 Project Structure

```
SubSpace/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   ├── CommandMenu.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   └── ...
│   │   ├── services/          # API service layer
│   │   ├── context/           # React context providers
│   │   ├── types/             # TypeScript type definitions
│   │   └── router/            # Route configuration
│   └── package.json
│
└── server/                     # Backend Node.js application
    ├── src/
    │   ├── models/            # Mongoose schemas
    │   │   ├── User.js
    │   │   └── Subscription.js
    │   ├── routes/            # API routes
    │   │   ├── auth.js
    │   │   ├── subscriptions.js
    │   │   └── ai.js
    │   ├── services/          # Business logic
    │   │   ├── aiService.js
    │   │   ├── emailService.js
    │   │   └── notificationScheduler.js
    │   ├── middleware/        # Express middleware
    │   ├── config/            # Configuration files
    │   └── server.js          # Entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/Amrit-Nigam/SubSpace.git
cd SubSpace
```

#### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm run dev      # Development mode with hot reload
# or
npm start        # Production mode
```

#### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Subscription Endpoints

#### Get All Subscriptions
```http
GET /api/subscriptions
Authorization: Bearer <token>
```

#### Create Subscription
```http
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceName": "Netflix",
  "price": 15.99,
  "billingCycle": "monthly",
  "renewalDate": "2025-12-01",
  "category": "Entertainment",
  "paymentMethod": "Credit Card"
}
```

#### Update Subscription
```http
PUT /api/subscriptions/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Subscription
```http
DELETE /api/subscriptions/:id
Authorization: Bearer <token>
```

#### Get Subscription Stats
```http
GET /api/subscriptions/stats
Authorization: Bearer <token>
```

---

## 🎨 Features in Detail

### Smart Notifications
Automatic email reminders sent:
- **7 days** before renewal
- **3 days** before renewal  
- **1 day** before renewal

### Analytics Dashboard
Track your spending with:
- Monthly/yearly cost breakdowns
- Category-wise distribution
- Spending trends over time
- Active vs. paused subscriptions

### Calendar View
Visualize all your renewal dates in an intuitive calendar interface with color-coded indicators.

---

## 🛠️ Development

### Build for Production

#### Frontend
```bash
cd client
npm run build
```

#### Backend
```bash
cd server
npm start
```

### Linting
```bash
cd client
npm run lint
```

---

## 🔧 Configuration

### Environment Variables

#### Server `.env`
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT | Yes |

#### Client `.env`
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | Yes |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | Yes |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | Yes |

---

## 📦 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`:
```bash
cd client
npm run build
vercel deploy
```

### Backend (Render/Railway/Heroku)
1. Set environment variables in your hosting platform
2. Deploy the server directory
3. Ensure MongoDB connection is accessible





## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for charting library
- [Tailwind CSS](https://tailwindcss.com/) for styling


