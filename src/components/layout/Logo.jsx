import { twMerge } from "tailwind-merge";
import logoJG from "../../assets/logo-1-sin-fondo.png";

export default function Logo({ className = "", size = "hero" }) {
  const sizes = {
    header: "h-10 sm:h-12 md:h-14",
    hero: "h-20 sm:h-24 md:h-32 lg:h-38 xl:h-40",
    compact: "h-14 sm:h-16 md:h-20",
  };

  return (
    <img
      src={logoJG}
      alt="Logo de JG Informática"
      draggable="false"
      className={twMerge(
        `
        ${sizes[size] ?? sizes.hero}
        w-auto object-contain

        dark:invert invert-0

        transition-all duration-300
        sm:hover:scale-105
        sm:hover:drop-shadow-[0_0_10px_rgba(79,163,209,0.5)]
        `,
        className
      )}
    />
  );
}
