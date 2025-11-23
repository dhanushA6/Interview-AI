# 🎤 Interview - AI-Powered Mock Interview Platform

Interview  is a comprehensive web application that helps job seekers practice interviews using AI-powered technology. The platform provides realistic interview questions, personalized feedback, and performance analytics to help users improve their interview skills.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)

## ✨ Features

### 🔐 Authentication & Security
- User registration and login with JWT authentication
- Email verification system
- Password reset functionality
- Secure password hashing with bcryptjs
- HTTP-only cookies for token storage

### 📄 Resume Management
- Upload PDF and DOCX resume files
- AI-powered resume parsing using Google Gemini
- Resume organization and management
- Download and rename resume files

### 💼 Interview Management
- Create custom interview sessions with job details
- AI-generated interview questions based on resume and job description
- Real-time interview conversations with AI interviewer
- Performance scoring (0-10 scale)
- Detailed feedback and analysis
- Interview history tracking
- Performance analytics and charts

### 🎯 Key Capabilities
- **AI-Powered Questions**: Generate relevant interview questions using Google Gemini AI
- **Personalized Feedback**: Receive detailed analysis of interview performance
- **Resume-Based Interviews**: Link resumes to generate targeted questions
- **Performance Tracking**: Monitor progress over time with visual analytics
- **Real-time Conversations**: Interactive interview experience with AI

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **Vite 7.0.4** - Build tool and dev server
- **Tailwind CSS 4.1.11** - Styling framework
- **Zustand 5.0.6** - State management
- **React Router DOM 7.6.3** - Client-side routing
- **Axios 1.10.0** - HTTP client
- **Framer Motion 12.23.3** - Animations
- **Recharts 3.1.0** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **MongoDB** - Database
- **Mongoose 8.16.3** - ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcryptjs 3.0.2** - Password hashing
- **Multer 2.0.2** - File upload handling
- **Nodemailer 6.10.1** - Email service

### AI & Services
- **Google Generative AI SDK** - Gemini 2.5 Flash model
- **pdf-parse 1.1.1** - PDF text extraction
- **mammoth 1.9.1** - DOCX to text conversion

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))
- **Gmail Account** (for email service) or email service credentials

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dhanushA6/Interview-AI.git
cd speakmate
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/speakmate
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/speakmate

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

**Note**: For Gmail, you'll need to generate an [App-Specific Password](https://support.google.com/accounts/answer/185833).

### 4. Create Required Directories

The application will automatically create the uploads directory, but you can create it manually:

```bash
mkdir -p backend/uploads/resumes
```

## 🎮 Usage

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
# or
nodemon index.js
```

The backend server will run on `http://localhost:3000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

#### Start Production Server

```bash
cd backend
node index.js
```

## 📁 Project Structure

```
speakmate/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── interview.controller.js
│   │   ├── resume.controller.js
│   │   └── gemini.controller.js
│   ├── db/
│   │   └── connectDB.js      # MongoDB connection
│   ├── middleware/
│   │   └── verifyToken.js    # JWT authentication middleware
│   ├── models/               # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── interview.models.js
│   │   └── resume.model.js
│   ├── routes/               # API routes
│   │   ├── auth.route.js
│   │   ├── interview.routes.js
│   │   ├── resume.route.js
│   │   └── gemini.routes.js
│   ├── services/
│   │   └── gemini.js         # Gemini AI service
│   ├── mailtrap/             # Email service
│   │   ├── emails.js
│   │   ├── emailTemplates.js
│   │   └── mailtrap.config.js
│   ├── uploads/
│   │   └── resumes/          # Uploaded resume files
│   ├── utils/
│   │   └── generateTokenAndSetCookie.js
│   └── index.js              # Entry point
│
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── InterviewCard.jsx
│   │   │   ├── ResumeManager.jsx
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InterviewRoom.jsx
│   │   │   └── ...
│   │   ├── store/            # State management
│   │   │   └── authStore.js
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/api/signup` - Register new user
- `POST /auth/api/login` - User login
- `POST /auth/api/logout` - User logout
- `GET /auth/api/check-auth` - Verify authentication
- `POST /auth/api/verify-email` - Verify email with code
- `POST /auth/api/forgot-password` - Request password reset
- `POST /auth/api/reset-password/:token` - Reset password

### Interviews
- `POST /api/interviews` - Create new interview
- `GET /api/interviews` - Get all user interviews
- `GET /api/interviews/:id` - Get interview by ID
- `PATCH /api/interviews/:id/feedback` - Save feedback
- `DELETE /api/interviews/:id` - Delete interview

### Mock Interview (AI)
- `POST /api/mockinterview/:id/start` - Start interview session
- `POST /api/mockinterview/:id/message` - Send message to AI
- `POST /api/mockinterview/:id/finish` - Finish interview and get feedback

### Resumes
- `POST /api/resumes/upload` - Upload resume file
- `GET /api/resumes` - List all user resumes
- `GET /api/resumes/download/:id` - Download resume
- `PATCH /api/resumes/rename/:id` - Rename resume
- `DELETE /api/resumes/:id` - Delete resume

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs (10 rounds)
- CORS configuration for secure cross-origin requests
- Email verification for account security
- Secure password reset with time-limited tokens
- Input validation and sanitization

## 🎨 Features in Detail

### Interview Flow
1. **Create Interview**: User provides job title, description, and experience level
2. **Optional Resume Link**: Link a resume for personalized questions
3. **Start Interview**: AI generates first question based on context
4. **Real-time Conversation**: User responds, AI asks follow-up questions
5. **Finish Interview**: System generates score (0-10) and detailed feedback
6. **View Analytics**: Track performance over time with charts

### Resume Processing
- Supports PDF and DOCX formats
- AI-powered text extraction using Gemini
- Automatic parsing and storage
- Resume-based question generation

