"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Brain,
  Layers,
  Code,
  Palette,
  Server,
  Database,
  Bug,
  Link,
  Cloud,
  FileText,
  CheckCircle,
  Sparkles,
  MessageSquare
} from "lucide-react";

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: any;
  color: string;
}

const AGENTS: Agent[] = [
  {
    id: "00-orchestrator",
    name: "Orchestrator",
    role: "Team Coordinator",
    description: "Coordinates all agents in a 5-phase development loop",
    icon: Brain,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "01-product-architect",
    name: "Product Architect",
    role: "Product Strategy",
    description: "Defines features, user stories, and product requirements",
    icon: Layers,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "02-system-architect",
    name: "System Architect",
    role: "System Design",
    description: "Designs system architecture and technical specifications",
    icon: Code,
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: "03-prototype-dev",
    name: "Prototype Developer",
    role: "Rapid Prototyping",
    description: "Builds rapid prototypes and proof of concepts",
    icon: Sparkles,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "04-design-qa",
    name: "Design QA",
    role: "Design Review",
    description: "Reviews designs for consistency and best practices",
    icon: Palette,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "05-frontend-dev",
    name: "Frontend Developer",
    role: "UI Development",
    description: "Builds responsive user interfaces and components",
    icon: Code,
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "06-backend-dev",
    name: "Backend Developer",
    role: "API Development",
    description: "Creates APIs, business logic, and server code",
    icon: Server,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "07-database-engineer",
    name: "Database Engineer",
    role: "Data Architecture",
    description: "Designs databases and data models",
    icon: Database,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "08-qa-engineer",
    name: "QA Engineer",
    role: "Quality Assurance",
    description: "Tests code and ensures quality standards",
    icon: Bug,
    color: "from-red-500 to-pink-500"
  },
  {
    id: "09-integration-specialist",
    name: "Integration Specialist",
    role: "System Integration",
    description: "Integrates components and external services",
    icon: Link,
    color: "from-teal-500 to-cyan-500"
  },
  {
    id: "10-devops-agent",
    name: "DevOps Agent",
    role: "Deployment & Infrastructure",
    description: "Manages deployment, CI/CD, and infrastructure",
    icon: Cloud,
    color: "from-violet-500 to-purple-500"
  },
  {
    id: "11-report-generator",
    name: "Report Generator",
    role: "Documentation",
    description: "Generates reports and documentation",
    icon: FileText,
    color: "from-gray-500 to-slate-500"
  },
  {
    id: "12-code-reviewer",
    name: "Code Reviewer",
    role: "Code Quality",
    description: "Reviews code for best practices and improvements",
    icon: CheckCircle,
    color: "from-green-500 to-teal-500"
  },
  {
    id: "13-context-gatherer",
    name: "Context Gatherer",
    role: "Requirements Analysis",
    description: "Asks clarifying questions to understand user intent",
    icon: MessageSquare,
    color: "from-blue-500 to-indigo-500"
  }
];

interface AgentTeamProps {
  selectedAgents?: string[];
  onSelectionChange?: (agentIds: string[]) => void;
  mode?: "display" | "select";
}

export function AgentTeam({
  selectedAgents = AGENTS.map(a => a.id),
  onSelectionChange,
  mode = "display"
}: AgentTeamProps) {
  const [selected, setSelected] = useState<string[]>(selectedAgents);

  const toggleAgent = (agentId: string) => {
    if (mode !== "select") return;

    const newSelection = selected.includes(agentId)
      ? selected.filter(id => id !== agentId)
      : [...selected, agentId];

    setSelected(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          Your AI Development Team
        </h3>
        <span className="text-xs text-muted-foreground">
          ({selected.length}/{AGENTS.length} agents active)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {AGENTS.map((agent) => {
          const isSelected = selected.includes(agent.id);
          const Icon = agent.icon;

          return (
            <motion.div
              key={agent.id}
              whileHover={{ scale: mode === "select" ? 1.02 : 1 }}
              whileTap={{ scale: mode === "select" ? 0.98 : 1 }}
              onClick={() => toggleAgent(agent.id)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                mode === "select" ? "cursor-pointer" : ""
              } ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card opacity-50"
              }`}
            >
              {/* Status indicator */}
              {mode === "select" && (
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                  isSelected ? "bg-green-500" : "bg-gray-300"
                }`} />
              )}

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Info */}
              <h4 className="font-semibold text-sm text-foreground mb-1">
                {agent.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {agent.role}
              </p>
              <p className="text-xs text-muted-foreground/80 line-clamp-2">
                {agent.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {mode === "select" && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            💡 Select the agents you want to work on your project. The Orchestrator will coordinate the selected team members.
          </p>
        </div>
      )}
    </div>
  );
}
