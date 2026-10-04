import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartBarProps {
  items: CartItem[];
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ items, onOpenCart }) => {
  if (items.length === 0) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 pointer-events-none animate-in slide-in-from-bottom duration-300">
      <div
        onClick={onOpenCart}
        className="pointer-events-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl p-3 sm:p-4 shadow-2xl shadow-emerald-950 flex items-center justify-between cursor-pointer border border-emerald-400/30 transition-transform active:scale-98"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100">
              <span>{totalCount} {totalCount === 1 ? 'ITEM' : 'ITEMS'}</span>
              <span>·</span>
              <span className="font-mono text-white text-sm">₹{totalPrice}</span>
            </div>
            <p className="text-[11px] text-emerald-200">⚡ 10 mins delivery guaranteed</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-3.5 py-1.5 rounded-xl font-extrabold text-xs tracking-wider transition-colors">
          <span>VIEW BASKET</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
