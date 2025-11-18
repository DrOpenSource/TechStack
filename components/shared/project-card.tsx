"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Folder, Clock, FileCode } from "lucide-react";
import { Project } from "@/lib/stores/project-store";
import { formatDate } from "@/lib/utils/format";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/chat");
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Folder className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 truncate">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {project.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(project.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              <span>{project.files.length} files</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
