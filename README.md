# FinTrack - Personal Finance Management Application

FinTrack is a modern web application for tracking personal finances, managing budgets, and monitoring spending habits.

## Features

- Dashboard with financial overview
- Transaction tracking and categorization
- Budget management
- Account management
- Responsive design for all devices
- Dark/light mode support
- Secure authentication with Clerk

## Tech Stack

- Next.js 13.5.7
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Clerk Authentication

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

You can get these keys by signing up at [clerk.com](https://clerk.com) and creating a new application.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Authentication Setup

This project uses Clerk for authentication. To set up Clerk:

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Copy your API keys from the Clerk dashboard
4. Add them to your `.env.local` file as shown above
5. Configure your application settings in the Clerk dashboard:
   - Set the redirect URLs to include your development and production URLs
   - Customize the appearance and behavior of the authentication components

## Development

The application structure follows Next.js 13 App Router conventions:

- `/app` - Contains all the routes and page components
- `/components` - Reusable UI components
- `/lib` - Utility functions and shared code
- `/public` - Static assets

## Deployment

The application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

```bash
npm run build
# or
yarn build
```

## License

MIT
