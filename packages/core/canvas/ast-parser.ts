/**
 * Simplified AST Parser - Parses and manipulates JSX components
 * Note: This is a simplified version for the prototype
 * Production version would use @babel/parser
 */

import type { ElementNode, ParsedComponent, ComponentMetadata } from '../types';

// ============================================================================
// Simple JSX Parser (Prototype)
// ============================================================================

export class ASTParser {
  /**
   * Parse JSX code into element tree (simplified for prototype)
   */
  parse(code: string): ParsedComponent {
    // For prototype, we'll create a mock AST from the code
    // In production, use @babel/parser

    const ast = this.parseJSXElement(code);
    const metadata = this.extractMetadata(code);

    return {
      ast,
      originalCode: code,
      language: code.includes('interface') || code.includes(': React') ? 'tsx' : 'jsx',
      metadata,
    };
  }

  /**
   * Parse JSX into element nodes (simplified)
   */
  private parseJSXElement(code: string, path: number[] = []): ElementNode {
    // This is a simplified parser for the prototype
    // It identifies common elements and creates a selectable tree

    const elements: ElementNode[] = [];
    let idCounter = 0;

    // Extract JSX return statement
    const returnMatch = code.match(/return\s*\(([\s\S]*)\);/);
    const jsxCode = returnMatch ? returnMatch[1] : code;

    // Parse common elements
    const patterns = [
      { regex: /<button[^>]*>(.*?)<\/button>/gi, type: 'button' },
      { regex: /<input[^>]*\/?>/gi, type: 'input' },
      { regex: /<div[^>]*>(.*?)<\/div>/gi, type: 'div' },
      { regex: /<h1[^>]*>(.*?)<\/h1>/gi, type: 'h1' },
      { regex: /<h2[^>]*>(.*?)<\/h2>/gi, type: 'h2' },
      { regex: /<h3[^>]*>(.*?)<\/h3>/gi, type: 'h3' },
      { regex: /<p[^>]*>(.*?)<\/p>/gi, type: 'p' },
      { regex: /<span[^>]*>(.*?)<\/span>/gi, type: 'span' },
      { regex: /<form[^>]*>(.*?)<\/form>/gi, type: 'form' },
      { regex: /<label[^>]*>(.*?)<\/label>/gi, type: 'label' },
    ];

    // Create a root node
    const rootNode: ElementNode = {
      id: 'root',
      type: 'div',
      props: { className: 'root-container' },
      children: [],
      path: [],
      metadata: {
        editable: false,
        selectable: false,
        deletable: false,
      },
    };

    // Find all elements
    patterns.forEach(({ regex, type }) => {
      const matches = Array.from(jsxCode.matchAll(regex));

      matches.forEach((match, index) => {
        const fullMatch = match[0];
        const content = match[1] || '';

        // Extract props
        const props = this.extractProps(fullMatch);

        // Extract text content
        const textContent = content.replace(/<[^>]*>/g, '').trim();

        const node: ElementNode = {
          id: `${type}-${idCounter++}`,
          type,
          props,
          children: textContent ? [textContent] : [],
          path: [rootNode.children.length],
          metadata: {
            editable: true,
            selectable: true,
            deletable: true,
          },
        };

        rootNode.children.push(node);
      });
    });

    return rootNode;
  }

  /**
   * Extract props from JSX element string
   */
  private extractProps(elementString: string): Record<string, any> {
    const props: Record<string, any> = {};

    // Extract className
    const classMatch = elementString.match(/className=["']([^"']*)["']/);
    if (classMatch) {
      props.className = classMatch[1];
    }

    // Extract type
    const typeMatch = elementString.match(/type=["']([^"']*)["']/);
    if (typeMatch) {
      props.type = typeMatch[1];
    }

    // Extract placeholder
    const placeholderMatch = elementString.match(/placeholder=["']([^"']*)["']/);
    if (placeholderMatch) {
      props.placeholder = placeholderMatch[1];
    }

    // Extract disabled
    if (elementString.includes('disabled')) {
      props.disabled = true;
    }

    return props;
  }

  /**
   * Extract component metadata
   */
  private extractMetadata(code: string): ComponentMetadata {
    // Extract component name
    const nameMatch = code.match(/(?:export\s+default\s+)?function\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : 'Component';

    // Extract imports
    const importMatches = Array.from(code.matchAll(/import\s+{([^}]+)}\s+from\s+["']([^"']+)["']/g));
    const imports = importMatches.map(match => ({
      specifiers: match[1].split(',').map(s => s.trim()),
      source: match[2],
    }));

    return {
      name,
      exports: [name],
      imports,
    };
  }

  /**
   * Update specific element in AST
   */
  updateElement(
    component: ParsedComponent,
    elementId: string,
    updates: Partial<ElementNode>
  ): ParsedComponent {
    const updatedAst = this.cloneNode(component.ast);
    const element = this.findElementById(updatedAst, elementId);

    if (element) {
      Object.assign(element, updates);
    }

    // Regenerate code
    const newCode = this.generate(component, updatedAst);

    return {
      ...component,
      ast: updatedAst,
      originalCode: newCode,
    };
  }

  /**
   * Find element by ID
   */
  private findElementById(node: ElementNode, id: string): ElementNode | null {
    if (node.id === id) {
      return node;
    }

    for (const child of node.children) {
      if (typeof child !== 'string') {
        const found = this.findElementById(child, id);
        if (found) return found;
      }
    }

    return null;
  }

  /**
   * Clone element node
   */
  private cloneNode(node: ElementNode): ElementNode {
    return {
      ...node,
      props: { ...node.props },
      children: node.children.map(child =>
        typeof child === 'string' ? child : this.cloneNode(child)
      ),
      metadata: { ...node.metadata },
    };
  }

  /**
   * Generate code from AST (simplified)
   */
  generate(component: ParsedComponent, ast?: ElementNode): string {
    // For prototype, return original code with inline comments
    // In production, use @babel/generator

    const elementTree = ast || component.ast;

    // For now, return a modified version with data attributes
    let code = component.originalCode;

    // Add data-element-id attributes for selection
    elementTree.children.forEach(child => {
      if (typeof child !== 'string' && child.metadata?.selectable) {
        const pattern = new RegExp(`<${child.type}([^>]*)>`, 'g');
        code = code.replace(pattern, `<${child.type}$1 data-element-id="${child.id}">`);
      }
    });

    return code;
  }

  /**
   * Get editable properties for element
   */
  getEditableProps(element: ElementNode): Array<{
    key: string;
    type: 'string' | 'number' | 'color' | 'boolean' | 'enum';
    value: any;
    label: string;
    options?: string[];
  }> {
    const props: any[] = [];

    // Text content
    const textContent = element.children.find(c => typeof c === 'string');
    if (textContent) {
      props.push({
        key: 'text',
        type: 'string',
        value: textContent,
        label: 'Text',
      });
    }

    // className
    if (element.props.className) {
      props.push({
        key: 'className',
        type: 'string',
        value: element.props.className,
        label: 'CSS Classes',
      });
    }

    // Button-specific
    if (element.type === 'button') {
      props.push({
        key: 'disabled',
        type: 'boolean',
        value: element.props.disabled || false,
        label: 'Disabled',
      });
    }

    // Input-specific
    if (element.type === 'input') {
      props.push({
        key: 'type',
        type: 'enum',
        value: element.props.type || 'text',
        label: 'Input Type',
        options: ['text', 'email', 'password', 'number', 'tel'],
      });

      if (element.props.placeholder) {
        props.push({
          key: 'placeholder',
          type: 'string',
          value: element.props.placeholder,
          label: 'Placeholder',
        });
      }
    }

    return props;
  }
}

// ============================================================================
// Export
// ============================================================================

export const astParser = new ASTParser();
