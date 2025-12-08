// src/components/buttons/ThemeToggleButton.jsx
import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../../hook/useTheme.js";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  const nextLabel = theme === "dark" ? "claro" : "oscuro";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${nextLabel}`}
      className="p-2 rounded-full transition-colors duration-300
                 bg-gray-200 dark:bg-gray-800
                 hover:bg-gray-300 dark:hover:bg-gray-700
                 text-gray-900 dark:text-gray-100"
    >
      {theme === "dark" ? (
        <SunIcon className="h-6 w-6" /> // Icono para cambiar a modo claro
      ) : (
        <MoonIcon className="h-6 w-6" /> // Icono para cambiar a modo oscuro
      )}
    </button>
  );
};

export default ThemeToggleButton;
