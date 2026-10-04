import React from 'react';
import { Product } from '../types';
import { Plus, Minus, Zap, Star } from 'lucide-react';
import { sounds } from '../services/audio';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (p: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails
}) => {
  return (
    <div className="group relative bg-neutral-900 border border-neutral-800/90 hover:border-neutral-700/80 rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/40">
      {/* Top Image Area */}
      <div className="relative w-full aspect-square bg-neutral-950/70 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer mb-2.5">
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-emerald-600/95 backdrop-blur-sm text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
            {product.discountPercent}% OFF
          </div>
        )}

        {/* 10-Min Fast Delivery Badge */}
        <div className="absolute bottom-2 left-2 z-10 bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
          <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" />
          <span>{product.deliveryTimeMins} MINS</span>
        </div>

        {/* Stock warning if low */}
        {product.stockCount <= 10 && product.stockCount > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
            Only {product.stockCount} left
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          onClick={() => onOpenDetails(product)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Meta info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Unit / Weight */}
          <span className="text-[11px] font-medium text-neutral-400 block line-clamp-1">
            {product.weight}
          </span>

          {/* Product Name */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-xs sm:text-sm font-semibold text-white mt-1 line-clamp-2 hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Rating & Brand */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
          <span className="truncate max-w-[80px] text-neutral-400 font-medium">{product.brand}</span>
          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
            <Star className="w-3 h-3 fill-amber-400" /> {product.rating}
          </span>
        </div>

        {/* Pricing and Action Button */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800/80">
          <div>
            <span className="text-sm sm:text-base font-extrabold text-white font-mono block">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through font-mono block -mt-0.5">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Interactive Stepper Button */}
          {!product.inStock || product.stockCount === 0 ? (
            <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800 px-2 py-1 rounded-lg">
              Out of stock
            </span>
          ) : quantity === 0 ? (
            <button
              onClick={() => {
                sounds.playAddToCart();
                onAddToCart(product);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-bold tracking-wide transition-all duration-150 flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center bg-emerald-600 text-white rounded-lg overflow-hidden font-bold shadow-md shadow-emerald-950">
              <button
                onClick={() => {
                  sounds.playAddToCart();
                  onUpdateQuantity(product.id, quantity - 1);
                }}
                className="px-2 py-1 hover:bg-emerald-700 active:bg-emerald-800 transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-mono select-none">{quantity}</span>
              <button
                onClick={() => {
                  sounds.playAddToCart();
                  onUpdateQuantity(product.id, quantity + 1);
                }}
                className="px-2 py-1 hover:bg-emerald-700 active:bg-emerald-800 transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
