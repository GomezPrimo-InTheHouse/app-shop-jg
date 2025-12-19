import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  CheckCircle2, ReceiptText, Package, ArrowLeft, 
  AlertTriangle, Copy, Check, ShoppingBag 
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
      .catch(err => console.error("Error fetching order:", err))
      .finally(() => setLoadingRemote(false));
  }, [ventaIdFromQS, payload]);

  // --- LÓGICA DE INTERACCIÓN ---
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateWSMessage = () => {
    const v = payload?.venta || {};
    const d = payload?.detalles || [];
    const t = payload?.total_final || 0;
    
    const productosStr = d
      .map((item) => `- ${item.producto_nombre} (x${item.cantidad})`)
      .join("%0A");
    
    const mensaje = `Hola JG SHOP! Realicé un pedido:%0A%0A` +
      `*ID Pedido:* #${v.id || "S/N"}%0A` +
      `*Cliente:* ${v.cliente?.nombre || ""} ${v.cliente?.apellido || ""}%0A` +
      `*Total:* ${formatARS(t)}%0A%0A` +
      `*Productos:*%0A${productosStr}%0A%0A` +
      `Envío este mensaje para coordinar el pago/entrega.`;
      
    return `https://wa.me/5493534293881?text=${mensaje}`;
  };

  // --- COMPONENTES INTERNOS ---
  const Shell = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <ShopHeader />
      {children}
    </div>
  );

  // --- ESTADO DE CARGA / ERROR ---
  if (loadingRemote) {
    return (
      <Shell>
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black italic uppercase tracking-widest animate-pulse">Cargando Pedido...</p>
          </div>
        </main>
      </Shell>
    );
  }

  if (!payload) {
    return (
      <Shell>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-10 text-center shadow-xl">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black italic uppercase">Pedido no hallado</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">No pudimos encontrar los detalles. Volvé a la tienda e intentá de nuevo.</p>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 font-bold text-indigo-600 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Volver al Shop
            </Link>
          </div>
        </main>
      </Shell>
    );
  }

  // --- DATOS NORMALIZADOS ---
  const venta = payload?.venta ?? {};
  const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];
  const total_bruto = payload?.total_bruto ?? 0;
  const descuento = toNumber(payload?.descuento, 0);
  const total_final = payload?.total_final ?? (total_bruto - descuento);

  return (
    <Shell>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Encabezado Éxito */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">¡Pedido Recibido!</h1>
          <p className="text-slate-500 font-medium italic">Orden #{venta.id || "—"} • Gracias por tu confianza</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: PAGOS Y PRODUCTOS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* OPCIONES DE PAGO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Transferencia */}
              <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <ReceiptText className="h-6 w-6 text-indigo-500" />
                  <h3 className="font-black italic uppercase tracking-tight">Transferencia</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase text-indigo-500 mb-2 tracking-widest">Datos JG</p>
                    <div className="space-y-1 text-sm mb-4">
                      <p className="font-bold">Julian Agustin Gomez</p>
                      <p className="text-slate-500">Brubank | CUIT: 20-39173125-0</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <span className="text-xs font-mono truncate">CBU: ...840017</span>
                        <button onClick={() => copyToClipboard("1430001713017789840017", "cbu")} className="p-2">
                          {copiedField === 'cbu' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <span className="text-xs font-mono truncate">Alias: julian.gomez.inf</span>
                        <button onClick={() => copyToClipboard("julian.gomez.inf", "alias")} className="p-2">
                          {copiedField === 'alias' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
                    <div className="bg-white p-3 rounded-2xl mb-2">
                      <img 
                        src="/qr-pago.png" 
                        alt="QR de Pago" 
                        className="h-32 w-32 object-contain" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Escaneá para transferir</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Finalización */}
              <div className="rounded-[2.5rem] border border-transparent bg-indigo-600 p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-500/20">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <ShoppingBag className="h-6 w-6" />
                    <h3 className="font-black italic uppercase tracking-tight">Vía WhatsApp</h3>
                  </div>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                    Presioná el botón para enviarnos el detalle de tu pedido y el comprobante de pago de forma directa.
                  </p>
                </div>

                <div className="mt-8">
                  <a 
                    href={generateWSMessage()}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-5 text-sm font-black italic uppercase text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
                  >
                    Enviar pedido ahora
                  </a>
                </div>
              </div>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8">
              <div className="flex items-center gap-3 mb-8">
                <Package className="h-5 w-5 text-indigo-500" />
                <h2 className="font-black italic uppercase text-xl">Detalle de Productos</h2>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {detalles.map((item, idx) => (
                  <div key={idx} className="py-6 flex items-center gap-5">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-white/5">
                      <img 
                        src={getSafeUrl(item.imagen_url) || "https://placehold.co/200x200?text=JG"} 
                        alt={item.producto_nombre} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base truncate">{item.producto_nombre}</h4>
                      <p className="text-xs font-bold text-indigo-500 mt-1 uppercase">Cantidad: {item.cantidad}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatARS(item.precio_unitario)} c/u</p>
                    </div>
                    <div className="text-right font-black text-lg">
                      {formatARS(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: TOTALES */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-lg">
              <h3 className="font-black italic uppercase text-xs tracking-widest text-slate-400 mb-8 text-center underline decoration-indigo-500 decoration-2 underline-offset-8">
                Resumen de cuenta
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-500 italic uppercase">Subtotal</span>
                  <span>{formatARS(total_bruto)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-sm font-bold text-emerald-500 italic uppercase">
                    <span>Bonificación</span>
                    <span>-{formatARS(descuento)}</span>
                  </div>
                )}
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black italic uppercase text-slate-400 mb-1">Total a pagar</span>
                    <span className="text-4xl font-black italic text-indigo-600 dark:text-indigo-400 leading-none">
                      {formatARS(total_final)}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/" className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-white/10 py-5 text-xs font-black italic uppercase hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                <ArrowLeft className="h-4 w-4" /> Seguir Navegando
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </Shell>
  );
};

export default ConfirmacionCompraPage;