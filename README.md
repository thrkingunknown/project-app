# FAXRN Forum Platform

A simple MERN stack forum application with email verification, built following studentapp coding style.

## Features

### 🔐 Authentication & Security
- User registration with email verification
- JWT-based authentication
- Password hashing with bcrypt
- Email verification using nodemailer
- Resend verification email functionality

### 📝 Forum Features
- Create, read, update, delete posts
- Comment system with nested replies
- User profiles with post history
- Admin dashboard for user and post management
- Role-based access control (user/admin)

### 🎨 Frontend
- React with Vite for fast development
- Material-UI components for modern design
- Responsive layout
- Real-time updates
- FAXRN branding throughout

### 🔧 Backend
- Express.js server
- MongoDB with Mongoose ODM
- Environment variable configuration
- Simple error handling (studentapp style)
- RESTful API endpoints

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Gmail account for email verification (optional)

### 1. Clone and Install Dependencies

```bash
# Backend
cd project-app/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

Update `project-app/backend/.env` with your actual values:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for email verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=FAXRN <your_email@gmail.com>

# Platform Configuration
PLATFORM_NAME=FAXRN
PLATFORM_DESCRIPTION=FAXRN Forum Platform

# Security
BCRYPT_ROUNDS=10
```

### 3. Gmail App Password Setup (for email verification)

1. Enable 2-factor authentication in your Gmail account
2. Go to Google Account settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this app password in the `EMAIL_PASSWORD` field

### 4. Start the Application

```bash
# Start backend (from project-app/backend)
npm run dev

# Start frontend (from project-app/frontend)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Endpoints

### Authentication
- `POST /register` - Register new user with email verification
- `POST /login` - Login user (requires verified email)
- `GET /verify-email?token=xxx` - Verify email address
- `POST /resend-verification` - Resend verification email

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create new post (authenticated)
- `GET /posts/:id` - Get single post
- `PUT /posts/:id` - Update post (owner/admin only)
- `DELETE /posts/:id` - Delete post (owner/admin only)

### Comments
- `POST /posts/:id/comments` - Add comment to post
- `DELETE /comments/:id` - Delete comment (owner/admin only)

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user profile
- `DELETE /users/:id` - Delete user (admin only)

## Email Verification Flow

1. User registers with email and password
2. System generates verification token and sends email
3. User clicks verification link in email
4. Email is verified, user can now login
5. If verification email is lost, user can request resend

## Coding Style (StudentApp Pattern)

This project follows the studentapp coding conventions:
- Uses `var` declarations consistently
- Simple variable names (data, user, post, etc.)
- Extensive console.log for debugging
- Basic try-catch error handling
- Inline styles with Material-UI
- Human-like, beginner-friendly code structure

## Project Structure

```
project-app/
├── backend/
│   ├── models/
│   │   ├── user.js
│   │   ├── post.js
│   │   └── comment.js
│   ├── .env
│   ├── index.js
│   ├── db.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── PostView.jsx
    │   │   ├── Profile.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── EmailVerification.jsx
    │   │   └── ResendVerification.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Default Admin User

To create an admin user, register normally and then update the user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Troubleshooting

### Email Verification Not Working
- Check Gmail app password is correct
- Ensure 2-factor authentication is enabled
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Check spam folder for verification emails

### Database Connection Issues
- Verify MongoDB URI in .env file
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Frontend/Backend Connection Issues
- Verify FRONTEND_URL in backend .env
- Check CORS configuration
- Ensure both servers are running on correct ports

## Contributing

This project follows studentapp coding style for educational purposes. When contributing:
- Use `var` instead of `let`/`const`
- Keep variable names simple
- Add console.log statements for debugging
- Use basic error handling patterns
- Maintain beginner-friendly code structure

## License

This project is for educational purposes and follows the studentapp development pattern.
