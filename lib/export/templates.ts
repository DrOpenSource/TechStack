/**
 * Project Template Generators
 * Functions to generate boilerplate files for exported projects
 */

import { Project } from '../stores/project-store';
import { ExportOptions } from './types';

/**
 * Generate package.json for exported project
 */
export function generatePackageJson(project: Project, options: ExportOptions): string {
  const packageJson = {
    name: options.projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '0.1.0',
    private: true,
    description: project.description || 'Generated with VibeCoding AI',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      'type-check': options.typescript ? 'tsc --noEmit' : undefined,
      test: options.includeTests ? 'jest' : undefined,
      'test:watch': options.includeTests ? 'jest --watch' : undefined,
    },
    dependencies: {
      next: '^14.2.5',
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'lucide-react': '^0.294.0',
      'framer-motion': '^10.16.0',
      clsx: '^2.0.0',
      'tailwind-merge': '^2.1.0',
      'class-variance-authority': '^0.7.0',
    },
    devDependencies: {
      '@types/node': options.typescript ? '^20.10.0' : undefined,
      '@types/react': options.typescript ? '^18.2.42' : undefined,
      '@types/react-dom': options.typescript ? '^18.2.17' : undefined,
      typescript: options.typescript ? '^5.3.0' : undefined,
      autoprefixer: '^10.4.16',
      postcss: '^8.4.32',
      tailwindcss: '^3.3.6',
      eslint: '^8.55.0',
      'eslint-config-next': '^14.0.0',
      jest: options.includeTests ? '^29.7.0' : undefined,
      '@testing-library/react': options.includeTests ? '^14.1.2' : undefined,
      '@testing-library/jest-dom': options.includeTests ? '^6.1.5' : undefined,
    },
    engines: {
      node: '>=18.0.0',
    },
  };

  // Remove undefined values
  Object.keys(packageJson.scripts).forEach((key) => {
    if (packageJson.scripts[key as keyof typeof packageJson.scripts] === undefined) {
      delete packageJson.scripts[key as keyof typeof packageJson.scripts];
    }
  });

  Object.keys(packageJson.devDependencies).forEach((key) => {
    if (packageJson.devDependencies[key as keyof typeof packageJson.devDependencies] === undefined) {
      delete packageJson.devDependencies[key as keyof typeof packageJson.devDependencies];
    }
  });

  return JSON.stringify(packageJson, null, 2);
}

/**
 * Generate TypeScript config
 */
export function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next',
          },
        ],
        paths: {
          '@/*': ['./*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2
  );
}

/**
 * Generate Next.js config
 */
export function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
`;
}

/**
 * Generate Tailwind config
 */
export function generateTailwindConfig(typescript: boolean): string {
  const ext = typescript ? 'ts' : 'js';
  const typeAnnotation = typescript ? ': Config' : '';

  return `import type { Config } from 'tailwindcss'

const config${typeAnnotation} = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
`;
}

/**
 * Generate PostCSS config
 */
export function generatePostCssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
}

/**
 * Generate README.md
 */
export function generateReadme(project: Project, options: ExportOptions): string {
  return `# ${options.projectName}

${project.description || 'Generated with VibeCoding AI'}

## Overview

This project was generated using VibeCoding AI, an intelligent code generation platform. It includes a fully functional Next.js application with modern best practices.

## Features

- ⚡ **Next.js 14** - Latest version with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔷 **${options.typescript ? 'TypeScript' : 'JavaScript'}** - Type-safe development
- 📱 **Responsive Design** - Mobile-first approach
- 🎭 **Framer Motion** - Smooth animations
- 🎯 **Lucide Icons** - Beautiful icon set
${options.includeMockData ? '- 🎲 **Mock Data** - Development-ready mock data system\n' : ''}${options.includeTests ? '- 🧪 **Testing** - Jest and React Testing Library setup\n' : ''}
## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

2. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy \`.env.example\` to \`.env.local\` and configure your environment:

\`\`\`bash
cp .env.example .env.local
\`\`\`

${
  options.includeMockData
    ? `### Mock Mode

This project includes a mock data system for development. Enable it by setting:

\`\`\`env
NEXT_PUBLIC_MOCK_MODE=true
\`\`\`

Mock data files are located in \`lib/mock/\`.
`
    : ''
}

## Project Structure

\`\`\`
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities and helpers
${options.includeMockData ? '│   └── mock/              # Mock data\n' : ''}${options.includeTests ? '├── __tests__/             # Test files\n' : ''}├── public/                # Static files
├── styles/                # Global styles
└── types/                 # TypeScript types
\`\`\`

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

${
  options.typescript
    ? `## Type Checking

\`\`\`bash
npm run type-check
\`\`\`
`
    : ''
}

${
  options.includeTests
    ? `## Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`
`
    : ''
}

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
${options.typescript ? '- [TypeScript Documentation](https://www.typescriptlang.org/docs)\n' : ''}
## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

You can also deploy to:
- Netlify
- AWS Amplify
- Railway
- Render

---

**Generated by VibeCoding AI** • ${new Date().toLocaleDateString()}
`;
}

/**
 * Generate .gitignore
 */
export function generateGitIgnore(): string {
  return `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage
*.log

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
`;
}

/**
 * Generate .env.example
 */
export function generateEnvExample(includeMockData: boolean): string {
  return `# Environment Configuration

# Mock Mode (development only)
${includeMockData ? 'NEXT_PUBLIC_MOCK_MODE=true' : '# NEXT_PUBLIC_MOCK_MODE=false'}

# API Configuration
# NEXT_PUBLIC_API_URL=https://api.example.com

# Authentication (if needed)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-key

# Database (if needed)
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
`;
}

/**
 * Generate root layout.tsx
 */
export function generateLayout(options: ExportOptions): string {
  const ext = options.typescript ? 'tsx' : 'jsx';

  return `${options.typescript ? "import type { Metadata } from 'next'\n" : ''}import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

${
  options.typescript
    ? `export const metadata: Metadata = {
  title: 'VibeCoding App',
  description: 'Generated with VibeCoding AI',
}
`
    : ''
}

export default function RootLayout(${
    options.typescript
      ? `{
  children,
}: {
  children: React.ReactNode
})`
      : '{ children }'
  }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`;
}

/**
 * Generate globals.css
 */
export function generateGlobalsCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
}

/**
 * Generate ESLint config
 */
export function generateEslintConfig(): string {
  return JSON.stringify(
    {
      extends: 'next/core-web-vitals',
    },
    null,
    2
  );
}
