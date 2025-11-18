# Export System Architecture

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ChatContainer.tsx                                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │                                                      │    │
│  │  [Export Project Button] ──────────┐               │    │
│  │                                     │               │    │
│  │                                     ▼               │    │
│  │                            ┌─────────────────┐     │    │
│  │                            │  ExportModal    │     │    │
│  │                            │  ┌───────────┐ │     │    │
│  │                            │  │ Options:  │ │     │    │
│  │                            │  │ - Name    │ │     │    │
│  │                            │  │ - TS/JS   │ │     │    │
│  │                            │  │ - Mocks   │ │     │    │
│  │                            │  │ - Docs    │ │     │    │
│  │                            │  │ - Tests   │ │     │    │
│  │                            │  └───────────┘ │     │    │
│  │                            │                 │     │    │
│  │                            │  [Export] ──────┼─┐   │    │
│  │                            └─────────────────┘ │   │    │
│  └────────────────────────────────────────────────┼───┘    │
└─────────────────────────────────────────────────────┼────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────┐
│                      React Hook Layer                         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  useExport()                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Manages export state                              │   │
│  │  • Tracks progress                                   │   │
│  │  • Calls API                                         │   │
│  │  • Triggers download                                 │   │
│  └──────────────────────────────────┬───────────────────┘   │
└────────────────────────────────────────┼──────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────┐
│                      API Layer                                │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  POST /api/export                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Receive project + options                        │   │
│  │  2. Call projectExporter.ts                          │   │
│  │  3. Generate all files                               │   │
│  │  4. Create ZIP                                       │   │
│  │  5. Return blob                                      │   │
│  └──────────────────────────┬───────────────────────────┘   │
└────────────────────────────────────┼──────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                  Export Core Logic                            │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  projectExporter.ts                                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │  exportProject()                                      │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Stage 1: Preparing (0%)                      │   │   │
│  │  │ ─────────────────────────────────────        │   │   │
│  │  │ • Initialize export                          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                   │                                   │   │
│  │                   ▼                                   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Stage 2: Generating (20-65%)                 │   │   │
│  │  │ ─────────────────────────────────────        │   │   │
│  │  │ • generateProjectFiles()                     │   │   │
│  │  │   ├─► templates.ts ─► Configuration files   │   │   │
│  │  │   │   ├─ package.json                        │   │   │
│  │  │   │   ├─ tsconfig.json                       │   │   │
│  │  │   │   ├─ next.config.js                      │   │   │
│  │  │   │   ├─ tailwind.config.ts                  │   │   │
│  │  │   │   └─ .gitignore, .env.example, etc.     │   │   │
│  │  │   │                                           │   │   │
│  │  │   ├─► templates.ts ─► App structure          │   │   │
│  │  │   │   ├─ app/layout.tsx                      │   │   │
│  │  │   │   ├─ app/page.tsx                        │   │   │
│  │  │   │   └─ app/globals.css                     │   │   │
│  │  │   │                                           │   │   │
│  │  │   ├─► Project files ─► Components            │   │   │
│  │  │   │   └─ All custom components               │   │   │
│  │  │   │                                           │   │   │
│  │  │   ├─► templates.ts ─► Mock data (optional)   │   │   │
│  │  │   │   └─ lib/mock/data.ts                    │   │   │
│  │  │   │                                           │   │   │
│  │  │   └─► templates.ts ─► Tests (optional)       │   │   │
│  │  │       └─ __tests__/example.test.tsx          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                   │                                   │   │
│  │                   ▼                                   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Stage 3: Bundling (70-90%)                   │   │   │
│  │  │ ─────────────────────────────────────        │   │   │
│  │  │ • zipGenerator.ts                            │   │   │
│  │  │   ├─ createZipFromFiles()                    │   │   │
│  │  │   ├─ DEFLATE compression (level 9)           │   │   │
│  │  │   └─ Generate blob                           │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                   │                                   │   │
│  │                   ▼                                   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Stage 4: Complete (100%)                     │   │   │
│  │  │ ─────────────────────────────────────        │   │   │
│  │  │ • Return ExportResult                        │   │   │
│  │  │   ├─ blob: Blob                              │   │   │
│  │  │   ├─ filename: string                        │   │   │
│  │  │   ├─ totalSize: number                       │   │   │
│  │  │   └─ fileCount: number                       │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └────────────────────────┬───────────────────────────┘   │
└────────────────────────────────┼──────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────┐
│                  Download Utilities                           │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  download.ts                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  downloadFile()                                       │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ 1. Create object URL from blob                 │ │   │
│  │  │ 2. Create <a> element                          │ │   │
│  │  │ 3. Set download attribute                      │ │   │
│  │  │ 4. Trigger click                               │ │   │
│  │  │ 5. Cleanup                                     │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬─────────────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  Browser Save   │
                            │  Dialog Opens   │
                            └─────────────────┘
```

## Data Flow

```
User Input ──► UI Component ──► Hook ──► API ──► Core Logic ──► Browser
   │              │               │        │         │             │
   │              │               │        │         │             │
   ▼              ▼               ▼        ▼         ▼             ▼
Options      ExportModal    useExport   /api/   projectExporter  Download
                │               │       export       │
                │               │         │          │
                └───────────────┴─────────┴──────────┘
                         Progress Updates
```

## State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Application State                      │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  Project Store (Zustand)                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  • projects: Project[]                             │  │
│  │  • activeProject: Project | null                   │  │
│  │  • createProject()                                 │  │
│  │  • updateProject()                                 │  │
│  │  • deleteProject()                                 │  │
│  └────────────────────────┬───────────────────────────┘  │
└────────────────────────────────┼──────────────────────────┘
                                 │
                                 │ Used by
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────┐
│                    Export Hook State                      │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  useExport()                                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │  State:                                            │  │
│  │  • progress: ExportProgress | null                 │  │
│  │  • isExporting: boolean                            │  │
│  │  • error: string | null                            │  │
│  │                                                     │  │
│  │  Methods:                                          │  │
│  │  • exportProject()                                 │  │
│  │  • reset()                                         │  │
│  └────────────────────────┬───────────────────────────┘  │
└────────────────────────────────┼──────────────────────────┘
                                 │
                                 │ Updates
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────┐
│                    UI State                               │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  Component Local State                                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  • isExportModalOpen: boolean                      │  │
│  │  • exportOptions: ExportOptions                    │  │
│  │  • errors: Record<string, string>                  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Type System

```
┌──────────────────────────────────────────────────────────┐
│                    Core Types                             │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ExportOptions                                            │
│  ├─ projectName: string                                   │
│  ├─ includeMockData: boolean                              │
│  ├─ includeDocs: boolean                                  │
│  ├─ includeTests: boolean                                 │
│  ├─ typescript: boolean                                   │
│  └─ format: 'zip'                                         │
│                                                            │
│  ExportProgress                                           │
│  ├─ stage: 'preparing' | 'generating' | 'bundling' |      │
│  │         'downloading' | 'complete' | 'error'           │
│  ├─ progress: number (0-100)                              │
│  ├─ message: string                                       │
│  └─ currentFile?: string                                  │
│                                                            │
│  ExportResult                                             │
│  ├─ blob: Blob                                            │
│  ├─ filename: string                                      │
│  ├─ totalSize: number                                     │
│  ├─ fileCount: number                                     │
│  └─ files: ExportFile[]                                   │
│                                                            │
│  ExportFile                                               │
│  ├─ path: string                                          │
│  ├─ content: string                                       │
│  └─ size: number                                          │
│                                                            │
│  FileTreeNode                                             │
│  ├─ name: string                                          │
│  ├─ path: string                                          │
│  ├─ type: 'file' | 'directory'                            │
│  ├─ size?: number                                         │
│  ├─ children?: FileTreeNode[]                             │
│  └─ included: boolean                                     │
└──────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
ChatContainer
│
├─── ExportButton
│    └─── [Progress Bar]
│
└─── ExportModal
     │
     ├─── Header
     │    ├─── Icon
     │    ├─── Title
     │    └─── Close Button
     │
     ├─── Content
     │    ├─── Progress Indicator (conditional)
     │    ├─── Success Message (conditional)
     │    ├─── Project Name Input
     │    │    └─── Error Message (conditional)
     │    │
     │    ├─── Export Options
     │    │    ├─── TypeScript Checkbox
     │    │    ├─── Mock Data Checkbox
     │    │    ├─── Documentation Checkbox
     │    │    └─── Tests Checkbox
     │    │
     │    └─── Export Format Display
     │
     └─── Footer
          ├─── Cancel Button
          └─── Export Button
```

## File Dependencies

```
ChatContainer.tsx
├── imports ExportButton from components/export
├── imports ExportModal from components/export
├── imports useExport from hooks/useExport
└── imports useProjectStore from lib/stores/project-store

ExportButton.tsx
├── imports ExportProgress from lib/export/types
└── imports icons from lucide-react

ExportModal.tsx
├── imports ExportOptions from lib/export/types
├── imports ExportProgress from lib/export/types
├── imports formatFileSize from lib/utils/download
└── imports icons from lucide-react

ExportPreview.tsx
├── imports FileTreeNode from lib/export/types
├── imports formatFileSize from lib/utils/download
└── imports icons from lucide-react

useExport.ts
├── imports Project from lib/stores/project-store
├── imports ExportOptions from lib/export/types
├── imports ExportProgress from lib/export/types
└── imports downloadFile from lib/utils/download

/api/export/route.ts
├── imports ExportOptions from lib/export/types
├── imports all generators from lib/export/templates
└── imports JSZip from jszip

projectExporter.ts
├── imports Project from lib/stores/project-store
├── imports ExportOptions, ExportFile, ExportResult, ExportProgress from ./types
├── imports all generators from ./templates
└── imports createZipFromFiles from ./zipGenerator

zipGenerator.ts
├── imports ExportFile from ./types
└── imports JSZip from jszip

templates.ts
├── imports Project from lib/stores/project-store
└── imports ExportOptions from ./types
```

## Module Organization

```
/lib/export/          (Core export logic)
    ├── types.ts         → Type definitions
    ├── projectExporter  → Main orchestrator
    ├── zipGenerator     → ZIP utilities
    ├── templates        → Template generators
    └── index.ts         → Public exports

/components/export/   (UI components)
    ├── ExportButton     → Trigger button
    ├── ExportModal      → Configuration dialog
    ├── ExportPreview    → File tree preview
    └── index.ts         → Component exports

/hooks/               (React hooks)
    └── useExport        → Export management hook

/lib/utils/           (Shared utilities)
    └── download         → Browser download utilities

/app/api/export/      (API endpoints)
    └── route.ts         → Export API handler
```

## Security Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Request Layer                        │
├──────────────────────────────────────────────────────┤
│  • HTTPS only                                         │
│  • Content-Type validation                            │
│  • Request size limits                                │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│                Validation Layer                       │
├──────────────────────────────────────────────────────┤
│  • Project data validation                            │
│  • Options validation                                 │
│  • File path sanitization                             │
│  • Prevent directory traversal                        │
│  • Reject absolute paths                              │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│              Processing Layer                         │
├──────────────────────────────────────────────────────┤
│  • Template generation (no user input)                │
│  • Safe file operations                               │
│  • No code execution                                  │
│  • Isolated ZIP creation                              │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│                Response Layer                         │
├──────────────────────────────────────────────────────┤
│  • Proper MIME types                                  │
│  • Content-Disposition headers                        │
│  • Resource cleanup                                   │
│  • Error sanitization                                 │
└──────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌──────────────────────────────────────────────────────┐
│              Optimization Strategies                  │
├──────────────────────────────────────────────────────┤
│                                                        │
│  1. Streaming                                         │
│     • Generate files on-demand                        │
│     • Don't hold all in memory                        │
│                                                        │
│  2. Compression                                       │
│     • DEFLATE level 9                                 │
│     • ~35% size reduction                             │
│                                                        │
│  3. Progress Tracking                                 │
│     • Prevent UI blocking                             │
│     • User feedback                                   │
│                                                        │
│  4. Async Operations                                  │
│     • Non-blocking file generation                    │
│     • Async ZIP creation                              │
│                                                        │
│  5. Resource Cleanup                                  │
│     • Revoke object URLs                              │
│     • Clear temporary data                            │
│     • Auto-reset state                                │
└──────────────────────────────────────────────────────┘
```

## Error Handling Strategy

```
Try/Catch Boundaries:

API Route
├── Request validation
│   └── 400: Bad Request
├── Project validation
│   └── 400: Invalid project data
├── File generation
│   └── 500: Generation failed
├── ZIP creation
│   └── 500: Compression failed
└── Response
    └── 500: Unknown error

useExport Hook
├── Network errors
│   └── Display error message
├── API errors
│   └── Display API error
├── Download errors
│   └── Display download error
└── State
    └── Set error state

Component Level
├── Input validation
│   └── Show inline errors
├── Loading states
│   └── Disable interactions
└── Error display
    └── User-friendly messages
```

This architecture provides a robust, scalable, and maintainable export system with clear separation of concerns and comprehensive error handling.
