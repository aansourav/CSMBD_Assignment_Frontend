# CSMBD Assignment Frontend

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.0-black?logo=next.js" alt="Next.js"></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-19.0-blue?logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css" alt="TailwindCSS"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

A modern, responsive web application built with Next.js 15 for user content management and collaboration.

<p align="center">
  <img src="https://i.ibb.co.com/YT8JRGYF/csmbd-social.png" alt="CSMBD Frontend" width="800"/>
</p>

## 📑 Table of Contents

- [CSMBD Assignment Frontend](#csmbd-assignment-frontend)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠 Tech Stack](#-tech-stack)
  - [🎮 Demo](#-demo)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [📂 Project Structure](#-project-structure)
  - [⚙️ API Configuration](#️-api-configuration)
  - [🌐 Deployment](#-deployment)
    - [Build for Production](#build-for-production)
  - [👥 Contributing](#-contributing)
  - [❓ Troubleshooting](#-troubleshooting)
    - [Common Issues](#common-issues)

## ✨ Features

-   **👤 User Authentication** - Secure sign-in and sign-up functionality with JWT token management
-   **👥 User Management** - View, search, and sort user profiles
-   **📝 Content Management** - Create, browse, search, and filter content
-   **👤 User Profiles** - Detailed user profiles with content history
-   **📱 Responsive UI** - Beautiful interface that works on all device sizes
-   **🔄 Real-time Updates** - Data fetching with TanStack React Query
-   **📄 Pagination** - Efficient content loading with pagination support
-   **🔍 Advanced Filtering** - Search and sort functionality throughout the application
-   **🌓 Theme Support** - Light and dark mode with next-themes

## 🛠 Tech Stack

<details open>
<summary><b>Core Technologies</b></summary>
<br>

-   **Next.js 15** - React framework with server components and App Router
-   **React 19** - Frontend library
-   **TypeScript** - Static type checking
-   **TailwindCSS** - Utility-first CSS framework
</details>

<details>
<summary><b>UI Libraries</b></summary>
<br>

-   **shadcn/ui** - High-quality UI components built with Radix UI and Tailwind
-   **Radix UI** - Unstyled, accessible components
-   **Lucide Icons** - Beautiful, consistent icon set
-   **Tailwind Animate** - Tailwind plugin for animations
-   **Framer Motion** - Animation library
-   **Sonner** - Toast notifications
</details>

<details>
<summary><b>State Management & Data Fetching</b></summary>
<br>

-   **TanStack React Query** - Data fetching, caching, and state management
-   **React Hook Form** - Form validation with Zod and Yup schemas
-   **Context API** - Application state management
</details>

<details>
<summary><b>Data Visualization</b></summary>
<br>

-   **Recharts** - Composable charting library
-   **Embla Carousel** - Flexible carousel component
</details>

<details>
<summary><b>Additional Libraries</b></summary>
<br>

-   **date-fns** - Date manipulation
-   **clsx** & **tailwind-merge** - Conditional class name utilities
-   **class-variance-authority** - Type-safe UI variants
</details>

## 🎮 Demo

Check out the live demo: [CSMBD Frontend Demo](https://your-demo-url.com)

<p align="center">
  <img src="https://via.placeholder.com/800x450?text=Application+Demo+GIF" alt="Application Demo" width="600"/>
</p>

## 🚀 Getting Started

### Prerequisites

-   Node.js 18.17 or later
-   npm (recommended) or npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/csmbd-assignment-frontend.git
cd csmbd-assignment-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_APP_ENV=development
```

4. **Start the development server**

```bash
npm dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📂 Project Structure

```
csmbd-assignment-frontend/
├── app/                    # Next.js App Router pages and layouts
│   ├── content/            # Content management pages
│   ├── profile/            # User profile pages
│   ├── signin/             # Authentication pages
│   ├── signup/             # Registration pages
│   ├── users/              # User management pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   └── providers.tsx       # App providers
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and helpers
├── middleware/             # Next.js middleware functions
├── public/                 # Static assets
├── services/               # API services and utilities
│   └── api.js              # API client
├── styles/                 # Global CSS and Tailwind configuration
├── config/                 # Application configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## ⚙️ API Configuration

The application communicates with a backend API. Configure the API URL in your `./config/url.js` file:

```env
// API Configuration
export const BASE_URL = "http://localhost:5500";
export const API_URL = "http://localhost:5500/api/v1";
```

The API client (`services/api.js`) handles authentication, request formatting, and token refresh functionality.

## 🌐 Deployment

### Build for Production

```bash
npm build
npm start
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate.

## ❓ Troubleshooting

### Common Issues

**Issue**: API connection errors
**Solution**: Verify your API URL in `./config/url.js` and ensure the API server is running.

**Issue**: Build fails with module not found errors
**Solution**: Run `npm install` to ensure all dependencies are installed.

**Issue**: Authentication issues
**Solution**: Clear browser cookies/local storage and try signing in again.


---

<div align="center">

**🌟 Built with ❤️ by [Abdullah An-Noor](https://aansourav.vercel.app) 🌟**

</div>