# Book Management Portal - Frontend

A modern, responsive frontend application for a book management system with comprehensive authentication features, role-based access control, and beautiful UI design.

## Features

### Authentication System
- **Login Page**: Modern login form with email/password validation
- **Signup Page**: User registration with role selection (admin/user)
- **JWT Token Management**: Secure token storage and automatic refresh
- **Route Protection**: Middleware and component-level route protection
- **Role-Based Access**: Different dashboards and permissions for admin vs user roles

### User Interface
- **Modern Design**: Clean, aesthetic UI built with Tailwind CSS
- **Responsive Layout**: Mobile-first design that works on all devices
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Smooth loading indicators and user feedback
- **Navigation**: Intuitive navigation with role-based menu items

### Pages & Components
- **Landing Page**: Beautiful homepage with feature showcase
- **User Dashboard**: Personal dashboard for regular users
- **Admin Dashboard**: Comprehensive admin panel with system stats
- **Profile Page**: User profile management with edit capabilities
- **Protected Routes**: Secure access to authenticated pages

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom components with Tailwind

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 3001

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Start the development server**:
```bash
npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Project Structure

```
book_management_frontEnd/
├── app/                          # Next.js App Router pages
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── dashboard/               # User dashboard
│   ├── admin/                   # Admin pages
│   │   └── dashboard/           # Admin dashboard
│   ├── profile/                 # User profile page
│   ├── layout.tsx               # Root layout with auth provider
│   └── page.tsx                 # Landing page
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   │   ├── Button.tsx           # Custom button component
│   │   └── Input.tsx            # Custom input component
│   ├── Navigation.tsx           # Main navigation component
│   └── ProtectedRoute.tsx       # Route protection component
├── hooks/                        # Custom React hooks
│   └── useAuth.ts               # Authentication hook with TanStack Query
├── lib/                         # Utility functions
│   ├── api.ts                   # API service layer
│   └── utils.ts                 # Helper functions
├── types/                       # TypeScript type definitions
│   └── auth.ts                  # Authentication types
└── middleware.ts                # Next.js middleware for route protection
```

## Authentication Flow

### 1. User Registration
- Users can sign up with email, username, and password
- Role selection (admin/user) with admin approval requirement
- Automatic login after successful registration

### 2. User Login
- Email/password authentication
- JWT token storage in localStorage
- Automatic redirect to appropriate dashboard based on role

### 3. Route Protection
- Middleware-level protection for all routes
- Component-level protection with role checking
- Automatic redirect to login for unauthenticated users
- Role-based redirects for unauthorized access

### 4. User Management
- Profile viewing and editing
- Secure logout with token cleanup
- Session persistence across browser refreshes

## API Integration

The frontend integrates with the backend API through:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL`
- **Authentication**: JWT tokens in Authorization headers
- **Error Handling**: Comprehensive error handling with user feedback
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Token expiration handling

### API Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - User logout

## Role-Based Access Control

### User Role
- Access to personal dashboard
- Book browsing and reviews
- Profile management
- Limited to user-specific features

### Admin Role
- Access to admin dashboard
- User management capabilities
- Book management system
- Review moderation
- System statistics and monitoring

## Styling & Design

- **Design System**: Consistent color palette and typography
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and loading states
- **Icons**: Lucide React icon library for consistency

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component-based architecture

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm run start
   ```

3. **Environment Variables**:
   Ensure all environment variables are set in production

## Security Features

- JWT token-based authentication
- Secure token storage
- Route protection middleware
- Role-based access control
- Input validation and sanitization
- HTTPS enforcement in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.