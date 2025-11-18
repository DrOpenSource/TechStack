"use client";

import { motion } from "framer-motion";
import { Plus, Folder, Clock } from "lucide-react";
import { useProjectStore } from "@/lib/stores/project-store";
import { ProjectCard } from "@/components/shared/project-card";
import { TopBar } from "@/components/navigation/TopBar";
import { PullToRefresh } from "@/components/gestures/PullToRefresh";

export default function ProjectsPage() {
  const { projects, createProject } = useProjectStore();

  const handleCreateProject = () => {
    createProject({
      name: `New Project ${projects.length + 1}`,
      description: "AI-generated mobile app",
    });
  };

  const handleRefresh = async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Refresh logic here
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Projects"
        actions={
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateProject}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-label="Create new project"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        }
      />

      <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          New
        </motion.button>
      </div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <Folder className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No projects yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first project to get started
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateProject}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      )}
        </div>
      </PullToRefresh>
    </div>
  );
}
