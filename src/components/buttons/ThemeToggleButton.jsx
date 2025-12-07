//src/components/buttons/ThemeToggleButton.jsx
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Necesitas instalar @heroicons/react

// Define una función para detectar la preferencia del sistema operativo
const getSystemPreference = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Por defecto, si no se puede detectar
};

const ThemeToggleButton = () => {
  // 1. Inicializa el estado: intenta obtener el tema guardado o usa la preferencia del sistema.
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || getSystemPreference();
    }
    return 'light';
  });

  // 2. Efecto para aplicar la clase 'dark' al <html> y guardar la preferencia.
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';

    // Aplica o remueve la clase 'dark' en el elemento raíz del DOM.
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    // Guarda la preferencia del usuario.
    localStorage.setItem('theme', theme);
  }, [theme]); // Se ejecuta cada vez que 'theme' cambia.

  // 3. Función de alternancia
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  // 4. Renderizado del botón
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      className="p-2 rounded-full transition-colors duration-300
                 bg-gray-200 dark:bg-gray-800
                 hover:bg-gray-300 dark:hover:bg-gray-700
                 text-gray-900 dark:text-gray-100"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6" /> // Icono para cambiar a modo claro
      ) : (
        <MoonIcon className="h-6 w-6" /> // Icono para cambiar a modo oscuro
      )}
    </button>
  );
};

export default ThemeToggleButton;
