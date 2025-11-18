/**
 * Main Project Exporter
 * Orchestrates the export of complete Next.js projects
 */

import { Project, ProjectFile } from '../stores/project-store';
import { ExportOptions, ExportFile, ExportResult, ExportProgress } from './types';
import {
  generatePackageJson,
  generateTsConfig,
  generateNextConfig,
  generateTailwindConfig,
  generatePostCssConfig,
  generateReadme,
  generateGitIgnore,
  generateEnvExample,
  generateLayout,
  generateGlobalsCss,
  generateEslintConfig,
} from './templates';
import { createZipFromFiles } from './zipGenerator';

/**
 * Export a complete Next.js project
 */
export async function exportProject(
  project: Project,
  options: ExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<ExportResult> {
  try {
    // Stage 1: Preparing
    onProgress?.({
      stage: 'preparing',
      progress: 0,
      message: 'Preparing export...',
    });

    // Stage 2: Generating files
    onProgress?.({
      stage: 'generating',
      progress: 20,
      message: 'Generating project files...',
    });

    const files = await generateProjectFiles(project, options, onProgress);

    // Stage 3: Bundling
    onProgress?.({
      stage: 'bundling',
      progress: 70,
      message: 'Creating ZIP archive...',
    });

    const blob = await createZipFromFiles(files);

    // Stage 4: Complete
    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Export complete!',
    });

    const filename = `${options.projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return {
      blob,
      filename,
      totalSize,
      fileCount: files.length,
      files,
    };
  } catch (error) {
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: error instanceof Error ? error.message : 'Export failed',
    });
    throw error;
  }
}

/**
 * Generate all project files
 */
async function generateProjectFiles(
  project: Project,
  options: ExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<ExportFile[]> {
  const files: ExportFile[] = [];

  // Helper to add file
  const addFile = (path: string, content: string) => {
    files.push({
      path,
      content,
      size: new Blob([content]).size,
    });
  };

  // Root configuration files
  onProgress?.({
    stage: 'generating',
    progress: 25,
    message: 'Generating configuration files...',
    currentFile: 'package.json',
  });

  addFile('package.json', generatePackageJson(project, options));
  addFile('next.config.js', generateNextConfig());
  addFile(
    options.typescript ? 'tailwind.config.ts' : 'tailwind.config.js',
    generateTailwindConfig(options.typescript)
  );
  addFile('postcss.config.js', generatePostCssConfig());
  addFile('.gitignore', generateGitIgnore());
  addFile('.env.example', generateEnvExample(options.includeMockData));
  addFile('.eslintrc.json', generateEslintConfig());

  if (options.typescript) {
    addFile('tsconfig.json', generateTsConfig());
  }

  // Documentation
  if (options.includeDocs) {
    onProgress?.({
      stage: 'generating',
      progress: 35,
      message: 'Generating documentation...',
      currentFile: 'README.md',
    });

    addFile('README.md', generateReadme(project, options));
  }

  // App directory structure
  onProgress?.({
    stage: 'generating',
    progress: 45,
    message: 'Generating app structure...',
    currentFile: 'app/layout.tsx',
  });

  addFile(
    options.typescript ? 'app/layout.tsx' : 'app/layout.jsx',
    generateLayout(options)
  );

  // Add global styles
  addFile('app/globals.css', generateGlobalsCss());

  // Process project files
  onProgress?.({
    stage: 'generating',
    progress: 50,
    message: 'Processing project files...',
  });

  if (project.files && project.files.length > 0) {
    for (let i = 0; i < project.files.length; i++) {
      const file = project.files[i];
      const progress = 50 + (i / project.files.length) * 15;

      onProgress?.({
        stage: 'generating',
        progress,
        message: 'Processing project files...',
        currentFile: file.path,
      });

      // Convert file path if needed
      let filePath = file.path;

      // If file is meant for app directory
      if (!filePath.startsWith('app/') && !filePath.startsWith('components/') && !filePath.startsWith('lib/')) {
        filePath = `app/${filePath}`;
      }

      // Adjust extension based on TypeScript option
      if (!options.typescript && (filePath.endsWith('.tsx') || filePath.endsWith('.ts'))) {
        filePath = filePath.replace(/\.tsx?$/, filePath.endsWith('.tsx') ? '.jsx' : '.js');
      }

      addFile(filePath, file.content);
    }
  } else {
    // Add default page if no files
    const defaultPage = generateDefaultPage(project, options.typescript);
    addFile(
      options.typescript ? 'app/page.tsx' : 'app/page.jsx',
      defaultPage
    );
  }

  // Mock data
  if (options.includeMockData) {
    onProgress?.({
      stage: 'generating',
      progress: 65,
      message: 'Including mock data...',
      currentFile: 'lib/mock/data.ts',
    });

    addFile(
      options.typescript ? 'lib/mock/data.ts' : 'lib/mock/data.js',
      generateMockData(project, options.typescript)
    );

    addFile(
      options.typescript ? 'lib/mock/index.ts' : 'lib/mock/index.js',
      generateMockIndex(options.typescript)
    );
  }

  // Tests
  if (options.includeTests) {
    onProgress?.({
      stage: 'generating',
      progress: 68,
      message: 'Generating test files...',
    });

    addFile('jest.config.js', generateJestConfig());
    addFile(
      options.typescript ? '__tests__/example.test.tsx' : '__tests__/example.test.jsx',
      generateExampleTest(options.typescript)
    );
  }

  // Utility files
  addFile(
    options.typescript ? 'lib/utils.ts' : 'lib/utils.js',
    generateUtils(options.typescript)
  );

  return files;
}

/**
 * Generate default home page
 */
function generateDefaultPage(project: Project, typescript: boolean): string {
  return `${typescript ? "import type { Metadata } from 'next'\n\n" : ''}${
    typescript
      ? `export const metadata: Metadata = {
  title: '${project.name}',
  description: '${project.description || 'Generated with VibeCoding AI'}',
}

`
      : ''
  }export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          ${project.name}
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12">
          ${project.description || 'Welcome to your new Next.js application'}
        </p>

        <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Docs{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Find in-depth information about Next.js features and API.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Learn{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Deploy{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Instantly deploy your Next.js site to a shareable URL with Vercel.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
`;
}

/**
 * Generate mock data file
 */
function generateMockData(project: Project, typescript: boolean): string {
  const typeAnnotation = typescript ? ': any' : '';

  return `/**
 * Mock Data
 * Development mock data for ${project.name}
 */

export const mockData${typeAnnotation} = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://via.placeholder.com/150',
    },
  ],
  items: [
    {
      id: '1',
      title: 'Sample Item 1',
      description: 'This is a sample item',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Sample Item 2',
      description: 'This is another sample item',
      createdAt: new Date().toISOString(),
    },
  ],
};

export function getMockUser(id${typescript ? ': string' : ''}) {
  return mockData.users.find(u => u.id === id);
}

export function getMockItems() {
  return mockData.items;
}
`;
}

/**
 * Generate mock index
 */
function generateMockIndex(typescript: boolean): string {
  return `export * from './data';
`;
}

/**
 * Generate Jest config
 */
function generateJestConfig(): string {
  return `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
`;
}

/**
 * Generate example test
 */
function generateExampleTest(typescript: boolean): string {
  return `import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('renders the page', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })
})
`;
}

/**
 * Generate utility functions
 */
function generateUtils(typescript: boolean): string {
  const typeImport = typescript ? "import { type ClassValue, clsx } from 'clsx'\nimport { twMerge } from 'tailwind-merge'\n\n" : "import { clsx } from 'clsx'\nimport { twMerge } from 'tailwind-merge'\n\n";

  return `${typeImport}export function cn(...inputs${typescript ? ': ClassValue[]' : ''}) {
  return twMerge(clsx(inputs))
}

export function formatDate(date${typescript ? ': Date | string' : ''}) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function sleep(ms${typescript ? ': number' : ''}) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
`;
}
