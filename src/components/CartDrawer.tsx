import React, { useState } from 'react';
import { CartItem, Address, Coupon } from '../types';
import { PROMO_COUPONS } from '../data/coupons';
import { 
  X, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, 
  MapPin, Clock, Heart, Sparkles, Check, ChevronRight, Info
} from 'lucide-react';
import { sounds } from '../services/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  address: Address;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (cartSummary: {
    itemTotal: number;
    discount: number;
    deliveryFee: number;
    handlingFee: number;
    tip: number;
    couponDiscount: number;
    total: number;
    appliedCoupon?: Coupon;
    deliveryInstruction: string;
  }) => void;
  onChangeAddress: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  address,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  onChangeAddress
}) => {
  if (!isOpen) return null;

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(20);
  const [deliveryInstruction, setDeliveryInstruction] = useState<string>('Leave at door');

  // Calculations
  const itemTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalMrp = items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const productDiscount = Math.max(0, totalMrp - itemTotal);

  // Delivery fee rules (Free above 199, else 25)
  const freeDeliveryThreshold = 199;
  const isFreeDelivery = itemTotal >= freeDeliveryThreshold;
  const rawDeliveryFee = isFreeDelivery ? 0 : 25;
  const handlingFee = items.length > 0 ? 4 : 0;

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.min(100, Math.round((itemTotal * appliedCoupon.discountValue) / 100));
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, itemTotal + rawDeliveryFee + handlingFee + selectedTip - couponDiscount);
  const totalSavings = productDiscount + (isFreeDelivery ? 25 : 0) + couponDiscount;

  const handleApplyCoupon = (c: Coupon) => {
    if (itemTotal < c.minOrder) {
      setCouponError(`Add items worth ₹${c.minOrder - itemTotal} more to apply ${c.code}`);
      return;
    }
    setCouponError('');
    setAppliedCoupon(c);
    sounds.playSuccessTone();
  };

  const handleManualCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PROMO_COUPONS.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (found) {
      handleApplyCoupon(found);
    } else {
      setCouponError('Invalid coupon code. Try QUICK10 or FREESHIP');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    onProceedToCheckout({
      itemTotal,
      discount: productDiscount,
      deliveryFee: rawDeliveryFee,
      handlingFee,
      tip: selectedTip,
      couponDiscount,
      total: grandTotal,
      appliedCoupon: appliedCoupon || undefined,
      deliveryInstruction
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border-l border-neutral-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Your Grocery Basket</h2>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>10-12 Mins Delivery</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliver To banner */}
        <div className="bg-neutral-950/80 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate pr-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-white mr-1.5">{address.label}:</span>
              <span className="text-neutral-400 truncate">{address.title}</span>
            </div>
          </div>
          <button
            onClick={onChangeAddress}
            className="text-emerald-400 font-bold hover:underline shrink-0 text-xs"
          >
            Change
          </button>
        </div>

        {/* Free Delivery Bar */}
        {itemTotal < freeDeliveryThreshold && items.length > 0 && (
          <div className="bg-amber-950/30 border-b border-amber-800/30 px-4 py-2 text-xs flex items-center justify-between text-amber-300">
            <span>Add ₹{freeDeliveryThreshold - itemTotal} more for FREE delivery</span>
            <span className="font-bold text-[11px] uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
              Standard: ₹25
            </span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-3xl mb-4">
                🛒
              </div>
              <h3 className="text-lg font-bold text-white">Your basket is empty</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Explore our fresh vegetables, cold juices, dairy, snacks, and sweet treats ready for instant 10-min delivery!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="bg-neutral-950/40 border border-neutral-800 rounded-2xl p-3 divide-y divide-neutral-800">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-800 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="text-[11px] text-neutral-400 block">{product.weight}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            ₹{product.price * quantity}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[10px] text-neutral-400 line-through font-mono">
                              ₹{product.originalPrice * quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center bg-emerald-600 text-white rounded-lg overflow-hidden font-bold shadow-md shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-1.5 hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-mono">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Instructions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Delivery Preferences
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Leave at door', icon: '🚪' },
                    { label: 'Don\'t ring bell', icon: '🔕' },
                    { label: 'Hand to guard', icon: '👮' }
                  ].map((pref) => (
                    <button
                      key={pref.label}
                      onClick={() => setDeliveryInstruction(pref.label)}
                      className={`p-2.5 rounded-xl border text-center transition-all text-xs flex flex-col items-center gap-1 ${
                        deliveryInstruction === pref.label
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{pref.icon}</span>
                      <span className="leading-tight">{pref.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip Delivery Partner */}
              <div className="bg-neutral-950/40 border border-neutral-800 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Tip your delivery hero</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">100% goes to rider</span>
                </div>
                <div className="flex gap-2">
                  {[0, 20, 30, 50].map((tip) => (
                    <button
                      key={tip}
                      onClick={() => {
                        setSelectedTip(tip);
                        sounds.playAddToCart();
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selectedTip === tip
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/80 hover:bg-neutral-700'
                      }`}
                    >
                      {tip === 0 ? 'No tip' : `₹${tip}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupons & Offers */}
              <div className="bg-neutral-950/40 border border-neutral-800 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Apply Promo Coupon</span>
                  </div>
                  {appliedCoupon && (
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-[11px] text-rose-400 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-emerald-300 uppercase tracking-wider">{appliedCoupon.code}</span>
                        <p className="text-[10px] text-neutral-300">You saved ₹{couponDiscount} with this code!</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleManualCoupon} className="flex gap-2 mb-2.5">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={!couponInput.trim()}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs disabled:opacity-40"
                      >
                        Apply
                      </button>
                    </form>

                    {couponError && (
                      <p className="text-[11px] text-rose-400 mb-2">{couponError}</p>
                    )}

                    {/* Quick suggestion coupons */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                      {PROMO_COUPONS.slice(0, 3).map((cp) => (
                        <button
                          key={cp.code}
                          type="button"
                          onClick={() => handleApplyCoupon(cp)}
                          className="text-[10px] whitespace-nowrap bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-2 py-1 rounded-md text-emerald-300 font-mono transition-colors"
                        >
                          {cp.code} · {cp.discountValue}{cp.discountType === 'percentage' ? '%' : '₹'} OFF
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] mb-2.5">
                  Bill Summary
                </h4>

                <div className="flex justify-between text-neutral-400">
                  <span>Item Total (MRP)</span>
                  <span className="font-mono text-neutral-200">₹{totalMrp}</span>
                </div>

                {productDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Product Discount</span>
                    <span className="font-mono">- ₹{productDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Partner Fee (10 min)</span>
                  <span className="font-mono text-neutral-200">
                    {rawDeliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${rawDeliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>Handling & Packaging Fee</span>
                  <span className="font-mono text-neutral-200">₹{handlingFee}</span>
                </div>

                {selectedTip > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery Partner Tip</span>
                    <span className="font-mono text-neutral-200">₹{selectedTip}</span>
                  </div>
                )}

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="font-mono">- ₹{couponDiscount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                  <span>To Pay</span>
                  <span className="font-mono text-emerald-400 text-base">₹{grandTotal}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-2 text-center text-[11px] text-emerald-300 font-bold">
                    🎉 You are saving ₹{totalSavings} on this order!
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-neutral-400 block uppercase tracking-wider font-semibold">
                Total to Pay
              </span>
              <span className="text-xl font-black text-white font-mono">₹{grandTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>PROCEED TO PAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
