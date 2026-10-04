import React from 'react';
import { Zap, Clock, ShieldCheck, Sparkles, Bike, ThermometerSnowflake } from 'lucide-react';
import { DARK_STORE_INFO } from '../data/addresses';

export const DeliveryBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-teal-950/50 border border-emerald-500/25 p-4 sm:p-6 shadow-xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left copy */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>10-Minute Quick Commerce</span>
            </span>
            <span className="text-neutral-400 text-xs hidden sm:inline">·</span>
            <span className="text-xs text-neutral-300 hidden sm:inline font-medium">
              Dark Store #07 Active
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            Farm Fresh Fruits, Packed Snacks & Sweets at Your Doorstep
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Ultra-fast delivery powered by neighborhood automated micro-warehouses. Zero compromises on cold-chain freshness.
          </p>

          {/* Value props */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Avg 11 min delivery</span>
            </span>
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-400" />
              <span>Chilled cold-chain</span>
            </span>
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Quality checked</span>
            </span>
          </div>
        </div>

        {/* Right side interactive graphic */}
        <div className="shrink-0 bg-neutral-950/80 border border-neutral-800/90 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 shadow-lg">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl">
              ⚡
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-950" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Fast Lane Ready</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {DARK_STORE_INFO.activeRidersCount} EV delivery heroes active nearby
            </p>
            <p className="text-[10px] text-emerald-400 font-mono font-semibold mt-0.5">
              FREE delivery on orders &gt; ₹199
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
