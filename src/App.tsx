import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, CategoryId, CartItem, Address, Order, OrderStatus, Coupon 
} from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { CATEGORIES } from './data/categories';
import { DEFAULT_ADDRESSES } from './data/addresses';
import { SAMPLE_RIDERS, getRandomRider } from './data/riders';
import { Navbar } from './components/Navbar';
import { DeliveryBanner } from './components/DeliveryBanner';
import { CategoryPills } from './components/CategoryPills';
import { FilterBar, SortOption } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { StoreManagerModal } from './components/StoreManagerModal';
import { AddressModal } from './components/AddressModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { sounds } from './services/audio';
import { 
  Wifi, Battery, Signal, Zap, Clock, ShieldCheck, Heart, 
  Sparkles, CheckCircle2, ChevronRight, Store
} from 'lucide-react';

const STORAGE_KEYS = {
  PRODUCTS: 'quickbasket_products_v1',
  CART: 'quickbasket_cart_v1',
  ORDERS: 'quickbasket_orders_v1',
  ADDRESS: 'quickbasket_address_v1'
};

export default function App() {
  // Products Catalog (with localStorage persistence)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initial Sample Order in History
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    // Default seeded previous order
    return [
      {
        id: 'ord-initial-01',
        orderNumber: 'QB-98124',
        createdAt: 'Yesterday, 8:42 PM',
        items: [
          { product: INITIAL_PRODUCTS[5], quantity: 2 }, // Whole milk
          { product: INITIAL_PRODUCTS[0], quantity: 1 }, // Royal apples
          { product: INITIAL_PRODUCTS[10], quantity: 1 } // Truffle crisps
        ],
        itemTotal: 420,
        discount: 65,
        deliveryFee: 0,
        handlingFee: 4,
        tip: 20,
        total: 379,
        status: 'delivered',
        statusHistory: [
          { status: 'placed', timestamp: '8:42 PM', note: 'Order Confirmed' },
          { status: 'packing', timestamp: '8:44 PM', note: 'Packed at Dark Store' },
          { status: 'out_for_delivery', timestamp: '8:47 PM', note: 'Rider on electric scooter' },
          { status: 'delivered', timestamp: '8:54 PM', note: 'Delivered in 12 mins' }
        ],
        address: DEFAULT_ADDRESSES[0],
        rider: SAMPLE_RIDERS[0],
        estimatedDeliveryMins: 11,
        placedTimestamp: Date.now() - 86400000,
        paymentMethod: 'upi',
        couponCode: 'QUICK10'
      }
    ];
  });

  // Delivery Address
  const [selectedAddress, setSelectedAddress] = useState<Address>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESS);
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES[0];
    } catch {
      return DEFAULT_ADDRESSES[0];
    }
  });

  // UI Filtering & Navigation State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filterUnder99, setFilterUnder99] = useState(false);
  const [filterHighDiscount, setFilterHighDiscount] = useState(false);
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);

  // Modals & Panels State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isStoreManagerOpen, setIsStoreManagerOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Tracking Active Order
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Checkout Temp Summary for Payment
  const [checkoutSummary, setCheckoutSummary] = useState<{
    itemTotal: number;
    discount: number;
    deliveryFee: number;
    handlingFee: number;
    tip: number;
    couponDiscount: number;
    total: number;
    appliedCoupon?: Coupon;
    deliveryInstruction: string;
  } | null>(null);

  // Shell View Mode: Mobile frame vs Wide Desktop
  const [isMobileView, setIsMobileView] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persist states
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDRESS, JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  // Audio mute toggle
  const handleToggleSound = () => {
    const nextState = sounds.toggleSound();
    setSoundEnabled(nextState);
  };

  // Cart Management
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Cart total calculations
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  // Checkout flow
  const handleProceedToCheckout = (summary: {
    itemTotal: number;
    discount: number;
    deliveryFee: number;
    handlingFee: number;
    tip: number;
    couponDiscount: number;
    total: number;
    appliedCoupon?: Coupon;
    deliveryInstruction: string;
  }) => {
    setCheckoutSummary(summary);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  // Payment completed
  const handlePaymentSuccess = (paymentMethod: 'upi' | 'card' | 'cod' | 'wallet') => {
    if (!checkoutSummary) return;

    const assignedRider = getRandomRider();
    const newOrderNumber = `QB-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: 'Just now',
      items: [...cart],
      itemTotal: checkoutSummary.itemTotal,
      discount: checkoutSummary.discount + checkoutSummary.couponDiscount,
      deliveryFee: checkoutSummary.deliveryFee,
      handlingFee: checkoutSummary.handlingFee,
      tip: checkoutSummary.tip,
      total: checkoutSummary.total,
      status: 'placed',
      statusHistory: [
        {
          status: 'placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Dark store confirmed order'
        }
      ],
      address: selectedAddress,
      rider: assignedRider,
      estimatedDeliveryMins: 11,
      placedTimestamp: Date.now(),
      paymentMethod,
      couponCode: checkoutSummary.appliedCoupon?.code
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stockCount - cartItem.quantity);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return p;
      })
    );

    // Save order, clear cart, open live tracking
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsPaymentOpen(false);
    setActiveTrackingOrder(newOrder);
    setIsTrackingModalOpen(true);
  };

  // Update order status (from simulation or store ops)
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map(o => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            status: newStatus,
            deliveredTimestamp: newStatus === 'delivered' ? Date.now() : o.deliveredTimestamp
          };
          if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
            setActiveTrackingOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );
  };

  // Reorder functionality
  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      handleAddToCart(item.product);
    });
    setIsOrderHistoryOpen(false);
    setIsCartOpen(true);
    sounds.playSuccessTone();
  };

  // Dark store catalog ops
  const handleToggleStock = (productId: string) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p)
    );
  };

  const handleUpdateStockCount = (productId: string, newCount: number) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, stockCount: newCount, inStock: newCount > 0 } : p)
    );
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, price: newPrice } : p)
    );
  };

  const handleAddNewProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  // Active orders (ongoing delivery)
  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  }, [orders]);

  // Product Counts per category
  const productCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      'all': products.length,
      'fruits-veg': 0,
      'dairy-bread': 0,
      'snacks-munchies': 0,
      'cold-drinks': 0,
      'sweets-desserts': 0,
      'instant-food': 0,
      'tea-coffee': 0,
      'household': 0
    };

    products.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return counts;
  }, [products]);

  // Filtered & Sorted Catalog
  const visibleProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchTag) return false;
        }

        // Filter pills
        if (filterUnder99 && p.price > 99) return false;
        if (filterHighDiscount && p.discountPercent < 20) return false;
        if (filterInStockOnly && (!p.inStock || p.stockCount <= 0)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // popularity
        return b.reviewCount - a.reviewCount;
      });
  }, [products, selectedCategory, searchQuery, sortBy, filterUnder99, filterHighDiscount, filterInStockOnly]);

  const appContent = (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentAddress={selectedAddress}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrders={activeOrders}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
        onOpenStoreManager={() => setIsStoreManagerOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isMobileView={isMobileView}
        onToggleMobileView={() => setIsMobileView(!isMobileView)}
      />

      {/* Ongoing Order Floating Notice Bar */}
      {activeOrders.length > 0 && !isTrackingModalOpen && (
        <div className="bg-emerald-950/60 border-b border-emerald-500/30 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-bold text-white">
                Active Order #{activeOrders[0].orderNumber}:
              </span>
              <span className="text-emerald-300 font-medium">
                {activeOrders[0].status === 'out_for_delivery'
                  ? `${activeOrders[0].rider.name} is on the way`
                  : activeOrders[0].status === 'arrived'
                  ? 'Delivery partner has arrived at your door!'
                  : 'Packing at Bellandur Dark Store'}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTrackingOrder(activeOrders[0]);
                setIsTrackingModalOpen(true);
              }}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow transition-colors"
            >
              <span>Track Live GPS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-5 pb-24">
        {/* Hero 10-Min Delivery Banner */}
        <DeliveryBanner />

        {/* Categories Bar */}
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
            Browse Groceries & Essentials
          </h2>
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            productCounts={productCounts}
          />
        </div>

        {/* Filter and Sort Bar */}
        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterUnder99={filterUnder99}
          onToggleUnder99={() => setFilterUnder99(!filterUnder99)}
          filterHighDiscount={filterHighDiscount}
          onToggleHighDiscount={() => setFilterHighDiscount(!filterHighDiscount)}
          filterInStockOnly={filterInStockOnly}
          onToggleInStockOnly={() => setFilterInStockOnly(!filterInStockOnly)}
          totalProductsCount={visibleProducts.length}
        />

        {/* Product Grid */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800">
            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-3xl mx-auto mb-3">
              🔍
            </div>
            <h3 className="text-base font-bold text-white">No grocery items found</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              We couldn't find items matching your criteria. Try resetting filters or searching for milk, ramyun, apples, or chips.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setFilterUnder99(false);
                setFilterHighDiscount(false);
                setFilterInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-emerald-400 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {visibleProducts.map((product) => {
              const inCartItem = cart.find(ci => ci.product.id === product.id);
              const quantity = inCartItem ? inCartItem.quantity : 0;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onOpenDetails={setSelectedProductForModal}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        items={cart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        cartQuantity={
          selectedProductForModal
            ? (cart.find(ci => ci.product.id === selectedProductForModal.id)?.quantity || 0)
            : 0
        }
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        address={selectedAddress}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        onChangeAddress={() => {
          setIsCartOpen(false);
          setIsAddressModalOpen(true);
        }}
      />

      {/* Payment Simulation Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={checkoutSummary?.total || 0}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        order={activeTrackingOrder}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onViewInvoice={(ord) => {
          setIsTrackingModalOpen(false);
          setIsOrderHistoryOpen(true);
        }}
      />

      {/* Order History & Digital Tax Invoice Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onTrackOrder={(ord) => {
          setIsOrderHistoryOpen(false);
          setActiveTrackingOrder(ord);
          setIsTrackingModalOpen(true);
        }}
        onReorder={handleReorder}
      />

      {/* Dark Store Operator Console */}
      <StoreManagerModal
        isOpen={isStoreManagerOpen}
        onClose={() => setIsStoreManagerOpen(false)}
        products={products}
        orders={orders}
        onToggleStock={handleToggleStock}
        onUpdateStockCount={handleUpdateStockCount}
        onUpdatePrice={handleUpdatePrice}
        onAddNewProduct={handleAddNewProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* Address Selector Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/90 py-8 px-4 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">⚡ QuickBasket 10-Min Delivery</span>
            <span>·</span>
            <span>Micro-warehouse fulfillment engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsStoreManagerOpen(true)}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Dark Store Console</span>
            </button>
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Order History
            </button>
            <span>Powered by Quick-Commerce Tech</span>
          </div>
        </div>
      </footer>
    </div>
  );

  // If mobile shell preview is toggled
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-6">
        <div className="mb-3 flex items-center justify-between w-full max-w-sm text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <Zap className="w-3.5 h-3.5" /> Mobile App Simulator
          </span>
          <button
            onClick={() => setIsMobileView(false)}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded-lg transition-colors"
          >
            Exit to Fullscreen
          </button>
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="w-full max-w-[410px] h-[860px] bg-neutral-900 rounded-[50px] p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700 relative overflow-hidden flex flex-col">
          {/* Top Speaker / Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
          </div>

          {/* Status Bar */}
          <div className="h-7 w-full px-6 flex items-center justify-between text-[11px] font-bold text-neutral-300 z-30 select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 rounded-[38px] overflow-y-auto no-scrollbar relative bg-neutral-950">
            {appContent}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-4 flex items-center justify-center pt-1">
            <div className="w-32 h-1 bg-neutral-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return appContent;
}
