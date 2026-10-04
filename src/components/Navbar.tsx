import React from 'react';
import { Address, Order } from '../types';
import { 
  Search, ShoppingBag, MapPin, ChevronDown, Clock, 
  Store, Receipt, Volume2, VolumeX, Smartphone, Monitor, Zap
} from 'lucide-react';
import { sounds } from '../services/audio';

interface NavbarProps {
  currentAddress: Address;
  onOpenAddressModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeOrders: Order[];
  onOpenOrders: () => void;
  onOpenStoreManager: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAddress,
  onOpenAddressModal,
  searchQuery,
  onSearchChange,
  cartItemCount,
  cartTotal,
  onOpenCart,
  activeOrders,
  onOpenOrders,
  onOpenStoreManager,
  soundEnabled,
  onToggleSound,
  isMobileView,
  onToggleMobileView
}) => {
  return (
    <header className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Location Header */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950 font-black text-base">
                ⚡
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-lg text-white tracking-tight flex items-center gap-1">
                  Quick<span className="text-emerald-400">Basket</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-widest -mt-1 font-mono">
                  10 MIN DELIVERY
                </span>
              </div>
            </div>

            {/* Location Selector */}
            <button
              onClick={onOpenAddressModal}
              className="text-left bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 rounded-xl px-2.5 sm:px-3 py-1.5 transition-colors flex items-center gap-2 group max-w-[140px] sm:max-w-[220px]"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate">{currentAddress.label}:</span>
                  <span className="text-[11px] text-emerald-400 font-bold">11 Mins</span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">
                  {currentAddress.title}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0 ml-auto" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search milk, chips, apples, chocolate, cold drinks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Utilities & Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Toggle: Mobile Frame vs Wide */}
            <button
              onClick={onToggleMobileView}
              title={isMobileView ? "Switch to Wide Desktop View" : "Switch to Mobile App Preview"}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs hidden lg:flex items-center gap-1.5 transition-colors"
            >
              {isMobileView ? (
                <>
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-[11px]">Wide Mode</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-[11px]">Mobile Shell</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? "Mute chimes" : "Enable sound chimes"}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark Store Operator Console */}
            <button
              onClick={onOpenStoreManager}
              title="Open Dark Store Operator Hub"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline font-semibold">Store Ops</span>
            </button>

            {/* Orders History & Live Tracker */}
            <button
              onClick={onOpenOrders}
              className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-semibold">Orders</span>
              {activeOrders.length > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
            </button>

            {/* Main Cart Button */}
            <button
              onClick={onOpenCart}
              className="py-1.5 px-3 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-[11px] font-mono">
                    {cartItemCount}
                  </span>
                  <span className="font-mono hidden sm:inline">₹{cartTotal}</span>
                </div>
              ) : (
                <span>Cart</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input (Visible on small screens) */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 10-min groceries..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
