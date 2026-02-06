// frontend/src/App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import OrderTrackingCard from "./components/OrderTrackingCard.jsx";
import {
  TriangleAlert,
  TrendingUp,
  Timer,
  ClipboardList,
  Truck,
  Route as RouteIcon,
  Bot,
  Filter,
  ChevronRight,
  Headset,
  Mail,
  PhoneCall,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";

const LS_KEY = "ops.context.v1";

function parseSearch(search) {
  const sp = new URLSearchParams(search || "");
  return {
    order: sp.get("order") || "",
    route: sp.get("route") || "",
    status: sp.get("status") || "",
  };
}

function loadOps() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

function saveOps(next) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function riskTone(riskLevel) {
  const r = (riskLevel || "").toLowerCase();
  if (r.includes("high") || r.includes("yüksek") || r.includes("kritik")) return "bg-[#4B3621]/15 text-[#4B3621]";
  if (r.includes("med") || r.includes("orta")) return "bg-[#4B3621]/10 text-[#4B3621]";
  if (r.includes("low") || r.includes("düşük") || r.includes("ok")) return "bg-[#2D4F1E]/12 text-[#2D4F1E]";
  return "bg-[#2D4F1E]/10 text-[#2D4F1E]";
}

function pageTitle(pathname) {
  if (pathname === "/") return "Ana Sayfa";
  if (pathname.startsWith("/overview")) return "Genel Bakış";
  if (pathname.startsWith("/orders")) return "Siparişler";
  if (pathname.startsWith("/shipments")) return "Sevkiyat";
  if (pathname.startsWith("/routes")) return "Rotalar";
  if (pathname.startsWith("/chat")) return "AI Chatbot";
  if (pathname.startsWith("/contact")) return "İletişim";
  return "Ana Sayfa";
}

function TopBar({ title, ops }) {
  return (
    <header className="rounded-2xl bg-[#F5F5DC] shadow-md px-5 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Enterprise Logistics</div>
        <h1 className="mt-1 text-xl md:text-2xl font-semibold text-[#2B2B2B] truncate">{title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {ops?.selectedOrderId ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2D4F1E]/10 text-[#2D4F1E]">
              <ClipboardList size={14} />
              {ops.selectedOrderId}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2B2B2B]/8 text-[#2B2B2B]/70">
              <ClipboardList size={14} />
              Sipariş seçilmedi
            </span>
          )}

          {ops?.selectedRoute ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#4B3621]/10 text-[#4B3621]">
              <RouteIcon size={14} />
              {ops.selectedRoute}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2B2B2B]/8 text-[#2B2B2B]/70">
              <RouteIcon size={14} />
              Rota seçilmedi
            </span>
          )}

          {(ops?.riskLevel || "").trim() ? (
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${riskTone(ops.riskLevel)}`}>
              <TriangleAlert size={14} />
              Risk: {ops.riskLevel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2B2B2B]/8 text-[#2B2B2B]/70">
              <TriangleAlert size={14} />
              Risk: —
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block text-right">
          <div className="text-sm font-semibold text-[#2B2B2B]">Operasyon Kullanıcısı</div>
          <div className="text-xs text-[#2B2B2B]/60">İzleme Yetkisi • Live</div>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-[#2D4F1E]/12 grid place-items-center text-[#2D4F1E] shadow-sm">
          <span className="text-sm font-semibold">OP</span>
        </div>
      </div>
    </header>
  );
}

function KPI({ title, value, meta, icon: Icon, tone = "green" }) {
  const t = tone === "brown" ? "bg-[#4B3621]/10 text-[#4B3621]" : "bg-[#2D4F1E]/10 text-[#2D4F1E]";
  return (
    <div className="rounded-2xl bg-[#F5F5DC] shadow-md p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">{title}</div>
          <div className="mt-2 text-2xl font-semibold text-[#2B2B2B]">{value}</div>
          <div className="mt-1 text-sm text-[#2B2B2B]/70">{meta}</div>
        </div>
        <div className={`h-11 w-11 rounded-2xl grid place-items-center shadow-sm ${t}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function Pill({ active, children, onClick, tone = "neutral" }) {
  const base = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35";
  const tones = {
    neutral: active ? "bg-[#2B2B2B]/12 text-[#2B2B2B]" : "bg-[#2B2B2B]/8 text-[#2B2B2B]/75 hover:bg-[#2B2B2B]/12",
    green: active ? "bg-[#2D4F1E]/16 text-[#2D4F1E]" : "bg-[#2D4F1E]/10 text-[#2D4F1E] hover:bg-[#2D4F1E]/14",
    brown: active ? "bg-[#4B3621]/16 text-[#4B3621]" : "bg-[#4B3621]/10 text-[#4B3621] hover:bg-[#4B3621]/14",
  };
  return (
    <button type="button" onClick={onClick} className={`${base} ${tones[tone] || tones.neutral}`}>
      {children}
    </button>
  );
}

function Section({ title, subtitle, action, children }) {
  return (
    <section className="rounded-2xl bg-[#F5F5DC] shadow-md overflow-hidden">
      <header className="px-5 py-4 border-b border-[#4B3621]/15 bg-[#E6E6E6]/45">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">{subtitle}</div>
            <div className="mt-1 text-lg font-semibold text-[#2B2B2B]">{title}</div>
          </div>
          {action}
        </div>
      </header>
      <div className="p-0">{children}</div>
    </section>
  );
}

function DataTable({ columns, rows, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#E6E6E6]/55">
          <tr className="text-left text-[#2B2B2B]/70">
            {columns.map((c) => (
              <th key={c} className="px-5 py-3 font-semibold whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              tabIndex={0}
              onClick={() => onRowClick?.(r.__row)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRowClick?.(r.__row);
                }
              }}
              className="border-t border-[#4B3621]/10 hover:bg-[#E6E6E6]/35 focus:bg-[#E6E6E6]/40 outline-none transition cursor-pointer"
            >
              {r.cells.map((cell, cidx) => (
                <td key={cidx} className="px-5 py-3 text-[#2B2B2B] align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const seed = useMemo(() => {
    const orders = [
      {
        id: "ORD-204918",
        customer: "Ege Market",
        status: "On Route",
        priority: "High",
        route: "RTE-A12",
        origin: "İzmir DC-02",
        destination: "Manisa Hub-01",
        progress: 62,
        eta: "04 Şub 2026 • 10:30",
        slaHoursRemaining: 14,
        lastScan: "03 Şub 2026 • 16:40 • Akhisar",
        risk: "Medium",
        notes: ["Rüzgâr uyarısı: hız düşümü bekleniyor.", "Hub giriş yoğunluğu olasılığı."],
      },
      {
        id: "ORD-205104",
        customer: "Anadolu Yapı",
        status: "On Route",
        priority: "Critical",
        route: "RTE-C07",
        origin: "Manisa Hub-01",
        destination: "Balıkesir Hub-02",
        progress: 48,
        eta: "04 Şub 2026 • 09:10",
        slaHoursRemaining: 6,
        lastScan: "03 Şub 2026 • 15:05 • Turgutlu",
        risk: "High",
        notes: ["Hub kapasite yoğunluğu: bekleme riski.", "SLA kritik eşikte."],
      },
      {
        id: "ORD-205210",
        customer: "Ege Endüstri",
        status: "Preparing",
        priority: "High",
        route: "RTE-B03",
        origin: "İzmir DC-02",
        destination: "Aydın Hub-01",
        progress: 18,
        eta: "04 Şub 2026 • 12:00",
        slaHoursRemaining: 18,
        lastScan: "03 Şub 2026 • 17:55 • İzmir DC-02",
        risk: "Low",
        notes: ["Yükleme sırası: 2 araç önde.", "Paketleme hızında düşüş sinyali."],
      },
      {
        id: "ORD-204772",
        customer: "Marmara Medikal",
        status: "Preparing",
        priority: "Normal",
        route: "RTE-D05",
        origin: "İzmir DC-02",
        destination: "Bursa Hub-03",
        progress: 32,
        eta: "04 Şub 2026 • 15:20",
        slaHoursRemaining: 22,
        lastScan: "03 Şub 2026 • 13:55 • İzmir DC-02",
        risk: "Low",
        notes: ["Paketleme bekliyor: bant 2 planlandı.", "Depo kapasitesi stabil."],
      },
    ];

    const routes = [
      {
        code: "RTE-A12",
        name: "İzmir → Manisa (Kuzey Hattı)",
        onTime: 88,
        deviationPct: 6,
        avgDays: 5.9,
        capacity: "Medium",
        risks: ["Rüzgâr uyarısı", "Giriş yoğunluğu"],
        recommendation: "Manisa Hub-01 giriş slotlarını öne çek. Alternatif hub: Turgutlu.",
      },
      {
        code: "RTE-C07",
        name: "Manisa → Balıkesir (İç Hat)",
        onTime: 79,
        deviationPct: 11,
        avgDays: 6.4,
        capacity: "High",
        risks: ["Hub kapasite yoğunluğu", "SLA sapma"],
        recommendation: "Kritik siparişleri önceliklendir. Çıkış slotu yeniden planla.",
      },
      {
        code: "RTE-B03",
        name: "İzmir → Aydın (Güney Hattı)",
        onTime: 92,
        deviationPct: 3,
        avgDays: 5.1,
        capacity: "Low",
        risks: ["Depo bant yoğunluğu (zaman zaman)"],
        recommendation: "Standart akış; hazırlık bantlarında mikro optimizasyon önerilir.",
      },
      {
        code: "RTE-D05",
        name: "İzmir → Bursa (Uzun Hat)",
        onTime: 86,
        deviationPct: 7,
        avgDays: 6.1,
        capacity: "Medium",
        risks: ["Köprü geçiş saatleri"],
        recommendation: "Geçiş penceresini 1 saat kaydır; sürücü dinlenme planını sabitle.",
      },
    ];

    const shipments = [
      {
        vehicle: "TRK-07",
        route: "RTE-A12",
        status: "On Route",
        lastScan: "03 Şub 16:40 • Akhisar",
        eta: "04 Şub 10:30",
        orderId: "ORD-204918",
        note: "Hız düşümü bekleniyor",
      },
      {
        vehicle: "TRK-12",
        route: "RTE-C07",
        status: "On Route",
        lastScan: "03 Şub 15:05 • Turgutlu",
        eta: "04 Şub 09:10",
        orderId: "ORD-205104",
        note: "Hub giriş yoğun",
      },
      {
        vehicle: "VAN-03",
        route: "RTE-B03",
        status: "Preparing",
        lastScan: "03 Şub 17:55 • İzmir DC-02",
        eta: "04 Şub 12:00",
        orderId: "ORD-205210",
        note: "Yükleme sırası",
      },
    ];

    const orderMap = Object.fromEntries(orders.map((o) => [o.id, o]));
    const routeMap = Object.fromEntries(routes.map((r) => [r.code, r]));
    return { orders, routes, shipments, orderMap, routeMap };
  }, []);

  const [ops, setOps] = useState(() => {
    const persisted = loadOps();
    return {
      selectedOrderId: persisted?.selectedOrderId || "ORD-204918",
      selectedRoute: persisted?.selectedRoute || "RTE-A12",
      riskLevel: persisted?.riskLevel || "",
      slaRemaining: typeof persisted?.slaRemaining === "number" ? persisted.slaRemaining : null,
    };
  });

  const [orderFilter, setOrderFilter] = useState(() => {
    const persisted = loadOps();
    return persisted?.orderFilter || "All";
  });

  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    saveOps({ ...ops, orderFilter });
  }, [ops, orderFilter]);

  useEffect(() => {
    const { order, route, status } = parseSearch(location.search);
    if (order && order !== ops.selectedOrderId) {
      setOps((prev) => ({
        ...prev,
        selectedOrderId: order,
        selectedRoute: seed.orderMap[order]?.route || prev.selectedRoute,
        riskLevel: seed.orderMap[order]?.risk || prev.riskLevel,
        slaRemaining: seed.orderMap[order]?.slaHoursRemaining ?? prev.slaRemaining,
      }));
    }
    if (route && route !== ops.selectedRoute) {
      setOps((prev) => ({ ...prev, selectedRoute: route }));
    }
    if (status && status !== orderFilter) setOrderFilter(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const title = useMemo(() => pageTitle(location.pathname), [location.pathname]);

  const selectOrder = (orderId, { navigateToOrders = false } = {}) => {
    const o = seed.orderMap[orderId];
    if (!o) return;
    setOps((prev) => ({
      ...prev,
      selectedOrderId: o.id,
      selectedRoute: o.route || prev.selectedRoute,
      riskLevel: o.risk || prev.riskLevel,
      slaRemaining: o.slaHoursRemaining ?? prev.slaRemaining,
    }));
    if (navigateToOrders) navigate(`/orders?order=${encodeURIComponent(o.id)}`);
  };

  const selectRoute = (routeCode, { navigateToRoutes = false } = {}) => {
    const r = seed.routeMap[routeCode];
    if (!r) return;
    setOps((prev) => ({ ...prev, selectedRoute: r.code }));
    if (navigateToRoutes) navigate(`/routes?route=${encodeURIComponent(r.code)}`);
  };

  const applyOrderFilter = (status) => {
    setOrderFilter(status);
    navigate(`/orders?status=${encodeURIComponent(status)}`);
  };

  const filteredOrders = useMemo(() => {
    if (orderFilter === "All") return seed.orders;
    if (orderFilter === "Preparing") return seed.orders.filter((o) => o.status === "Preparing");
    if (orderFilter === "On Route") return seed.orders.filter((o) => o.status === "On Route");
    if (orderFilter === "Risk") return seed.orders.filter((o) => (o.risk || "").toLowerCase().includes("high"));
    return seed.orders;
  }, [seed.orders, orderFilter]);

  const HomePage = () => {
    const highRisk = seed.orders.filter((o) => (o.risk || "").toLowerCase().includes("high")).length;
    const onRoute = seed.orders.filter((o) => o.status === "On Route").length;
    const preparing = seed.orders.filter((o) => o.status === "Preparing").length;

    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-[#F5F5DC] shadow-md p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Komuta Merkezi</div>
              <div className="mt-1 text-2xl font-semibold text-[#2B2B2B]">Operasyon Anlık Durum</div>
              <div className="mt-2 text-sm text-[#2B2B2B]/75 leading-relaxed">
                Riskli siparişleri tespit et, rota sapmalarını gör, AI ile aksiyon planı üret.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-[#2D4F1E] text-[#F5F5DC] shadow-sm hover:shadow-md active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/40"
                >
                  <Bot size={18} />
                  <span className="font-semibold">AI Karar Merkezi</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/orders?status=Risk")}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-[#4B3621]/10 text-[#4B3621] shadow-sm hover:shadow-md active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
                >
                  <TriangleAlert size={18} />
                  <span className="font-semibold">Riskli Siparişler</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/routes")}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-[#E6E6E6]/70 text-[#2B2B2B] shadow-sm hover:shadow-md active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
                >
                  <RouteIcon size={18} className="text-[#4B3621]" />
                  <span className="font-semibold">Rota Performansı</span>
                </button>
              </div>
            </div>

            <div className="hidden xl:block w-[360px]">
              <div className="rounded-2xl bg-[#E6E6E6]/55 p-5 shadow-sm border border-[#2B2B2B]/8">
                <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Kısa Özet</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#2B2B2B]/75">Aktif sevkiyat</span>
                    <span className="font-semibold">{onRoute}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#2B2B2B]/75">Hazırlık kuyruğu</span>
                    <span className="font-semibold">{preparing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#2B2B2B]/75">Kritik risk</span>
                    <span className="font-semibold text-[#4B3621]">{highRisk}</span>
                  </div>
                </div>
                <div className="mt-4 text-[11px] text-[#2B2B2B]/60 leading-relaxed">
                  Sipariş/rota tıklamaları sağ paneli günceller. AI yanıtları seçimleri otomatik yakalar.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPI title="Bugün Sevkiyat" value={`${onRoute}`} meta="Aktif araçlar & hat görünümü" icon={Truck} />
          <KPI title="Kritik Risk" value={`${highRisk}`} meta="SLA / kapasite / hava kaynaklı" icon={TriangleAlert} tone="brown" />
          <KPI title="Hazırlık Kuyruğu" value={`${preparing}`} meta="Depo bant ve çıkış slotları" icon={Timer} />
        </div>
      </div>
    );
  };

  const Orders = () => {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-[#F5F5DC] shadow-md p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Filtre</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Pill active={orderFilter === "All"} onClick={() => applyOrderFilter("All")} tone="neutral">
                  <Filter size={14} />
                  Tümü
                </Pill>
                <Pill active={orderFilter === "Preparing"} onClick={() => applyOrderFilter("Preparing")} tone="green">
                  Hazırlanıyor
                </Pill>
                <Pill active={orderFilter === "On Route"} onClick={() => applyOrderFilter("On Route")} tone="brown">
                  Yolda
                </Pill>
                <Pill active={orderFilter === "Risk"} onClick={() => applyOrderFilter("Risk")} tone="brown">
                  <TriangleAlert size={14} />
                  Riskli
                </Pill>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[#2D4F1E] text-[#F5F5DC] shadow-sm hover:shadow-md active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/40"
            >
              <Bot size={16} />
              <span className="text-sm font-semibold">AI ile değerlendir</span>
            </button>
          </div>
        </div>

        <Section subtitle="Sipariş Yönetimi" title="Aktif Sipariş Akışı">
          <DataTable
            columns={["Sipariş", "Müşteri", "Durum", "Öncelik", "SLA", "Rota", "ETA"]}
            onRowClick={(row) => selectOrder(row.id)}
            rows={filteredOrders.map((o) => ({
              __row: o,
              cells: [
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOrder(o.id, { navigateToOrders: true });
                  }}
                  className="font-semibold text-[#2D4F1E] hover:underline focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35 rounded"
                >
                  {o.id}
                </button>,
                o.customer,
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${o.status === "On Route" ? "bg-[#4B3621]/10 text-[#4B3621]" : "bg-[#2D4F1E]/10 text-[#2D4F1E]"}`}>
                  {o.status === "On Route" ? "Yolda" : "Hazırlanıyor"}
                </span>,
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${o.priority === "Critical" ? "bg-[#4B3621]/15 text-[#4B3621]" : o.priority === "High" ? "bg-[#4B3621]/10 text-[#4B3621]" : "bg-[#2B2B2B]/8 text-[#2B2B2B]/75"}`}>
                  {o.priority === "Critical" ? "Kritik" : o.priority === "High" ? "Yüksek" : "Normal"}
                </span>,
                <span className={`font-semibold ${o.slaHoursRemaining <= 8 ? "text-[#4B3621]" : "text-[#2B2B2B]"}`}>{o.slaHoursRemaining} saat</span>,
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectRoute(o.route, { navigateToRoutes: true });
                  }}
                  className="font-semibold text-[#4B3621] hover:underline focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35 rounded"
                >
                  {o.route}
                </button>,
                <span className="text-[#2B2B2B]/75">{o.eta}</span>,
              ],
            }))}
          />
        </Section>
      </div>
    );
  };

  const Shipments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI title="Yolda Araç" value={`${seed.shipments.filter((s) => s.status === "On Route").length}`} meta="Aktif sevkiyatlar" icon={Truck} />
        <KPI title="Kritik Hat" value={`${seed.routes.filter((r) => r.capacity === "High").length}`} meta="Kapasite yoğunluğu" icon={TriangleAlert} tone="brown" />
        <KPI title="Ortalama ETA" value="6.1g" meta="Son 7 gün trend" icon={TrendingUp} />
      </div>

      <Section subtitle="Sevkiyat" title="Aktif Hat İzleme">
        <DataTable
          columns={["Araç", "Sipariş", "Rota", "Durum", "Son Okuma", "ETA", "Not"]}
          onRowClick={(row) => {
            if (row.orderId) selectOrder(row.orderId, { navigateToOrders: true });
            if (row.route) selectRoute(row.route, { navigateToRoutes: true });
          }}
          rows={seed.shipments.map((s) => ({
            __row: s,
            cells: [
              <span className="font-semibold">{s.vehicle}</span>,
              <span className="font-semibold text-[#2D4F1E]">{s.orderId}</span>,
              <span className="font-semibold text-[#4B3621]">{s.route}</span>,
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${s.status === "On Route" ? "bg-[#4B3621]/10 text-[#4B3621]" : "bg-[#2D4F1E]/10 text-[#2D4F1E]"}`}>
                {s.status === "On Route" ? "Yolda" : "Hazırlanıyor"}
              </span>,
              <span className="text-[#2B2B2B]/75">{s.lastScan}</span>,
              <span className="text-[#2B2B2B]/75">{s.eta}</span>,
              <span className="text-[#2B2B2B]/75">{s.note}</span>,
            ],
          }))}
        />
      </Section>
    </div>
  );

  const RoutesView = () => (
    <div className="space-y-6">
      <Section
        subtitle="Rota Analizi"
        title="Rota Performans Özeti"
        action={
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[#2D4F1E] text-[#F5F5DC] shadow-sm hover:shadow-md active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/40"
          >
            <Bot size={16} />
            <span className="text-sm font-semibold">AI ile rota analizi</span>
          </button>
        }
      >
        <DataTable
          columns={["Rota", "Ad", "On-time", "Sapma", "Ortalama", "Kapasite", "Öneri"]}
          onRowClick={(row) => selectRoute(row.code, { navigateToRoutes: true })}
          rows={seed.routes.map((r) => ({
            __row: r,
            cells: [
              <span className="font-semibold text-[#4B3621]">{r.code}</span>,
              <span className="text-[#2B2B2B]/80">{r.name}</span>,
              <span className="font-semibold">{r.onTime}%</span>,
              <span className={`font-semibold ${r.deviationPct >= 10 ? "text-[#4B3621]" : "text-[#2D4F1E]"}`}>+{r.deviationPct}%</span>,
              <span className="text-[#2B2B2B]/75">{r.avgDays}g</span>,
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${r.capacity === "High" ? "bg-[#4B3621]/15 text-[#4B3621]" : r.capacity === "Medium" ? "bg-[#4B3621]/10 text-[#4B3621]" : "bg-[#2D4F1E]/10 text-[#2D4F1E]"}`}>
                {r.capacity === "High" ? "Yüksek" : r.capacity === "Medium" ? "Orta" : "Düşük"}
              </span>,
              <span className="text-[#2B2B2B]/75">{r.recommendation}</span>,
            ],
          }))}
        />
      </Section>
    </div>
  );

  // ✅ TEK Chat bileşeni (ÇİFTE TANIM YOK)
  const Chat = () => (
    <div className="h-full">
      <ChatWindow
        ops={ops}
        onSelectOrder={(id, opts) => selectOrder(id, opts)}
        onSelectRoute={(code, opts) => selectRoute(code, opts)}
        onOpsPatch={(patch) => setOps((prev) => ({ ...prev, ...patch }))}
        orderMap={seed.orderMap}
        routeMap={seed.routeMap}
      />
    </div>
  );

  const Contact = () => (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#F5F5DC] shadow-md p-6">
        <div className="text-xs uppercase tracking-wide text-[#2B2B2B]/60">Destek Merkezi</div>
        <div className="mt-1 text-2xl font-semibold text-[#2B2B2B]">İletişim & Escalation</div>
        <div className="mt-2 text-sm text-[#2B2B2B]/75 leading-relaxed">
          Kritik gecikme, SLA sapması veya rota blokajında hızlı destek kanalları.
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#E6E6E6]/55 p-5 shadow-sm border border-[#2B2B2B]/8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Operasyon Destek</div>
                <div className="text-xs text-[#2B2B2B]/60 mt-1">Vardiya masası</div>
              </div>
              <Headset size={18} className="text-[#2D4F1E]" />
            </div>
            <div className="mt-3 space-y-2 text-sm text-[#2B2B2B]/80">
              <div className="flex items-center gap-2"><PhoneCall size={16} className="text-[#4B3621]" /> +90 312 000 00 00</div>
              <div className="flex items-center gap-2"><Mail size={16} className="text-[#4B3621]" /> ops.support@example.com</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#E6E6E6]/55 p-5 shadow-sm border border-[#2B2B2B]/8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Sistem Sağlığı</div>
                <div className="text-xs text-[#2B2B2B]/60 mt-1">IT & entegrasyon</div>
              </div>
              <CircleHelp size={18} className="text-[#2B2B2B]/70" />
            </div>
            <div className="mt-3 text-sm text-[#2B2B2B]/80">
              AI’a “API gecikmesi / event akışı” sor, yanıtı ticket’a ekle.
            </div>
          </div>

          <div className="rounded-2xl bg-[#E6E6E6]/55 p-5 shadow-sm border border-[#2B2B2B]/8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">SLA Bildirimi</div>
                <div className="text-xs text-[#2B2B2B]/60 mt-1">Müşteri iletişimi</div>
              </div>
              <ShieldCheck size={18} className="text-[#2D4F1E]" />
            </div>
            <div className="mt-3 text-sm text-[#2B2B2B]/80">
              Siparişi seç → AI’dan “müşteriye durum/ETA metni” iste.
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-[#2D4F1E] text-[#F5F5DC] shadow-sm hover:shadow-md active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/40"
          >
            <Bot size={18} />
            <span className="font-semibold">AI ile hızlı teşhis</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/orders?status=Risk")}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-[#4B3621]/10 text-[#4B3621] shadow-sm hover:shadow-md active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
          >
            <TriangleAlert size={18} />
            <span className="font-semibold">Riskli siparişleri aç</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden font-sans bg-[#E6E6E6] text-[#2B2B2B]">
      <div className="h-full grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <main className="h-full overflow-hidden">
          <div className="h-full flex flex-col p-4 lg:p-6 gap-4 lg:gap-6">
            <TopBar title={title} ops={ops} />

            <div className="flex-1 overflow-hidden">
              <div className="h-full grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-8 overflow-y-auto pb-6 pr-0 xl:pr-1">
                  <div className="max-w-[1400px] mx-auto space-y-6">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/overview" element={<HomePage />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/shipments" element={<Shipments />} />
                      <Route path="/routes" element={<RoutesView />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </div>

                <div className="xl:col-span-4 overflow-y-auto pb-6">
                  <OrderTrackingCard
                    ops={ops}
                    order={ops.selectedOrderId ? seed.orderMap[ops.selectedOrderId] : null}
                    route={ops.selectedRoute ? seed.routeMap[ops.selectedRoute] : null}
                    onNavigateOrder={(id) => {
                      if (!id) return;
                      selectOrder(id);
                      navigate(`/orders?order=${encodeURIComponent(id)}`);
                    }}
                    onNavigateRoute={(code) => {
                      if (!code) return;
                      selectRoute(code);
                      navigate(`/routes?route=${encodeURIComponent(code)}`);
                    }}
                    onAskAI={() => navigate("/chat")}
                    onSetFilter={(status) => applyOrderFilter(status)}
                  />
                </div>
              </div>
            </div>

            <footer className="text-[11px] text-[#2B2B2B]/55 px-1">
              Live operasyon görünümü • URL tabanlı navigasyon • Durum seçimi tüm sayfalarda senkron
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
  
 


