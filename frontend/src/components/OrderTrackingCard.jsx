import React from "react";
import { MapPin, Truck, Clock } from "lucide-react";

export default function OrderTrackingCard({
  orderId = "TRK-20491",
  status = "Yolda",
  from = "Aliağa Depo",
  to = "İzmir Merkez",
  eta = "2s 15dk",
  progress = 62,
}) {
  return (
    <div className="rounded-2xl bg-white border border-earth/10 shadow-soft p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-earth/60">Canlı Takip</p>
          <h3 className="text-sm font-bold text-earth">{orderId}</h3>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 text-forest px-3 py-1 text-xs font-semibold border border-forest/20">
          <Truck className="h-4 w-4" />
          {status}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-earth/80">
          <MapPin className="h-4 w-4 text-earth/60" />
          <span className="font-semibold">{from}</span>
          <span className="text-earth/40">→</span>
          <span className="font-semibold">{to}</span>
        </div>
        <div className="flex items-center gap-2 text-earth/80">
          <Clock className="h-4 w-4 text-earth/60" />
          <span>Tahmini varış:</span>
          <span className="font-semibold">{eta}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-earth/60">
          <span>İlerleme</span>
          <span className="font-semibold text-earth">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-earth/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-forest"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
