# replit.md

## Overview

Parlez-Vous is an interactive French learning application designed specifically for children aged 8-14. The app provides AI-powered conversation practice with Madame Sophie, a friendly French teacher character. Students can engage in topic-based conversations, receive translations, and get encouraging feedback to build their French speaking confidence in a supportive environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for type safety across the full stack
- **API Structure**: RESTful endpoints for user management, conversations, topics, and AI responses
- **Data Storage**: In-memory storage implementation with interface-based design for easy database migration
- **AI Integration**: OpenAI GPT-4o for generating contextual French responses and translations

### Database Schema
- **Users**: Tracks user progress with streak counters and daily conversation counts
- **Conversations**: Stores conversation sessions linked to specific topics
- **Messages**: Contains the chat history with French content, translations, and timestamps
- **Topics**: Predefined conversation topics with starter prompts (introducing, family, school, hobbies, food)

### Key Design Patterns
- **Shared Schema**: Common TypeScript types and Drizzle schemas shared between client and server
- **Interface-based Storage**: Storage abstraction allowing easy switching from in-memory to database persistence
- **Component Composition**: Modular React components with clear separation of concerns
- **Type-safe API**: Full TypeScript integration from database to UI components

### Child-Friendly Features
- **Encouraging UI**: Playful design with custom fonts (Fredoka One for headings, Inter for body text)
- **Progress Tracking**: Streak counters and daily conversation goals to motivate consistent practice
- **Safe AI Responses**: Age-appropriate content filtering and encouraging feedback in AI responses
- **Visual Feedback**: Emoji-based topic selection and encouragement modals for positive reinforcement

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for generating contextual French conversation responses and English translations

### Database
- **PostgreSQL**: Configured with Drizzle ORM for data persistence (currently using in-memory storage)
- **Neon Database**: Serverless PostgreSQL provider for production deployment

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### UI Libraries
- **Radix UI**: Accessible component primitives for dialog, dropdown, form controls
- **Embla Carousel**: Touch-friendly carousel components
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation for form inputs and API responses

### Styling
- **Tailwind CSS**: Utility-first CSS framework with custom color palette
- **CSS Variables**: Dynamic theming support for light/dark modes
- **Google Fonts**: Fredoka One and Inter fonts for child-friendly typography