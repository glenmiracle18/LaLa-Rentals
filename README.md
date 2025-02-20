# LaLa Rental Platform Technical Stack Documentation

## Core Technologies Overview

### 1. Next.js (App Router)
- **Version**: 14.x
- **Purpose**: Full-stack React framework for the application
- **Key Features Used**:
  - App Router for enhanced routing and layouts
  - Server Components for improved performance
  - API Routes for backend functionality
  - Dynamic routing for property listings (/properties/[id])
  - Metadata API for SEO optimization
  - Image optimization with next/image

### 2. Neon (PostgreSQL)
- **Purpose**: Serverless Postgres database
- **Key Benefits**:
  - Serverless architecture
  - Built-in connection pooling
  - Automatic scaling
  - Branch feature for development
- **Database Schema Areas**:
  - User profiles (extending Clerk data)
  - Property listings
  - Bookings
  - Reviews and ratings

### 3. Server Actions
- **Purpose**: Handle server-side mutations and data processing
- **Implementation Areas**:
  - Property creation and updates
  - Booking management
  - Image upload processing
  - Search functionality
- **Key Features**:
  - Progressive enhancement
  - Built-in error handling
  - Form validation
  - Optimistic updates

### 4. TanStack React Query
- **Version**: v5
- **Purpose**: State management and server state synchronization
- **Implementation**:
  - Custom hooks for data fetching
  - Mutations for data updates
  - Optimistic updates for better UX
  - Infinite loading for property listings
- **Key Features Used**:
  - Automatic background refetching
  - Cache management
  - Error handling
  - Loading states

### 5. Uploadthing
- **Purpose**: Handle image uploads for property listings
- **Implementation**:
  - Property image uploads
  - User avatar uploads
  - Multiple image upload support
- **Features**:
  - Direct-to-cloud uploads
  - Image optimization
  - Progress tracking
  - File type validation

### 6. Clerk
- **Purpose**: Authentication and user management
- **Implementation**:
  - Role-based access control (Host/Renter)
  - Social authentication (Google)
  - User profile management
- **Key Features**:
  - Protected routes
  - Middleware for auth checks
  - User roles and permissions
  - Session management

### 7. shadcn/ui
- **Purpose**: UI component library
- **Key Components Used**:
  - Form elements (inputs, selects, buttons)
  - Dialog modals
  - Date pickers for bookings
  - Cards for property listings
  - Navigation components
  - Tables for booking management
- **Customization**:
  - Custom theme configuration
  - Tailwind CSS integration
  - Responsive design patterns

### 8. TailwindCSS
- **Purpose**: Utility-first CSS framework
- **Configuration**:
  - Custom color scheme
  - Extended theme configuration
  - Custom container queries
  - Responsive breakpoints
- **Organization**:
  - Component-specific styles
  - Global styles
  - Dark mode support
  - Animation classes

## Project Structure

```
lala-rental/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/
│   │   ├── host/
│   │   └── renter/
│   ├── api/
│   │   ├── properties/
│   │   ├── bookings/
│   │   └── uploadthing/
│   └── properties/
├── components/
│   ├── ui/
│   ├── forms/
│   └── properties/
├── lib/
│   ├── db/
│   ├── utils/
│   └── validators/
├── hooks/
│   ├── use-properties.ts
│   └── use-bookings.ts
└── types/
```

## Database Schema

```sql
-- Properties Table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    host_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    renter_id VARCHAR(255) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property Images Table
CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles Table (Extended Clerk Data)
CREATE TABLE user_profiles (
    id VARCHAR(255) PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Routes Structure

```typescript
// Property Routes
GET /api/properties - List all properties
GET /api/properties/[id] - Get single property
POST /api/properties - Create property
PUT /api/properties/[id] - Update property
DELETE /api/properties/[id] - Delete property

// Booking Routes
GET /api/bookings - List user's bookings
POST /api/bookings - Create booking
PUT /api/bookings/[id] - Update booking status
DELETE /api/bookings/[id] - Cancel booking

// User Routes
GET /api/user/profile - Get user profile
PUT /api/user/profile - Update user profile
```

## Authentication Flow

1. User signs up/logs in using Clerk
2. Role selection during registration:
   - Host: Can list properties and manage bookings
   - Renter: Can browse and book properties
3. Role-based middleware checks for protected routes
4. Session management handled by Clerk
5. User data synced with custom profile table

## Deployment Considerations

1. **Vercel Deployment**:
   - Environment variables configuration
   - Build optimization
   - Edge functions for API routes
   - Image optimization

2. **Database**:
   - Connection pooling setup
   - Migration strategy
   - Backup procedures
   - Scaling considerations

3. **Security**:
   - CORS configuration
   - Rate limiting
   - Input validation
   - Data encryption

4. **Monitoring**:
   - Error tracking
   - Performance monitoring
   - Usage analytics
   - Database metrics

## Development Workflow

1. **Local Setup**:
   ```bash
   pnpm create next-app lala-rental --typescript --tailwind --app
   pnpm add @clerk/nextjs @tanstack/react-query @uploadthing/react
   pnpm add -D prisma @types/node @types/react
   ```

2. **Environment Configuration**:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   UPLOADTHING_SECRET=
   UPLOADTHING_APP_ID=
   DATABASE_URL=
   ```

3. **Development Commands**:
   ```bash
   pnpm dev # Start development server
   pnpm build # Build for production
   pnpm start # Start production server
   pnpm lint # Run ESLint
   ```

This technical stack provides a robust foundation for building a scalable rental platform with modern web technologies. Each technology has been chosen for its specific strengths and how it contributes to the overall architecture of the application.