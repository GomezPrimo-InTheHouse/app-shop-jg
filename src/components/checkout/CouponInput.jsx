// import React from "react";
// import { Ticket } from "lucide-react";

// const CouponInput = ({ onApply, status, message }) => {
//   const [code, setCode] = React.useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onApply(code.trim());
//   };

//   const borderColor =
//     status === "success"
//       ? "border-emerald-500"
//       : status === "error"
//       ? "border-red-500"
//       : "border-slate-300 dark:border-slate-700";

//   return (
//     <form onSubmit={handleSubmit} className="space-y-2">
//       <label className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
//         <Ticket className="h-4 w-4" />
//         Ingresá tu cupón de descuento
//       </label>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           placeholder="Ej: JGINFORMATICA10"
//           className={`flex-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-900 
//                       text-slate-900 dark:text-slate-100 placeholder:text-slate-400 
//                       focus:outline-none focus:ring-2 focus:ring-indigo-400 ${borderColor}`}
//         />
//         <button
//           type="submit"
//           className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
//         >
//           Aplicar
//         </button>
//       </div>

//       {message && (
//         <p
//           className={`text-xs ${
//             status === "success"
//               ? "text-emerald-400"
//               : status === "error"
//               ? "text-red-400"
//               : "text-slate-400"
//           }`}
//         >
//           {message}
//         </p>
//       )}
//     </form>
//   );
// };

// export default CouponInput;
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCoupon } from "../../context/CouponContext";
import { useNotification } from "../../context/NotificationContext";
import { validarCuponApi } from "../../api/shopApi";

const CouponInput = () => {
  const { cliente, cuponActivo, cuponFlags } = useAuth();
  const { totalAmount } = useCart();
  const { aplicarCupon, limpiarCupon, cupon } = useCoupon();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);

  const totalBruto = totalAmount ?? 0;
  const codigoSugerido = cuponActivo?.codigo || "";

  const handleAplicarCupon = async () => {
  if (!cliente?.id) {
    showNotification("warning", "Primero completá la identificación del comprador.");
    return;
  }

  if (!codigoSugerido) {
    showNotification("info", "No hay cupón disponible para aplicar.");
    return;
  }

  setLoading(true);

  try {
    const resp = await validarCuponApi({
      cliente_id: cliente.id,
      codigo: codigoSugerido,
      total_bruto: totalBruto,
    });

    // ✅ Soporta ambos formatos: axios response o data directo
    const data = resp?.data ?? resp;

    if (data?.valido) {
      const descuento = Number(data?.descuento ?? data?.descuento_monto ?? 0);
      const totalConDesc = Number(
        data?.total_con_descuento ?? data?.total_con_descuento ?? totalBruto
      );

      // ✅ Preferimos el cupón que devuelve el backend (más completo)
      const cuponFinal =
        data?.cupon ?? {
          codigo: codigoSugerido,
          descuento_porcentaje: cuponActivo?.descuento_porcentaje ?? 0,
        };

      aplicarCupon({
        cupon: cuponFinal,
        descuento_monto: descuento,
        total_con_descuento: totalConDesc,
      });

      showNotification(
        "success",
        `Cupón aplicado: -$${descuento.toLocaleString("es-AR")}`
      );
    } else {
      limpiarCupon();
      showNotification("warning", data?.error || "Cupón no válido.");
    }
  } catch (err) {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      "No se pudo validar el cupón.";
    showNotification("error", msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="rounded-xl border border-gray-200 dark:border-gray-800
                 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm p-4 space-y-2"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Cupón
      </h3>

      {/* Caso: cupón bloqueado */}
      {cuponFlags?.cupon_bloqueado && !cuponActivo && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {cuponFlags?.cupon_block_reason ||
            "Ya utilizaste tu beneficio. Volvé a intentarlo más adelante."}
        </p>
      )}

      {/* Caso: cupón sugerido */}
      {cuponActivo?.codigo ? (
        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <p>
            Cupón disponible:{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {cuponActivo.codigo}
            </span>{" "}
            ({cuponActivo.descuento_porcentaje}% OFF)
          </p>

          {cuponActivo.valido_hasta && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Válido hasta:{" "}
              {new Date(cuponActivo.valido_hasta).toLocaleString("es-AR")}
            </p>
          )}

          <button
            type="button"
            onClick={handleAplicarCupon}
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-full
                       bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                       px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            {loading ? "Validando..." : cupon?.codigo ? "Re-aplicar cupón" : "Aplicar cupón"}
          </button>
        </div>
      ) : (
        !cuponFlags?.cupon_bloqueado && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            No tenés un cupón disponible por ahora.
          </p>
        )
      )}
    </div>
  );
};

export default CouponInput;
