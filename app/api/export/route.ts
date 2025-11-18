/**
 * Export API Route
 * Handles server-side project export requests
 */

import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { ExportOptions } from '@/lib/export/types';
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
} from '@/lib/export/templates';

export async function POST(request: NextRequest) {
  try {
    const { project, options } = await request.json();

    if (!project) {
      return NextResponse.json(
        { error: 'Project data is required' },
        { status: 400 }
      );
    }

    const exportOptions: ExportOptions = {
      projectName: options?.projectName || project.name || 'my-next-app',
      includeMockData: options?.includeMockData ?? true,
      includeDocs: options?.includeDocs ?? true,
      includeTests: options?.includeTests ?? false,
      typescript: options?.typescript ?? true,
      format: 'zip',
    };

    // Create a new ZIP file
    const zip = new JSZip();

    // Add configuration files
    zip.file('package.json', generatePackageJson(project, exportOptions));
    zip.file('next.config.js', generateNextConfig());
    zip.file(
      exportOptions.typescript ? 'tailwind.config.ts' : 'tailwind.config.js',
      generateTailwindConfig(exportOptions.typescript)
    );
    zip.file('postcss.config.js', generatePostCssConfig());
    zip.file('.gitignore', generateGitIgnore());
    zip.file('.env.example', generateEnvExample(exportOptions.includeMockData));
    zip.file('.eslintrc.json', generateEslintConfig());

    if (exportOptions.typescript) {
      zip.file('tsconfig.json', generateTsConfig());
    }

    // Add documentation
    if (exportOptions.includeDocs) {
      zip.file('README.md', generateReadme(project, exportOptions));
    }

    // Add app files
    zip.file(
      exportOptions.typescript ? 'app/layout.tsx' : 'app/layout.jsx',
      generateLayout(exportOptions)
    );
    zip.file('app/globals.css', generateGlobalsCss());

    // Add project files
    if (project.files && Array.isArray(project.files)) {
      project.files.forEach((file: { path: string; content: string }) => {
        let filePath = file.path;

        // Ensure proper directory structure
        if (!filePath.startsWith('app/') && !filePath.startsWith('components/') && !filePath.startsWith('lib/')) {
          filePath = `app/${filePath}`;
        }

        // Adjust extension based on TypeScript option
        if (!exportOptions.typescript && (filePath.endsWith('.tsx') || filePath.endsWith('.ts'))) {
          filePath = filePath.replace(/\.tsx?$/, filePath.endsWith('.tsx') ? '.jsx' : '.js');
        }

        zip.file(filePath, file.content);
      });
    } else {
      // Add default page if no files provided
      const defaultPage = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">${project.name}</h1>
      <p className="mt-4 text-lg text-gray-600">${project.description || 'Welcome to your new Next.js app'}</p>
    </main>
  )
}
`;
      zip.file(
        exportOptions.typescript ? 'app/page.tsx' : 'app/page.jsx',
        defaultPage
      );
    }

    // Add mock data if requested
    if (exportOptions.includeMockData) {
      const mockData = `export const mockData = {
  users: [],
  items: [],
};
`;
      zip.file(
        exportOptions.typescript ? 'lib/mock/data.ts' : 'lib/mock/data.js',
        mockData
      );
    }

    // Add utility files
    const utils = `${exportOptions.typescript ? "import { type ClassValue, clsx } from 'clsx'\nimport { twMerge } from 'tailwind-merge'\n\n" : "import { clsx } from 'clsx'\nimport { twMerge } from 'tailwind-merge'\n\n"}export function cn(...inputs${exportOptions.typescript ? ': ClassValue[]' : ''}) {
  return twMerge(clsx(inputs))
}
`;
    zip.file(
      exportOptions.typescript ? 'lib/utils.ts' : 'lib/utils.js',
      utils
    );

    // Generate ZIP file as arraybuffer for proper Response handling
    const zipData = await zip.generateAsync({ type: 'arraybuffer' });

    const filename = `${exportOptions.projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;

    // Return ZIP file using native Response (better for binary data)
    return new Response(zipData, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': zipData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      {
        error: 'Failed to export project',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Export API is ready',
    usage: 'Send POST request with project and options data',
  });
}
