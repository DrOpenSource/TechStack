/**
 * Sandbox Security Helper
 * Provides security utilities for safely executing user-generated code in previews
 */

// Dangerous patterns that should be blocked
const DANGEROUS_PATTERNS = [
  // File system access
  /require\s*\(\s*['"]fs['"]\s*\)/gi,
  /require\s*\(\s*['"]path['"]\s*\)/gi,
  /require\s*\(\s*['"]child_process['"]\s*\)/gi,

  // Process access
  /process\./gi,

  // Eval and Function constructor
  /\beval\s*\(/gi,
  /new\s+Function\s*\(/gi,

  // Dynamic imports (can be used to bypass restrictions)
  /import\s*\(/gi,

  // Direct DOM manipulation that could break sandbox
  /document\.write/gi,
  /document\.writeln/gi,

  // Access to parent/top frames
  /window\.parent/gi,
  /window\.top/gi,
  /parent\.location/gi,
  /top\.location/gi,

  // Local storage/cookies (to prevent data theft)
  /localStorage/gi,
  /sessionStorage/gi,
  /document\.cookie/gi,

  // Network requests (XMLHttpRequest, fetch) - commented out as they might be needed
  // /XMLHttpRequest/gi,
  // /fetch\s*\(/gi,

  // Dangerous HTML
  /<script/gi,
  /<iframe/gi,
];

// Allowed imports whitelist
const ALLOWED_IMPORTS = [
  'react',
  'react-dom',
  'react-dom/client',
  'next',
  'next/link',
  'next/image',
  'next/router',
  'next/navigation',
];

// Allowed React hooks
const ALLOWED_HOOKS = [
  'useState',
  'useEffect',
  'useCallback',
  'useMemo',
  'useRef',
  'useContext',
  'useReducer',
  'useLayoutEffect',
  'useImperativeHandle',
  'useDebugValue',
  'useId',
  'useTransition',
  'useDeferredValue',
];

/**
 * Sanitizes code by removing dangerous patterns
 * @param code - The code to sanitize
 * @returns Sanitized code
 * @throws Error if dangerous patterns are detected
 */
export function sanitizeCode(code: string): string {
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      throw new Error(
        `Security violation: Code contains dangerous pattern: ${pattern.source}`
      );
    }
  }

  // Remove import statements but preserve the code
  // In the preview environment, we use CDN versions of libraries
  const sanitized = code.replace(
    /import\s+.*?from\s+['"].*?['"];?\s*/g,
    (match) => {
      // Allow certain imports
      if (ALLOWED_IMPORTS.some((allowed) => match.includes(allowed))) {
        return `// ${match}`;
      }
      return '';
    }
  );

  return sanitized;
}

/**
 * Validates if an import is allowed
 * @param importPath - The import path to validate
 * @returns True if import is allowed
 */
export function isAllowedImport(importPath: string): boolean {
  return ALLOWED_IMPORTS.some((allowed) => importPath.includes(allowed));
}

/**
 * Extracts imports from code
 * @param code - The code to analyze
 * @returns Array of import statements
 */
export function extractImports(code: string): string[] {
  const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g;
  const imports: string[] = [];
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

/**
 * Validates all imports in code
 * @param code - The code to validate
 * @returns Object with validation result and blocked imports
 */
export function validateImports(code: string): {
  isValid: boolean;
  blockedImports: string[];
} {
  const imports = extractImports(code);
  const blockedImports = imports.filter((imp) => !isAllowedImport(imp));

  return {
    isValid: blockedImports.length === 0,
    blockedImports,
  };
}

/**
 * Creates a Content Security Policy for the preview iframe
 * @returns CSP meta tag string
 */
export function generateCSP(): string {
  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'", // Required for Babel transformation
      'https://unpkg.com',
      'https://cdn.tailwindcss.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
    'img-src': ["'self'", 'data:', 'https:', 'http:'],
    'font-src': ["'self'", 'data:', 'https:', 'http:'],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };

  const cspString = Object.entries(csp)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  return `<meta http-equiv="Content-Security-Policy" content="${cspString}">`;
}

/**
 * Wraps code in a safe execution context
 * @param code - The code to wrap
 * @returns Wrapped code with error handling
 */
export function wrapInSafeContext(code: string): string {
  return `
(function() {
  'use strict';

  // Override dangerous globals
  const window = undefined;
  const document = undefined;
  const global = undefined;
  const globalThis = undefined;

  try {
    ${code}
  } catch (error) {
    console.error('Component Error:', error);
    throw error;
  }
})();
  `.trim();
}

/**
 * Validates component props to prevent XSS
 * @param props - The props object to validate
 * @returns Sanitized props
 */
export function sanitizeProps(props: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string') {
      // Escape HTML in string props
      sanitized[key] = escapeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeProps(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Escapes HTML special characters
 * @param text - The text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validates mock data to prevent code injection
 * @param mockData - The mock data to validate
 * @returns True if data is safe
 */
export function validateMockData(mockData: any): boolean {
  const jsonString = JSON.stringify(mockData);

  // Check for potential code injection in JSON
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
    /eval\s*\(/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(jsonString));
}

/**
 * Creates a sandbox configuration for iframe
 * @returns Sandbox attribute value
 */
export function getSandboxAttributes(): string {
  return [
    'allow-scripts', // Allow JavaScript execution
    'allow-same-origin', // Allow accessing same-origin resources
    // NOT including: allow-forms, allow-top-navigation, allow-popups
  ].join(' ');
}

/**
 * Rate limiter for preview updates to prevent DoS
 */
export class PreviewRateLimiter {
  private lastUpdate: number = 0;
  private minInterval: number;

  constructor(minIntervalMs: number = 100) {
    this.minInterval = minIntervalMs;
  }

  canUpdate(): boolean {
    const now = Date.now();
    if (now - this.lastUpdate >= this.minInterval) {
      this.lastUpdate = now;
      return true;
    }
    return false;
  }

  reset(): void {
    this.lastUpdate = 0;
  }
}

/**
 * Monitors code execution time to prevent infinite loops
 */
export class ExecutionMonitor {
  private startTime: number = 0;
  private maxExecutionTime: number;

  constructor(maxExecutionTimeMs: number = 5000) {
    this.maxExecutionTime = maxExecutionTimeMs;
  }

  start(): void {
    this.startTime = Date.now();
  }

  check(): void {
    if (Date.now() - this.startTime > this.maxExecutionTime) {
      throw new Error('Execution timeout: Component took too long to render');
    }
  }
}
