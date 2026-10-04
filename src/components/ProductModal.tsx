import React from 'react';
import { Product } from '../types';
import { X, Star, Zap, Clock, ShieldCheck, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { sounds } from '../services/audio';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (p: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header with image */}
        <div className="relative bg-neutral-950 p-6 flex items-center justify-center border-b border-neutral-800 min-h-[260px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Discount badge */}
          {product.discountPercent > 0 && (
            <span className="absolute top-4 left-4 z-10 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
              {product.discountPercent}% OFF
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-contain rounded-xl hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute bottom-3 left-4 bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>⚡ {product.deliveryTimeMins} mins delivery</span>
          </div>
        </div>

        {/* Product Details Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              {product.brand}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
              <span className="text-neutral-300 font-medium">{product.weight}</span>
              <span>·</span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
              </div>
              {product.origin && (
                <>
                  <span>·</span>
                  <span className="text-neutral-400">Origin: {product.origin}</span>
                </>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm line-through text-neutral-400 font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                Inclusive of all taxes & handling
              </p>
            </div>

            {/* Stepper or Add button */}
            {cartQuantity === 0 ? (
              <button
                onClick={() => {
                  sounds.playAddToCart();
                  onAddToCart(product);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            ) : (
              <div className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden font-bold shadow-lg shadow-emerald-900/40">
                <button
                  onClick={() => {
                    sounds.playAddToCart();
                    onUpdateQuantity(product.id, cartQuantity - 1);
                  }}
                  className="px-3.5 py-2 hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-mono text-sm">{cartQuantity}</span>
                <button
                  onClick={() => {
                    sounds.playAddToCart();
                    onUpdateQuantity(product.id, cartQuantity + 1);
                  }}
                  className="px-3.5 py-2 hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Product Overview
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Nutritional Breakdown if available */}
          {product.nutrients && (
            <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nutritional Values</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                {Object.entries(product.nutrients).map(([key, val]) => (
                  <div key={key} className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                      {key}
                    </span>
                    <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shelf Life & Storage */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-neutral-950/40 border border-neutral-800 p-3 rounded-xl">
              <span className="text-neutral-400 block font-medium">Shelf Life</span>
              <span className="text-white font-semibold mt-0.5 block">{product.shelfLife || 'Check packaging date'}</span>
            </div>
            <div className="bg-neutral-950/40 border border-neutral-800 p-3 rounded-xl">
              <span className="text-neutral-400 block font-medium">Dark Store Assurance</span>
              <span className="text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Quality Checked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
