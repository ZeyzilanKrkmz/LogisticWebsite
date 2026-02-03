// frontend/src/components/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  ClipboardList,
  Truck,
  Route,
  Bot,
  Headset,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Ana Sayfa", icon: Home, path: "/" },
  { label: "Genel Bakış", icon: LayoutDashboard, path: "/overview" },
  { label: "Siparişler", icon: ClipboardList, path: "/orders" },
  { label: "Sevkiyat", icon: Truck, path: "/shipments" },
  { label: "Rotalar", icon: Route, path: "/routes" },
  { label: "AI Chatbot", icon: Bot, path: "/chat" },
  { label: "İletişim", icon: Headset, path: "/contact" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const items = useMemo(() => navItems, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-2xl bg-[#F5F5DC] shadow-md px-3 py-2 text-[#2B2B2B] hover:shadow-sm active:scale-[0.99] transition focus-visible:ring-2 focus-visible:ring-[#2D4F1E]/35"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={[
          "lg:hidden fixed inset-0 z-40 transition",
          open ? "bg-black/35" : "pointer-events-none bg-transparent",
        ].join(" ")}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        className={[
          "fixed lg:static top-0 left-0 z-50 h-full w-[280px] shrink-0",
          "bg-[#1F3A14] text-[#F5F5DC]",
          "shadow-md lg:shadow-none",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 pt-6 pb-4">
            <div className="rounded-2xl bg-[#2D4F1E]/35 px-4 py-4 shadow-sm">
              <div className="text-[13px] uppercase tracking-wider text-[#F5F5DC]/80">
                Logistics Platform
              </div>
              <div className="mt-1 text-lg font-semibold text-[#F5F5DC]">
                EarthTech Control
              </div>
              <div className="mt-2 text-xs text-[#F5F5DC]/70 leading-relaxed">
                Operasyon • Görünürlük • Karar Destek
              </div>
            </div>
          </div>

          <nav className="px-3 pb-6">
            <div className="px-3 text-xs font-semibold tracking-wide text-[#F5F5DC]/60 uppercase">
              Navigasyon
            </div>

            <div className="mt-3 space-y-1">
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <NavLink
                    key={it.path}
                    to={it.path}
                    end={it.path === "/"}
                    className={({ isActive }) =>
                      [
                        "w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition outline-none",
                        "hover:bg-[#2D4F1E]/25 focus-visible:ring-2 focus-visible:ring-[#F5F5DC]/40",
                        isActive ? "bg-[#2D4F1E]/30 shadow-sm" : "bg-transparent",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={[
                            "h-9 w-9 rounded-2xl grid place-items-center",
                            isActive ? "bg-[#2D4F1E]/35" : "bg-[#2D4F1E]/15",
                          ].join(" ")}
                        >
                          <Icon size={18} className="text-[#F5F5DC]" />
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#F5F5DC] truncate">
                            {it.label}
                          </div>
                          <div className="text-[11px] text-[#F5F5DC]/65 truncate">
                            {it.path === "/" && "Operasyon komuta merkezi"}
                            {it.path === "/overview" && "KPI & risk görünümü"}
                            {it.path === "/orders" && "Sipariş akışı & SLA"}
                            {it.path === "/shipments" && "Sevkiyat takibi"}
                            {it.path === "/routes" && "Rota performansı"}
                            {it.path === "/chat" && "Karar destek asistanı"}
                            {it.path === "/contact" && "Destek & acil iletişim"}
                          </div>
                        </div>

                        <span
                          className={[
                            "h-10 w-[3px] rounded-full transition",
                            isActive ? "bg-[#F5F5DC]" : "bg-transparent",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto px-5 pb-6">
            <div className="rounded-2xl bg-[#2D4F1E]/20 px-4 py-4 shadow-sm">
              <div className="text-xs text-[#F5F5DC]/70">Durum</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-sm font-semibold text-[#F5F5DC]">
                  Operasyon İzleme
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-[#F5F5DC]/15 text-[#F5F5DC]">
                  Live
                </span>
              </div>
              <div className="mt-2 text-[11px] leading-relaxed text-[#F5F5DC]/70">
                Kritik gecikme ve sapma sinyalleri üst barda görünür.
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}