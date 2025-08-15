# CodeLogs Blog

A full-stack blog application built with modern web technologies, featuring a React frontend, Cloudflare Workers backend, and PostgreSQL database.

## 🚀 Features

- **User Authentication** - Sign up and sign in functionality with JWT tokens
- **Blog Management** - Create, read, update, and delete blog posts
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Type Safety** - Full TypeScript support across the stack
- **Serverless Backend** - Deployed on Cloudflare Workers for global edge performance
- **Modern UI** - Clean, professional interface with custom components

## 🏗️ Architecture

This is a monorepo containing three main packages:

### Frontend (`/frontend`)
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **React Router** for client-side routing
- **Axios** for API communication

### Backend (`/backend`)
- **Hono** - Fast web framework for Cloudflare Workers
- **Prisma** - Type-safe database ORM with Accelerate
- **PostgreSQL** - Production database
- **JWT Authentication** - Secure user sessions
- **Cloudflare Workers** - Serverless deployment

### Common (`/common`)
- **Zod** - Runtime type validation
- **Shared Types** - TypeScript interfaces for API contracts
- **NPM Package** - Published as `@mrunal121/codelogs-blog-common`

## 📦 Tech Stack

### Frontend
- React 19.1.1
- TypeScript
- Vite 7.1.2
- Tailwind CSS 4.1.12
- React Router DOM 7.8.0
- Axios 1.11.0

### Backend
- Hono 4.7.10
- Prisma 6.8.2
- Cloudflare Workers
- PostgreSQL (via Prisma Accelerate)
- JWT Authentication

### Development Tools
- ESLint
- PostCSS
- Wrangler (Cloudflare CLI)
- TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mrunal112/devlogs-blog.git
   cd codelogs-blogs
   ```

2. **Install dependencies for all packages**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install

   # Install common package dependencies
   cd ../common
   npm install
   ```

### Development Setup

1. **Set up the database**
   ```bash
   cd backend
   # Set up your DATABASE_URL in wrangler.jsonc
   npx prisma migrate dev
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # Backend will run on Cloudflare Workers local development
   ```

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

4. **Build the common package** (if making changes)
   ```bash
   cd common
   npm run build
   ```

## 📁 Project Structure

```
codelogs-blogs/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Auth.tsx     # Authentication form
│   │   │   └── Quote.tsx    # Inspirational quotes
│   │   ├── pages/           # Page components
│   │   │   ├── Signin.tsx   # Sign in page
│   │   │   ├── Signup.tsx   # Sign up page
│   │   │   └── Blog.tsx     # Blog page
│   │   ├── config.ts        # Frontend configuration
│   │   └── main.tsx         # Application entry point
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── vite.config.ts       # Vite configuration
├── backend/                 # Cloudflare Workers backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   │   ├── user.ts      # User authentication routes
│   │   │   └── blog.ts      # Blog CRUD routes
│   │   ├── auth/            # Authentication utilities
│   │   │   └── jwt.ts       # JWT token handling
│   │   └── index.ts         # Main server entry point
│   ├── prisma/              # Database schema and migrations
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migration files
│   └── wrangler.jsonc       # Cloudflare Workers configuration
├── common/                  # Shared types and utilities
│   └── src/
│       └── index.ts         # Exported types and schemas
└── README.md
```

## 🔧 Configuration

### Backend Configuration
Update `backend/wrangler.jsonc` with your:
- Database URL (Prisma Accelerate)
- Environment variables
- Cloudflare Workers settings

### Frontend Configuration
Update `frontend/src/config.ts` with your:
- Backend API URL
- Environment-specific settings

## 📝 API Endpoints

### Authentication
- `POST /user/signup` - Create new user account
- `POST /user/signin` - User login

### Blog Posts
- `GET /blog` - Get all blog posts
- `POST /blog` - Create new blog post (authenticated)
- `PUT /blog/:id` - Update blog post (authenticated)
- `DELETE /blog/:id` - Delete blog post (authenticated)

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run deploy
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your preferred hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mrunal** - [@Mrunal112](https://github.com/Mrunal112)

## 🙏 Acknowledgments

- Inspired by modern blogging platforms
- Uses cutting-edge web technologies for optimal performance

---

**Happy Coding! 🚀**
