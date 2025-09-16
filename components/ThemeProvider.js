"use client";
import { useEffect } from "react";
import useConfig from "@/lib/useConfig";

/**
 * Reads color fields from PocketBase config and applies them as CSS variables
 * so the entire site theme updates reactively without full refresh.
 * Supported fields (all optional):
 *   primary_color, bg_color, text_color
 */
export default function ThemeProvider({ children }) {
  const { config } = useConfig();

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;
    const setVar = (key, value) => {
      if (value) {
        root.style.setProperty(key, value);
      }
    };

    setVar("--primary-color", config?.primary_color || "#4f46e5");
    setVar("--bg-color", config?.bg_color || "#ffffff");
    setVar("--text-color", config?.text_color || "#111827");
  }, [config]);

  return children;
}
