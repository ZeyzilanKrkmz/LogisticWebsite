import React from "react";
import { Route, Leaf, History, X } from "lucide-react";
import OrderTrackingCard from "./OrderTrackingCard";

const routes = [
  { id: 1, name: "Aliağa → Manisa", meta: "Bugün 10:30" },
  { id: 2, name: "İzmir → Aydın", meta: "Dün 16:10" },
  { id: 3, name: "Manisa → Balıkesir", meta: "28 Oca 09:05" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-earth/40 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "fixed z-50 md:static md:z-auto",
          "top-0 left-0 h-full md:h-auto",
          "w-[86%] max-w-[360px] md:w-full",
          "bg-sand md:bg-transparent",
          "p-4 md:p-0",
          "transition-transform md:transition-none",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="rounded-3xl bg-sand md:bg-white md:border md:border-earth/10 md:shadow-soft p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-forest grid place-items-center shadow-sm">
                <Leaf className="h-6 w-6 text-sand" />
              </div>
              <div>
                <p className="text-xs text-earth/60">Kullanıcı Profili</p>
                <p className="text-sm font-bold text-earth">Operasyon Sorumlusu</p>
                <p className="text-xs text-earth/60">Lojistik Kontrol Paneli</p>
              </div>
            </div>

            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-earth/15 bg-white"
              onClick={onClose}
              aria-label="Kapat"
            >
              <X className="h-5 w-5 text-earth" />
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2 text-earth font-semibold">
              <History className="h-4 w-4 text-earth/70" />
              <span className="text-sm">Geçmiş Rotalar</span>
            </div>

            <div className="mt-3 space-y-2">
              {routes.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-white border border-earth/10 px-4 py-3 hover:border-forest/30 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-earth truncate">
                        {r.name}
                      </p>
                      <p className="text-xs text-earth/60">{r.meta}</p>
                    </div>
                    <Route className="h-4 w-4 text-forest shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <OrderTrackingCard />
          </div>
        </div>
      </aside>
    </>
  );
}