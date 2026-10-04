import React, { useEffect, useState } from 'react';
import { DeliveryRider, OrderStatus } from '../types';
import { Store, Navigation, MapPin, ShieldCheck, Zap } from 'lucide-react';

interface TrackingMapProps {
  rider: DeliveryRider;
  orderStatus: OrderStatus;
  userAddressTitle: string;
  progressPercent: number; // 0 to 100
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  rider,
  orderStatus,
  userAddressTitle,
  progressPercent
}) => {
  // Road path points in SVG coordinate space (800 x 400)
  // Dark Store at (100, 300), User Home at (700, 100)
  const pathData = "M 100 320 C 220 320, 240 220, 360 220 C 460 220, 480 120, 700 120";

  // Calculate position along curve based on progressPercent
  const [riderCoords, setRiderCoords] = useState<{ x: number; y: number; angle: number }>({
    x: 100,
    y: 320,
    angle: 0
  });

  useEffect(() => {
    // Create an invisible SVG path to accurately sample coordinates & tangent angle
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttribute("d", pathData);
    const totalLen = svgPath.getTotalLength();
    
    // clamp progress
    const p = Math.max(0, Math.min(100, progressPercent)) / 100;
    const currentDist = totalLen * p;
    const pt = svgPath.getPointAtLength(currentDist);
    
    // Look ahead a tiny bit to find heading angle
    const nextPt = svgPath.getPointAtLength(Math.min(totalLen, currentDist + 2));
    const dx = nextPt.x - pt.x;
    const dy = nextPt.y - pt.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    setRiderCoords({ x: pt.x, y: pt.y, angle });
  }, [progressPercent]);

  const remainingMeters = Math.max(0, Math.round((1 - progressPercent / 100) * 1400));
  const remainingMins = Math.max(1, Math.ceil((1 - progressPercent / 100) * 10));

  return (
    <div className="relative w-full h-72 sm:h-80 bg-neutral-900 rounded-2xl overflow-hidden shadow-inner border border-neutral-800 select-none">
      {/* City Map Grid & Road Canvas */}
      <svg className="w-full h-full object-cover" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.8" strokeDasharray="3 3" />
          </pattern>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Map Background Grid */}
        <rect width="100%" height="100%" fill="#171717" />
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Secondary City Streets */}
        <path d="M 0 160 L 800 160" stroke="#262626" strokeWidth="18" fill="none" />
        <path d="M 0 280 L 800 280" stroke="#262626" strokeWidth="16" fill="none" />
        <path d="M 280 0 L 280 400" stroke="#262626" strokeWidth="16" fill="none" />
        <path d="M 540 0 L 540 400" stroke="#262626" strokeWidth="18" fill="none" />

        {/* Park Greenery Area */}
        <rect x="420" y="240" width="100" height="90" rx="8" fill="#14532d" fillOpacity="0.25" stroke="#166534" strokeWidth="1" strokeDasharray="2 2" />
        <text x="440" y="290" fill="#22c55e" fontSize="10" fontFamily="sans-serif" opacity="0.6">Lake Park</text>

        {/* Lake / Water Body */}
        <path d="M 120 40 Q 200 70 240 20 Q 220 100 110 90 Z" fill="#0369a1" fillOpacity="0.3" stroke="#0284c7" strokeWidth="1" />
        <text x="145" y="70" fill="#38bdf8" fontSize="9" fontFamily="sans-serif" opacity="0.7">Bellandur Lake</text>

        {/* Outer Ring Road Tag */}
        <text x="560" y="380" fill="#737373" fontSize="10" fontFamily="sans-serif" letterSpacing="1">RING ROAD SPEEDWAY</text>

        {/* Main Delivery Route Under-glow */}
        <path
          d={pathData}
          fill="none"
          stroke="#059669"
          strokeWidth="10"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />

        {/* Main Delivery Route Line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="8 4"
        />

        {/* Pulsing Destination Waves */}
        <circle cx="700" cy="120" r="32" fill="#3b82f6" fillOpacity="0.15" className="animate-ping-slow origin-center" />
        <circle cx="700" cy="120" r="18" fill="#3b82f6" fillOpacity="0.3" />

        {/* Destination Pin (User's House) */}
        <g transform="translate(686, 96)">
          <circle cx="14" cy="14" r="16" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M 14 6 C 10 6 7 9 7 13 C 7 18 14 24 14 24 C 14 24 21 18 21 13 C 21 9 18 6 14 6 Z" fill="#ffffff" transform="scale(0.8) translate(3.5, 3.5)" />
        </g>
        <rect x="635" y="60" width="130" height="24" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="700" y="76" fill="#f8fafc" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
          Your Location
        </text>

        {/* Dark Store Warehouse Hub */}
        <g transform="translate(86, 306)">
          <circle cx="14" cy="14" r="18" fill="#047857" stroke="#10b981" strokeWidth="2" />
          {/* Store Icon */}
          <rect x="7" y="10" width="14" height="10" rx="1.5" fill="#ffffff" />
          <polygon points="5,10 14,5 23,10" fill="#a7f3d0" />
        </g>
        <rect x="40" y="350" width="130" height="24" rx="12" fill="#064e3b" stroke="#059669" strokeWidth="1" />
        <text x="105" y="366" fill="#a7f3d0" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
          Dark Store #07
        </text>

        {/* Animated Rider Marker */}
        <g
          transform={`translate(${riderCoords.x}, ${riderCoords.y})`}
          className="transition-transform duration-700 ease-out"
        >
          {/* Rider Pulsing Radar */}
          <circle cx="0" cy="0" r="22" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
          {/* Rider Outer Circle */}
          <circle cx="0" cy="0" r="15" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="url(#glow)" />
          {/* Rider Bike SVG icon inside */}
          <g transform={`rotate(${riderCoords.angle}) translate(-8, -8) scale(0.7)`}>
            <path
              d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h1"
              stroke="#ffffff"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="6" cy="17" r="3" fill="#ffffff" />
            <circle cx="17" cy="17" r="3" fill="#ffffff" />
          </g>
        </g>
      </svg>

      {/* Floating Speed & Radar HUD */}
      <div className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-xl px-3 py-2 flex items-center gap-3 text-xs shadow-xl">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>LIVE GPS</span>
        </div>
        <div className="h-3 w-px bg-neutral-700" />
        <div className="flex items-center gap-1 text-neutral-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono">24 km/h</span>
        </div>
        <div className="h-3 w-px bg-neutral-700" />
        <div className="text-neutral-300">
          <span className="font-mono text-emerald-400 font-bold">{remainingMeters}m</span> remaining
        </div>
      </div>

      {/* Floating Status Pill */}
      <div className="absolute top-3 right-3 bg-emerald-600/95 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
        <Navigation className="w-3.5 h-3.5 animate-pulse" />
        <span>ETA: {remainingMins} MINS</span>
      </div>

      {/* Bottom Road Info Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-400 px-1 pointer-events-none">
        <span className="flex items-center gap-1 text-emerald-300 bg-neutral-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-neutral-800">
          <Store className="w-3 h-3 text-emerald-400" /> Hub #07 Dispatch
        </span>
        <span className="flex items-center gap-1 text-sky-300 bg-neutral-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-neutral-800">
          <MapPin className="w-3 h-3 text-sky-400" /> {userAddressTitle}
        </span>
      </div>
    </div>
  );
};
