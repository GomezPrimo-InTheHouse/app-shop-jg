import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  CheckCircle2, ReceiptText, Package, ArrowLeft, 
  AlertTriangle, Copy, Check, ShoppingBag, ExternalLink
} from "lucide-react";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { getVentaByIdApi } from "../api/shopApi";

const LS_LAST_ORDER = "jg_shop_last_order";
const API_URL = import.meta.env.VITE_API_URL_BACKEND?.replace('/shop', '') || "";

const getSafeUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};

const formatARS = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const ConfirmacionCompraPage = () => {
  const location = useLocation();
  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // --- LÓGICA DE DATOS ---
  const ventaIdFromQS = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("venta_id");
    return v ? Number(v) : null;
  }, [location.search]);

  const payload = remote || location.state || null;

  useEffect(() => {
    if (ventaIdFromQS && !payload) {
      setLoadingRemote(true);
      getVentaByIdApi(ventaIdFromQS)
        .then((res) => setRemote(res?.data || res))
        .catch(console.error)
        .finally(() => setLoadingRemote(false));
    }
  }, [ventaIdFromQS, payload]);

  // --- LÓGICA DE WHATSAPP (RECUPERADA Y MEJORADA) ---
  const handleWhatsAppRedirect = () => {
    const v = payload?.venta || {};
    const d = payload?.detalles || [];
    const total = payload?.total_final || 0;
    
    const productosStr = d
      .map((item) => `%0A• ${item.producto_nombre} (x${item.cantidad})`)
      .join("");
    
    const mensaje = `¡Hola JG SHOP! 👋%0A%0A` +
      `*NUEVO PEDIDO:* #${v.id || "S/N"}%0A` +
      `*CLIENTE:* ${v.cliente?.nombre || ""} ${v.cliente?.apellido || ""}%0A` +
      `*TOTAL:* ${formatARS(total)}%0A%0A` +
      `*DETALLE:*${productosStr}%0A%0A` +
      `Adjunto el comprobante de transferencia abajo:`;
      
    // Usamos wa.link/qeelcn pero le inyectamos el texto dinámico
    const baseLink = "https://wa.me/5493534275476"; // Reemplaza con el número asociado a tu wa.link
    window.open(`${baseLink}?text=${mensaje}`, "_blank");
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loadingRemote) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!payload) return null;

  const { venta, detalles, total_bruto, descuento, total_final } = payload;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ShopHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER ÉXITO */}
        <div className="text-center mb-16 animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Pedido Recibido</h1>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs mt-2">
            JG SHOP OFFICIAL • ORDEN #{venta?.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BLOQUE DE PAGOS SIMÉTRICOS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CARD TRANSFERENCIA */}
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 flex flex-col shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <ReceiptText className="h-6 w-6 text-indigo-500" />
                <h3 className="font-black italic uppercase text-xl">Transferencia</h3>
              </div>

              <div className="flex-1 space-y-6">
                <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="text-sm">
                    <p className="font-bold text-base">Julian Agustin Gomez</p>
                    <p className="text-xs text-slate-500 italic">Brubank | CUIT 20-39173125-0</p>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => copyToClipboard("1430001713017789840017", "cbu")}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
                    >
                      <span className="text-[10px] font-mono font-bold">CBU: ...840017</span>
                      {copiedField === 'cbu' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />}
                    </button>
                    <button 
                      onClick={() => copyToClipboard("julian.gomez.inf", "alias")}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
                    >
                      <span className="text-[10px] font-mono font-bold">ALIAS: julian.gomez.inf</span>
                      {copiedField === 'alias' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />}
                    </button>
                  </div>
                </div>

                <div className="mt-auto text-center">
                  <div className="inline-block bg-white p-3 rounded-2xl shadow-lg border border-slate-100 mb-3">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=julian.gomez.inf" 
                      alt="QR" className="h-24 w-24 grayscale dark:grayscale-0"
                    />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Escaneá para pagar</p>
                </div>
              </div>
            </div>

            {/* CARD WHATSAPP CON FUNCIÓN DINÁMICA */}
            <div className="rounded-[2.5rem] bg-indigo-600 p-8 text-white flex flex-col shadow-xl shadow-indigo-500/20">
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="h-6 w-6" />
                <h3 className="font-black italic uppercase text-xl">Confirmar</h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-black italic uppercase mb-4 leading-tight">Acción Rápida</h4>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                    Al presionar este botón se generará un mensaje automático con el detalle de tu pedido listo para enviar.
                    Si ya realizaste la transferencia, adjuntá el comprobante en el chat de WhatsApp para agilizar el proceso.
                  </p>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={handleWhatsAppRedirect}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-6 text-sm font-black italic uppercase text-indigo-600 hover:bg-slate-50 transition-all active:scale-95 shadow-xl group"
                  >
                    Enviar Pedido
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <p className="text-center text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-4 italic">JG Shop via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN DERECHA */}
          <aside className="lg:col-span-1">
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-lg sticky top-8">
              <h3 className="font-black italic uppercase text-[10px] tracking-[0.3em] text-indigo-500 mb-8 text-center">Estado de Cuenta</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-bold uppercase italic">
                  <span className="text-slate-400">Subtotal</span>
                  <span>{formatARS(total_bruto)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-xs font-bold uppercase italic text-emerald-500">
                    <span>Bonificación</span>
                    <span>-{formatARS(descuento)}</span>
                  </div>
                )}
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase text-slate-400 mb-1 italic">Total Final</span>
                  <span className="text-5xl font-black italic text-indigo-600 dark:text-indigo-400 leading-none">
                    {formatARS(total_final)}
                  </span>
                </div>
              </div>

              <Link to="/" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-white/10 py-5 text-[10px] font-black italic uppercase hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                <ArrowLeft className="h-3 w-3" /> Volver a la Tienda
              </Link>
            </div>
          </aside>
        </div>

        {/* DETALLE PRODUCTOS ABAJO */}
        <div className="mt-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 md:p-12">
          <h2 className="font-black italic uppercase text-xl mb-10 border-l-4 border-indigo-500 pl-4">Tu Selección</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            {detalles.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  <img 
                    src={getSafeUrl(item.imagen_url) || "https://placehold.co/100x100?text=JG"} 
                    alt={item.producto_nombre} className="h-full w-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-black italic uppercase text-[11px] truncate">{item.producto_nombre}</h4>
                  <p className="text-[9px] text-indigo-500 font-bold uppercase italic">CANT: {item.cantidad}</p>
                </div>
                <div className="font-black italic text-sm">{formatARS(item.subtotal)}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmacionCompraPage;