# Interactive Canvas System

## Overview

The **Interactive Canvas** transforms the preview into an editable workspace where users can click elements, edit properties, and see changes in real-time—no code knowledge required.

## Vision

```
Instead of:                    With Interactive Canvas:
┌──────────────┐              ┌──────────────┬──────────────┐
│   Preview    │              │   Preview    │  Inspector   │
│              │              │              │              │
│  [Component] │   →→→→       │  [Click me!] │  ✨ Text:    │
│              │              │              │     Edit... │
│              │              │              │              │
│              │              │              │  🎨 Color:   │
│              │              │              │     Blue    │
└──────────────┘              └──────────────┴──────────────┘
     User sees it                  User edits visually!
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Interactive Canvas                        │
├─────────────────────┬───────────────────┬───────────────────┤
│                     │                   │                   │
│   AST Parser        │  Selection       │  Property         │
│                     │  Manager         │  Inspector        │
│  • Parse JSX        │  • Click handler │  • Edit props     │
│  • Build tree       │  • Highlight     │  • AI suggest     │
│  • Update nodes     │  • Track state   │  • Live update    │
│  • Generate code    │                  │                   │
│                     │                  │                   │
└─────────────────────┴───────────────────┴───────────────────┘
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │  Interactive Preview   │
                  │  • Render component    │
                  │  • Inject handlers     │
                  │  • Update on change    │
                  └────────────────────────┘
```

## Core Components

### 1. AST Parser

**Location:** `packages/core/canvas/ast-parser.ts`

**Purpose:** Parse JSX code into editable element tree

**Key Features:**
- Parses JSX/TSX into structured tree
- Tracks element IDs for selection
- Extracts editable properties
- Updates specific elements without full regeneration
- Generates code from modified AST

**Example:**

```typescript
import { ASTParser } from '@vibecode/core/canvas';

const parser = new ASTParser();

// Parse component
const parsed = parser.parse(componentCode);
// {
//   ast: { id: 'root', type: 'div', children: [...] },
//   originalCode: '...',
//   metadata: { name: 'LoginForm', imports: [...] }
// }

// Update specific element
const updated = parser.updateElement(parsed, 'button-0', {
  props: { children: 'Sign In Now!' }
});

// Generate new code
const newCode = parser.generate(updated);
```

**Element Node Structure:**

```typescript
interface ElementNode {
  id: string;                    // 'button-0', 'input-1'
  type: string;                  // 'button', 'input', 'div'
  props: Record<string, any>;    // { className: '...', onClick: ... }
  children: (ElementNode | string)[];
  path: number[];                // [0, 2, 1] - location in tree
  metadata?: {
    editable: boolean;
    selectable: boolean;
    deletable: boolean;
  };
}
```

### 2. Selection Manager

**Location:** `packages/core/canvas/selection-manager.ts`

**Purpose:** Handle element selection and highlighting in preview

**Key Features:**
- Injects click/hover handlers into iframe
- Draws selection overlays
- Tracks selection state
- Event-driven architecture
- Cleanup and memory management

**Example:**

```typescript
import { createSelectionManager } from '@vibecode/core/canvas';

const selectionManager = createSelectionManager();

// Attach to preview iframe
selectionManager.attachToPreview(iframeElement);

// Subscribe to selection changes
selectionManager.subscribe('my-component', (state) => {
  console.log('Selected:', state.selectedId);
  console.log('Hovered:', state.hoveredId);
});

// Programmatic selection
selectionManager.highlightElement('button-0', 'selected');

// Deselect
selectionManager.deselect();

// Cleanup
selectionManager.destroy();
```

**Selection State:**

```typescript
interface SelectionState {
  selectedId: string | null;      // Currently selected element
  hoveredId: string | null;       // Currently hovered element
  highlightedIds: string[];       // All highlighted elements
}
```

**Visual Feedback:**
- **Selected:** Blue border with label
- **Hovered:** Purple border (semi-transparent)
- **Transition:** Smooth animations

### 3. Interactive Preview

**Location:** `app/components/canvas/InteractivePreview.tsx`

**Purpose:** Render component with selection capabilities

**Key Features:**
- Multi-viewport support (mobile/tablet/desktop)
- Orientation toggle
- Sandboxed iframe rendering
- Selection overlay integration
- Real-time updates

**Example:**

```tsx
import { InteractivePreview } from '@/app/components/canvas/InteractivePreview';

<InteractivePreview
  code={componentCode}
  onElementSelect={(elementId) => {
    console.log('User clicked:', elementId);
    openInspector(elementId);
  }}
/>
```

**Viewport Sizes:**

| Viewport | Width | Height | Device |
|----------|-------|--------|--------|
| Mobile | 375px | 667px | iPhone |
| Tablet | 768px | 1024px | iPad |
| Desktop | 1440px | 900px | Laptop |

### 4. Element Inspector

**Location:** `app/components/canvas/ElementInspector.tsx`

**Purpose:** Property editing panel for selected element

**Key Features:**
- Context-aware property editors
- AI suggestions per element
- "Ask AI to edit" chat
- Category grouping (style/content/behavior)
- Real-time validation

**Example:**

```tsx
import { ElementInspector } from '@/app/components/canvas/ElementInspector';

<ElementInspector
  element={selectedElement}
  onUpdate={(elementId, property, value) => {
    // Update element property
    updateAST(elementId, property, value);
  }}
  onClose={() => {
    deselectElement();
  }}
/>
```

**Property Types:**

```typescript
type PropertyType =
  | 'string'   // Text input
  | 'number'   // Number input
  | 'color'    // Color picker
  | 'boolean'  // Toggle switch
  | 'enum';    // Dropdown select
```

**Property Editor Examples:**

```tsx
// String property
<PropertyEditor
  prop={{
    key: 'text',
    type: 'string',
    value: 'Sign In',
    label: 'Button Text'
  }}
  onChange={(value) => updateProp('text', value)}
/>

// Boolean property
<PropertyEditor
  prop={{
    key: 'disabled',
    type: 'boolean',
    value: false,
    label: 'Disabled'
  }}
  onChange={(value) => updateProp('disabled', value)}
/>

// Enum property
<PropertyEditor
  prop={{
    key: 'variant',
    type: 'enum',
    value: 'primary',
    label: 'Style',
    options: ['primary', 'secondary', 'outline']
  }}
  onChange={(value) => updateProp('variant', value)}
/>
```

## Complete Flow

### 1. Component Generation

```
User: "Create a login form"
   ↓
Proactive Agent generates code
   ↓
ASTParser parses into element tree
   ↓
InteractivePreview renders with data-element-id attributes
```

### 2. Element Selection

```
User clicks button in preview
   ↓
SelectionManager captures click event
   ↓
Draws blue highlight overlay
   ↓
Notifies subscribers with element ID
   ↓
ElementInspector opens with properties
```

### 3. Property Edit

```
User changes "Sign In" to "Log In"
   ↓
Inspector calls onUpdate(elementId, 'text', 'Log In')
   ↓
ASTParser updates element node
   ↓
Generates new code
   ↓
Preview re-renders with changes
```

## AI-Powered Editing

### Smart Suggestions

The inspector provides context-aware suggestions:

**For Buttons:**
- "Add loading state"
- "Make it larger"
- "Change to outline style"

**For Inputs:**
- "Add validation"
- "Make it full width"
- "Add an icon"

**For Headings:**
- "Make it bold"
- "Add gradient text"
- "Center align"

### AI Chat in Inspector

Users can ask the AI to edit elements in natural language:

```
User: "Make this button bigger and green"
   ↓
AI analyzes request + element context
   ↓
Updates multiple properties:
   - size: 'lg'
   - backgroundColor: 'green-600'
   ↓
Preview updates automatically
```

**Examples:**
- "Make it blue"
- "Add a shadow"
- "Center this"
- "Make the text bigger"
- "Add rounded corners"

## Demo Page

**Location:** `app/(workspace)/canvas-demo/page.tsx`

### Features

1. **View Modes:**
   - Preview only
   - Split view (preview + code)
   - Code only

2. **Interactive Elements:**
   - Click any element to select
   - Hover shows preview highlight
   - Inspector opens automatically

3. **Live Editing:**
   - Change properties in inspector
   - See updates in real-time
   - Code updates automatically

4. **Multi-Viewport:**
   - Switch between mobile/tablet/desktop
   - Rotate orientation
   - Refresh preview

### Try It

1. Navigate to `/canvas-demo`
2. Click the "Sign In" button
3. Change text to "Login"
4. See it update immediately
5. Click an input field
6. Change placeholder
7. Toggle between viewports

## Editable Properties by Element

### Button
- `text` (string) - Button label
- `disabled` (boolean) - Enable/disable
- `variant` (enum) - Style variant
- `size` (enum) - Button size
- `className` (string) - CSS classes

### Input
- `type` (enum) - Input type (email, password, etc.)
- `placeholder` (string) - Placeholder text
- `disabled` (boolean) - Enable/disable
- `className` (string) - CSS classes

### Heading (h1, h2, h3)
- `text` (string) - Heading text
- `className` (string) - CSS classes

### Div/Container
- `className` (string) - CSS classes

### Label
- `text` (string) - Label text
- `className` (string) - CSS classes

## Advanced Features (Roadmap)

### Component History
Track changes over time:
```
○ Now      "Made button blue"
│
○ 5 min    "Added shadow"
│
○ 10 min   "Changed text"
```

### Drag & Drop
Rearrange elements visually:
```
[Login Form]
  ├─ [Email Input]  ← Drag here
  ├─ [Button]       ↓
  └─ [Password]     ← Was here
```

### Styles Panel
Visual CSS editor:
```
┌──────────────────┐
│ 📐 Layout        │
│  Padding: 16px   │
│  Margin: 8px     │
│                  │
│ 🎨 Colors        │
│  Background: ... │
│  Text: ...       │
│                  │
│ 📝 Typography    │
│  Font: ...       │
│  Size: 16px      │
└──────────────────┘
```

### Component Library
Save edited components:
```
My Components
  ├─ Custom Login Button
  ├─ Fancy Input
  └─ Card with Shadow
```

## Integration with Proactive Agent

The canvas works seamlessly with the proactive agent:

```
User: "Create a login form"
   ↓
Agent asks questions
   ↓
User answers
   ↓
Agent generates code
   ↓
Code opens in Interactive Canvas
   ↓
User clicks "Sign In" button
   ↓
Inspector opens
   ↓
User changes to "Login"
   ↓
Preview updates
   ↓
User says: "Make it green"
   ↓
AI updates button color
   ↓
Preview updates
   ↓
User exports project
```

## Non-Programmer Experience

### Hide Complexity

**Bad (Code-First):**
```
Code Editor
function Button() {
  return <button className="...">
    Sign In
  </button>
}

User: 😰 "What is className?"
```

**Good (Visual-First):**
```
Preview                Inspector
[Sign In Button] →     Text: "Sign In"
                       Color: Blue
                       Size: Large

User: 😊 "I can edit this!"
```

### Plain Language

**Property Labels:**
- ✅ "Button Text" (not "children prop")
- ✅ "Background Color" (not "backgroundColor")
- ✅ "Disabled" (not "disabled={true}")

**AI Suggestions:**
- ✅ "Make it bigger"
- ✅ "Add a shadow"
- ✅ "Change to green"

**Error Messages:**
- ❌ "SyntaxError: Unexpected token"
- ✅ "Oops! Let's try that again"

## Best Practices

### For Developers

1. **Always add data-element-id to generated code**
   ```typescript
   <button data-element-id="button-0">
     Sign In
   </button>
   ```

2. **Make properties editable by default**
   ```typescript
   metadata: {
     editable: true,      // ✅ Allow editing
     selectable: true,    // ✅ Allow selection
     deletable: true      // ✅ Allow deletion
   }
   ```

3. **Provide smart defaults**
   ```typescript
   {
     key: 'variant',
     type: 'enum',
     options: ['primary', 'secondary', 'outline'],
     default: 'primary'  // ✅ Sensible default
   }
   ```

4. **Validate property changes**
   ```typescript
   {
     key: 'email',
     type: 'string',
     validation: (value) => {
       if (!value.includes('@')) {
         return 'Must be a valid email';
       }
       return true;
     }
   }
   ```

### For Users

1. **Click elements to edit**
   - Click any element in the preview
   - Inspector opens automatically

2. **Use AI chat for complex edits**
   - "Make this form responsive"
   - "Add validation to email"

3. **Try different viewports**
   - See how it looks on mobile
   - Test on tablet and desktop

## API Reference

### ASTParser

```typescript
class ASTParser {
  parse(code: string): ParsedComponent;
  updateElement(component: ParsedComponent, elementId: string, updates: Partial<ElementNode>): ParsedComponent;
  generate(component: ParsedComponent, ast?: ElementNode): string;
  getEditableProps(element: ElementNode): EditableProp[];
}
```

### SelectionManager

```typescript
class SelectionManager {
  attachToPreview(iframe: HTMLIFrameElement): void;
  highlightElement(elementId: string, type: 'selected' | 'hovered'): void;
  deselect(): void;
  getState(): SelectionState;
  subscribe(id: string, callback: (state: SelectionState) => void): void;
  unsubscribe(id: string): void;
  destroy(): void;
}
```

## Troubleshooting

### Elements not selectable

**Issue:** Clicking elements doesn't select them

**Solution:**
```typescript
// Ensure data-element-id is added
<button data-element-id="button-0">
  Click me
</button>
```

### Selection overlay not visible

**Issue:** No highlight appears on selection

**Solution:**
```typescript
// Ensure iframe is loaded before attaching
iframe.addEventListener('load', () => {
  selectionManager.attachToPreview(iframe);
});
```

### Property changes not reflecting

**Issue:** Inspector changes don't update preview

**Solution:**
```typescript
// Ensure onUpdate regenerates code and re-renders
const handleUpdate = (elementId, property, value) => {
  const updated = astParser.updateElement(parsed, elementId, {
    props: { ...element.props, [property]: value }
  });

  const newCode = astParser.generate(updated);
  setCode(newCode);  // Trigger re-render
};
```

## Examples

See [examples/canvas/](../examples/canvas/) for:
- Custom property editors
- Advanced selection modes
- Component history implementation
- Drag & drop integration

---

**Next:** See [PROACTIVE_AGENT.md](./PROACTIVE_AGENT.md) to learn about the AI question system.
