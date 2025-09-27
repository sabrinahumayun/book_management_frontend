# 📚 Book Management Portal - Frontend

A modern, responsive web application for managing books, user reviews, and administrative tasks. Built with Next.js 15, React 19, and Material-UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book_management_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your API endpoint:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker directly
```bash
# Build the image
docker build -t book-management-frontend .

# Run the container
docker run -p 3000:3000 book-management-frontend
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 🏗️ Project Structure

```
book_management_frontend/
├── app/                    # Next.js 15 App Router
│   ├── admin/             # Admin dashboard pages
│   ├── books/             # Book management pages
│   ├── login/             # Authentication pages
│   └── profile/           # User profile pages
├── components/            # Reusable UI components
│   ├── AddBookModal.tsx   # Book creation modal
│   ├── AdminLayout.tsx    # Admin dashboard layout
│   ├── Layout.tsx         # Main application layout
│   └── ...
├── contexts/              # React contexts
│   └── ThemeContext.tsx   # Dark/Light mode context
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication logic
│   ├── useBooks.ts        # Book management
│   └── useFeedback.ts     # Review management
├── lib/                   # Utility libraries
│   ├── api.ts            # Axios configuration
│   ├── theme.ts          # Material-UI theme
│   └── ...
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```


## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:8000/api` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |


## 🎯 Key Features Explained

### **Smart Review System**
The application intelligently detects if a user has already reviewed a book:
- **First-time reviewers** see "Add Review" button
- **Existing reviewers** see "Update Review" with their current rating/comment
- **Real-time updates** when reviews are added/modified

### **Bulk Operations**
Administrators can perform bulk operations on:
- **Users**: Bulk delete, role changes, status updates
- **Books**: Bulk delete, category updates
- **Reviews**: Bulk delete, moderation actions

### **Dark Mode Implementation**
- **System preference detection** on first visit
- **Persistent user choice** across sessions
- **Smooth transitions** between themes
- **Component-level theming** for consistent UI

### **Real-time Data**
- **Optimistic updates** for better UX
- **Automatic cache invalidation** after mutations
- **Background refetching** for fresh data
- **Error retry mechanisms** for failed requests

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check if backend server is running
   - Verify CORS settings on backend

2. **Authentication Problems**
   - Clear browser cookies and localStorage
   - Check JWT token expiration
   - Verify backend authentication endpoints

3. **Build Issues**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

4. **Docker Issues**
   - Check Docker daemon is running
   - Verify port 3000 is available
   - Check container logs: `docker-compose logs`



## 👥 Stack

- **Frontend Development**: Next.js, React, TypeScript
- **UI/UX Design**: Material-UI, Custom Components
- **State Management**: TanStack Query, React Context
- **Authentication**: JWT, Next.js Middleware
- **Deployment**: Docker, Docker Compose

---
