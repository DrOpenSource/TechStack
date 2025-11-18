"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/lib/stores/chat-store";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary" : "bg-secondary"
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Sparkles className="w-5 h-5 text-secondary-foreground" />
        )}
      </div>

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex justify-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
          <div
            className={cn(
              "text-xs mt-2 opacity-70",
              isUser ? "text-right" : "text-left"
            )}
          >
            {formatDate(message.timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
