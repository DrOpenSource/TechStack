"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, X } from "lucide-react";
import type { ElementNode, EditableProp } from "@/packages/core/types";

interface ElementInspectorProps {
  element: ElementNode | null;
  onUpdate: (elementId: string, property: string, value: any) => void;
  onClose: () => void;
}

export function ElementInspector({
  element,
  onUpdate,
  onClose,
}: ElementInspectorProps) {
  const [aiPrompt, setAiPrompt] = useState("");

  if (!element) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Wand2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Element Selected
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click any element in the preview to edit its properties
        </p>
      </div>
    );
  }

  // Get editable properties (mock for prototype)
  const editableProps = getEditablePropsForElement(element);

  const handlePropertyChange = (key: string, value: any) => {
    onUpdate(element.id, key, value);
  };

  const handleAIEdit = () => {
    if (aiPrompt.trim()) {
      // In production, this would call the AI agent
      console.log("AI Edit:", aiPrompt, "for element:", element.id);
      setAiPrompt("");
    }
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
            {element.type}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {element.id}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Editable Properties */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Properties
          </h4>

          {editableProps.map((prop) => (
            <PropertyEditor
              key={prop.key}
              prop={prop}
              onChange={(value) => handlePropertyChange(prop.key, value)}
            />
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI Suggestions
          </h4>

          <div className="space-y-2">
            {getSuggestionsForElement(element).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => console.log("Apply suggestion:", suggestion)}
                className="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* AI Chat */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Ask AI to Edit
          </h4>

          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAIEdit();
                }
              }}
              placeholder={`Edit this ${element.type}...`}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAIEdit}
              disabled={!aiPrompt.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Example: &quot;Make it bigger&quot;, &quot;Change color to green&quot;
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Property Editor Component
 */
function PropertyEditor({
  prop,
  onChange,
}: {
  prop: EditableProp;
  onChange: (value: any) => void;
}) {
  switch (prop.type) {
    case "string":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {prop.label}
          </label>
          <input
            type="text"
            value={prop.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {prop.label}
          </label>
          <button
            onClick={() => onChange(!prop.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prop.value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prop.value ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      );

    case "enum":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {prop.label}
          </label>
          <select
            value={prop.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {prop.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "color":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {prop.label}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={prop.value}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-16 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={prop.value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );

    case "number":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {prop.label}
          </label>
          <input
            type="number"
            value={prop.value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );

    default:
      return null;
  }
}

/**
 * Get editable properties for element (mock for prototype)
 */
function getEditablePropsForElement(element: ElementNode): EditableProp[] {
  const props: EditableProp[] = [];

  // Text content
  const textContent = element.children.find((c) => typeof c === "string");
  if (textContent) {
    props.push({
      key: "text",
      type: "string",
      value: textContent,
      label: "Text",
      category: "content",
    });
  }

  // Common properties
  if (element.props.className) {
    props.push({
      key: "className",
      type: "string",
      value: element.props.className,
      label: "CSS Classes",
      category: "style",
    });
  }

  // Button-specific
  if (element.type === "button") {
    props.push({
      key: "disabled",
      type: "boolean",
      value: element.props.disabled || false,
      label: "Disabled",
      category: "behavior",
    });
  }

  // Input-specific
  if (element.type === "input") {
    props.push({
      key: "type",
      type: "enum",
      value: element.props.type || "text",
      label: "Input Type",
      options: ["text", "email", "password", "number", "tel", "url"],
      category: "behavior",
    });

    if (element.props.placeholder) {
      props.push({
        key: "placeholder",
        type: "string",
        value: element.props.placeholder,
        label: "Placeholder",
        category: "content",
      });
    }
  }

  return props;
}

/**
 * Get AI suggestions for element
 */
function getSuggestionsForElement(element: ElementNode): string[] {
  const suggestions: string[] = [];

  if (element.type === "button") {
    suggestions.push("Add loading state", "Make it larger", "Change to outline style");
  } else if (element.type === "input") {
    suggestions.push("Add validation", "Make it full width", "Add an icon");
  } else if (element.type === "h1" || element.type === "h2" || element.type === "h3") {
    suggestions.push("Make it bold", "Add gradient text", "Center align");
  } else {
    suggestions.push("Add padding", "Change background", "Make it rounded");
  }

  return suggestions;
}
