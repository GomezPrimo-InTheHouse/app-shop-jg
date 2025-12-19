import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  CheckCircle2, ReceiptText, Package, ArrowLeft, 
  AlertTriangle, Copy, Check, ShoppingBag, ExternalLink
} from "lucide-react";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { getVentaByIdApi } from "../api/shopApi";

// --- CONFIGURACIÓN Y HELPERS ---
const LS_LAST_ORDER = "jg_shop_last_order";
const MAX_AGE_MS = 60 * 60 * 1000; 
const API_URL = import.meta.env.VITE_API_URL_BACKEND?.replace('/shop', '') || "";

const getSafeUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatARS = (value) =>
  toNumber(value, 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const normalize = (raw) => {
  if (!raw) return null;
  const a = raw?.data ?? raw;
  const b = a?.data ?? a;
  const c = b?.resp?.data ?? b.resp?.data ?? b;
  return c;
};

const isFresh = (payload) => {
  const savedAt = Number(payload?.saved_at ?? 0);
  return savedAt && (Date.now() - savedAt <= MAX_AGE_MS);
};

const ConfirmacionCompraPage = () => {
  const location = useLocation();
  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const ventaIdFromQS = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("venta_id");
    return v ? Number(v) : null;
  }, [location.search]);

  const fromState = useMemo(() => normalize(location.state), [location.state]);

  const fromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_LAST_ORDER);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const normalized = normalize(parsed);
      return normalized && isFresh(normalized) ? normalized : null;
    } catch { return null; }
  }, []);

  const payload = remote || fromState || fromStorage || null;

  useEffect(() => {
    const hasFullProducts = Array.isArray(payload?.detalles) && 
                           payload.detalles.some(d => d.imagen_url || d.producto_nombre);

    const shouldFetch = !!ventaIdFromQS && (!payload?.venta || !hasFullProducts);

    if (!shouldFetch) return;

    setLoadingRemote(true);
    getVentaByIdApi(ventaIdFromQS)
      .then((data) => {
        const normalized = normalize(data);
        if (normalized) {
          const saved = { ...normalized, saved_at: Date.now() };
          setRemote(saved);
          localStorage.setItem(LS_LAST_ORDER, JSON.stringify(saved));
        }
      })
      .catch(err => console.error("Error JG Shop:", err))
      .finally(() => setLoadingRemote(false));
  }, [ventaIdFromQS, payload]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const Shell = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <ShopHeader />
      {children}
    </div>
  );

  if (loadingRemote) {
    return (
      <Shell>
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
            <p className="font-black italic uppercase tracking-tighter">Sincronizando Pedido...</p>
          </div>
        </main>
      </Shell>
    );
  }

  if (!payload) {
    return (
      <Shell>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black italic uppercase">Ups! Algo salió mal</h2>
            <p className="mt-2 text-slate-500 text-sm">No pudimos cargar tu compra. Si ya pagaste, no te preocupes, el pedido está en nuestro sistema.</p>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 font-black italic uppercase text-xs text-indigo-600 tracking-widest hover:underline">
              <ArrowLeft className="h-4 w-4" /> Volver al Inicio
            </Link>
          </div>
        </main>
      </Shell>
    );
  }

  const venta = payload?.venta ?? {};
  const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];
  const total_bruto = payload?.total_bruto ?? 0;
  const descuento = toNumber(payload?.descuento, 0);
  const total_final = payload?.total_final ?? (total_bruto - descuento);

  return (
    <Shell>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 ring-1 ring-emerald-500/20 shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">¡Compra Confirmada!</h1>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] md:text-xs">
            Orden de Venta: #{venta.id || "0000"} — <span className="text-indigo-500">JG SHOP OFFICIAL</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* BLOQUE IZQUIERDO: MÉTODOS DE PAGO (Simétricos) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            
            {/* CARD 1: TRANSFERENCIA */}
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 flex flex-col h-full shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <ReceiptText className="h-6 w-6 text-indigo-500" />
                <h3 className="font-black italic uppercase tracking-tight text-xl">Transferencia</h3>
              </div>

              <div className="flex-1 flex flex-col gap-6">
                <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="text-sm">
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-1">Titular</p>
                    <p className="font-bold text-base">Julian Agustin Gomez</p>
                    <p className="text-xs text-slate-500">Brubank | CUIT 20-39173125-0</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 group">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">CBU</span>
                        <span className="text-xs font-mono font-bold italic">143...840017</span>
                      </div>
                      <button onClick={() => copyToClipboard("1430001713017789840017", "cbu")} className="p-2 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all active:scale-90">
                        {copiedField === 'cbu' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 group">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Alias</span>
                        <span className="text-xs font-mono font-bold italic">julian.gomez.inf</span>
                      </div>
                      <button onClick={() => copyToClipboard("julian.gomez.inf", "alias")} className="p-2 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all active:scale-90">
                        {copiedField === 'alias' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col items-center">
                  <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-100 mb-3">
                    {/* Placeholder de QR hasta que pongas el real */}
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=julian.gomez.inf" 
                      alt="QR de Pago" 
                      className="h-28 w-28 grayscale dark:grayscale-0"
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Escaneá para pagar</span>
                </div>
              </div>
            </div>

            {/* CARD 2: WHATSAPP */}
            <div className="rounded-[2.5rem] bg-indigo-600 p-8 text-white flex flex-col h-full shadow-2xl shadow-indigo-500/30">
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="h-6 w-6" />
                <h3 className="font-black italic uppercase tracking-tight text-xl">Confirmar envío</h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xl font-black italic uppercase mb-4 leading-tight">Envianos el comprobante</p>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                    Una vez realizada la transferencia, hacé clic en el botón de abajo. Se abrirá un chat directo para enviarnos la captura de pago y coordinar la entrega.
                  </p>
                </div>

                <div className="mt-auto">
                  <a 
                    href="https://wa.link/qeelcn"
                    target="_blank" 
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-6 text-sm font-black italic uppercase text-indigo-600 hover:bg-slate-50 transition-all active:scale-95 shadow-xl group"
                  >
                    Abrir WhatsApp
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <p className="text-center text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-4">Atención inmediata JG SHOP</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE TOTALES */}
          <aside className="lg:col-span-1 h-full">
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-lg sticky top-8">
              <h3 className="font-black italic uppercase text-sm tracking-[0.2em] text-indigo-500 mb-10 text-center">Resumen de Cuenta</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-4">
                  <span className="text-[10px] font-black italic uppercase text-slate-400">Bruto</span>
                  <span className="font-bold text-lg leading-none">{formatARS(total_bruto)}</span>
                </div>
                
                {descuento > 0 && (
                  <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-4">
                    <span className="text-[10px] font-black italic uppercase text-emerald-500">Descuento</span>
                    <span className="font-bold text-lg text-emerald-500 leading-none">-{formatARS(descuento)}</span>
                  </div>
                )}

                <div className="py-8 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
                  <span className="text-[10px] font-black italic uppercase text-slate-400 block mb-1">Total a abonar</span>
                  <span className="text-5xl font-black italic text-indigo-600 dark:text-indigo-400 tracking-tighter">
                    {formatARS(total_final)}
                  </span>
                </div>

                <Link to="/" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-white/10 py-5 text-xs font-black italic uppercase hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95">
                  <ArrowLeft className="h-4 w-4" /> Seguir Comprando
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* DETALLE DE PRODUCTOS (Ancho completo abajo) */}
        <div className="mt-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 bg-indigo-500 w-12 rounded-full"></div>
            <h2 className="font-black italic uppercase text-2xl tracking-tight">Detalle del Pedido</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {detalles.map((item, idx) => (
              <div key={idx} className="group flex items-center gap-6 py-4 border-b border-slate-100 dark:border-white/5 last:border-0 transition-all">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform">
                  <img 
                    src={getSafeUrl(item.imagen_url) || "https://placehold.co/200x200?text=JG"} 
                    alt={item.producto_nombre} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black italic uppercase text-xs md:text-sm truncate mb-1">{item.producto_nombre}</h4>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Cantidad: {item.cantidad}</p>
                  <p className="text-[11px] text-slate-400 font-medium italic">{formatARS(item.precio_unitario)} c/u</p>
                </div>
                <div className="text-right">
                   <p className="font-black italic text-base md:text-lg">{formatARS(item.subtotal)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Shell>
  );
};

export default ConfirmacionCompraPage;