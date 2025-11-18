import { sanitizeCode } from './sandboxHelper';

/**
 * Renders React component code in a sandboxed HTML document
 * @param code - The React component code to render
 * @param mockData - Mock data to pass to the component
 * @returns HTML string for iframe rendering
 */
export function renderPreview(code: string, mockData: any = {}): string {
  // Sanitize the code before rendering
  const sanitizedCode = sanitizeCode(code);

  // Generate HTML template with React, TailwindCSS, and error handling
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>

  <!-- TailwindCSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- React and ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

  <!-- Babel Standalone for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #root {
      min-height: 100vh;
    }

    .error-boundary {
      padding: 2rem;
      background-color: #fee;
      border: 2px solid #fcc;
      border-radius: 8px;
      margin: 1rem;
    }

    .error-boundary h2 {
      color: #c00;
      margin-top: 0;
    }

    .error-boundary pre {
      background-color: #fff;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo, useRef } = React;

    // Mock data provided by the preview system
    const mockData = ${JSON.stringify(mockData, null, 2)};

    // Error Boundary Component
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true };
      }

      componentDidCatch(error, errorInfo) {
        this.setState({
          error: error,
          errorInfo: errorInfo
        });

        // Send error to parent window
        window.parent.postMessage({
          type: 'error',
          message: error.toString(),
          stack: error.stack
        }, '*');
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="error-boundary">
              <h2>Component Error</h2>
              <pre>{this.state.error && this.state.error.toString()}</pre>
              <details style={{ marginTop: '1rem' }}>
                <summary>Stack Trace</summary>
                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </details>
            </div>
          );
        }

        return this.props.children;
      }
    }

    // Wrapper to catch runtime errors
    window.onerror = function(message, source, lineno, colno, error) {
      window.parent.postMessage({
        type: 'error',
        message: message,
        source: source,
        line: lineno,
        column: colno
      }, '*');
      return false;
    };

    // User component code
    try {
      ${sanitizedCode}

      // Find the component to render
      // Look for default export or the last declared component
      const componentToRender = typeof Component !== 'undefined' ? Component :
                               typeof App !== 'undefined' ? App :
                               null;

      if (componentToRender) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
          <ErrorBoundary>
            <React.StrictMode>
              {React.createElement(componentToRender, { mockData })}
            </React.StrictMode>
          </ErrorBoundary>
        );
      } else {
        throw new Error('No component found. Please export a component named "Component" or "App".');
      }

      // Notify parent that rendering succeeded
      window.parent.postMessage({ type: 'ready' }, '*');

    } catch (error) {
      // Render error in the preview
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <div className="error-boundary">
          <h2>Compilation Error</h2>
          <pre>{error.toString()}</pre>
        </div>
      );

      // Send error to parent
      window.parent.postMessage({
        type: 'error',
        message: error.toString(),
        stack: error.stack
      }, '*');
    }
  </script>
</body>
</html>
  `.trim();

  return html;
}

/**
 * Generates a preview URL for a component
 * @param componentId - The unique identifier for the component
 * @param baseUrl - The base URL for the preview system
 * @returns The full preview URL
 */
export function generatePreviewUrl(
  componentId: string,
  baseUrl: string = ''
): string {
  return `${baseUrl}/preview/${componentId}`;
}

/**
 * Extracts component name from code
 * @param code - The React component code
 * @returns The extracted component name or null
 */
export function extractComponentName(code: string): string | null {
  // Try to find function component declaration
  const functionMatch = code.match(/(?:export\s+default\s+)?function\s+(\w+)/);
  if (functionMatch) return functionMatch[1];

  // Try to find const/let/var component declaration
  const constMatch = code.match(/(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=/);
  if (constMatch) return constMatch[1];

  // Try to find class component declaration
  const classMatch = code.match(/(?:export\s+default\s+)?class\s+(\w+)/);
  if (classMatch) return classMatch[1];

  return null;
}

/**
 * Transforms TypeScript/JSX code to plain JavaScript
 * This is a simple transformation - in production, use proper build tools
 * @param code - The TypeScript/JSX code
 * @returns Transformed JavaScript code
 */
export function transformCode(code: string): string {
  // Remove TypeScript type annotations (basic)
  let transformed = code
    .replace(/:\s*\w+(\[\])?(\s*[=,\)])/g, '$2') // Remove type annotations
    .replace(/interface\s+\w+\s*{[^}]*}/g, '') // Remove interfaces
    .replace(/type\s+\w+\s*=[^;]+;/g, '') // Remove type aliases
    .replace(/<(\w+)>/g, '') // Remove generic type parameters
    .replace(/as\s+\w+/g, ''); // Remove type assertions

  return transformed;
}

/**
 * Creates a blob URL for the preview HTML
 * @param html - The HTML content
 * @returns Blob URL
 */
export function createPreviewBlobUrl(html: string): string {
  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}

/**
 * Validates if code contains a valid React component
 * @param code - The code to validate
 * @returns True if code appears to contain a React component
 */
export function isValidReactComponent(code: string): boolean {
  // Check for common React patterns
  const hasReactImport = /import.*React/.test(code);
  const hasFunctionComponent = /function\s+\w+.*{/.test(code);
  const hasArrowComponent = /const\s+\w+\s*=\s*\(.*\)\s*=>/.test(code);
  const hasClassComponent = /class\s+\w+\s+extends\s+React\.Component/.test(code);
  const hasJSX = /<\w+/.test(code);

  return (
    (hasFunctionComponent || hasArrowComponent || hasClassComponent) &&
    hasJSX
  );
}
