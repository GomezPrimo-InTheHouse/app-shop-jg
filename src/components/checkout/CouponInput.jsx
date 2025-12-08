import React from "react";
import { Ticket } from "lucide-react";

const CouponInput = ({ onApply, status, message }) => {
  const [code, setCode] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(code.trim());
  };

  const borderColor =
    status === "success"
      ? "border-emerald-500"
      : status === "error"
      ? "border-red-500"
      : "border-slate-300 dark:border-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
        <Ticket className="h-4 w-4" />
        Ingresá tu cupón de descuento
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ej: JGINFORMATICA10"
          className={`flex-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-900 
                      text-slate-900 dark:text-slate-100 placeholder:text-slate-400 
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 ${borderColor}`}
        />
        <button
          type="submit"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          Aplicar
        </button>
      </div>

      {message && (
        <p
          className={`text-xs ${
            status === "success"
              ? "text-emerald-400"
              : status === "error"
              ? "text-red-400"
              : "text-slate-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default CouponInput;
