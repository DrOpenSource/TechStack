import { faker } from "@faker-js/faker";
import { Project, ProjectFile } from "@/lib/stores/project-store";

export function generateMockProject(data: {
  name: string;
  description: string;
}): Project {
  const id = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    name: data.name,
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date(),
    files: generateMockFiles(),
    previewUrl: undefined,
  };
}

function generateMockFiles(): ProjectFile[] {
  return [
    {
      id: "file-1",
      path: "app/page.tsx",
      language: "typescript",
      content: `export default function HomePage() {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="text-muted-foreground">
        Your app is ready!
      </p>
    </div>
  );
}`,
    },
    {
      id: "file-2",
      path: "components/button.tsx",
      language: "typescript",
      content: `interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-primary text-white rounded-lg"
    >
      {children}
    </button>
  );
}`,
    },
    {
      id: "file-3",
      path: "lib/utils.ts",
      language: "typescript",
      content: `export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US').format(date);
}`,
    },
  ];
}

export function generateMockProjects(count: number = 5): Project[] {
  return Array.from({ length: count }, (_, i) => {
    return generateMockProject({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    });
  });
}
