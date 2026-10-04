import React, { useState } from 'react';
import { Product, Order, OrderStatus, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  X, Store, Package, TrendingUp, AlertTriangle, CheckCircle, 
  Plus, Edit2, ToggleLeft, ToggleRight, ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import { sounds } from '../services/audio';

interface StoreManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onToggleStock: (productId: string) => void;
  onUpdateStockCount: (productId: string, newCount: number) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onAddNewProduct: (newProd: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const StoreManagerModal: React.FC<StoreManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onToggleStock,
  onUpdateStockCount,
  onUpdatePrice,
  onAddNewProduct,
  onUpdateOrderStatus
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'addItem'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('fruits-veg');
  const [newWeight, setNewWeight] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newStock, setNewStock] = useState('50');
  const [newImage, setNewImage] = useState('');
  const [newBrand, setNewBrand] = useState('QuickStore Fresh');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || !newWeight.trim()) return;

    const priceNum = parseFloat(newPrice);
    const mrpNum = newMrp ? parseFloat(newMrp) : priceNum + 20;

    const prod: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newTitle.trim(),
      category: newCategory,
      weight: newWeight.trim(),
      price: priceNum,
      originalPrice: mrpNum,
      discountPercent: Math.round(((mrpNum - priceNum) / mrpNum) * 100),
      image: newImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewCount: 1,
      deliveryTimeMins: 9,
      inStock: true,
      stockCount: parseInt(newStock) || 50,
      brand: newBrand.trim(),
      description: 'Freshly stocked high-demand grocery item from our local dark store hub.',
      tags: ['New Arrival', 'Dark Store']
    };

    onAddNewProduct(prod);
    sounds.playSuccessTone();
    setActiveTab('inventory');
    setNewTitle('');
    setNewPrice('');
    setNewMrp('');
    setNewWeight('');
    setNewImage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Dark Store #07 Operations Console</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE FULFILLMENT
                </span>
              </div>
              <p className="text-xs text-neutral-400">Bellandur Hub · 10-Min Fast Dispatch Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-neutral-950/70 border-b border-neutral-800 p-3 sm:p-4 gap-3 text-xs">
          <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
            <span className="text-neutral-400 block text-[11px] font-medium">Active Dispatch Queue</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
              {activeOrders.length} orders
            </span>
          </div>
          <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
            <span className="text-neutral-400 block text-[11px] font-medium">Avg Dark Store Pick Time</span>
            <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">1.8 mins</span>
          </div>
          <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
            <span className="text-neutral-400 block text-[11px] font-medium">Catalog SKUs</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block">{products.length} items</span>
          </div>
          <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
            <span className="text-neutral-400 block text-[11px] font-medium">Fulfillment Health</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">99.4% SLA</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Live Dispatch Board ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addItem')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'addItem'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add New SKU</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <input
                  type="text"
                  placeholder="Search SKU by name, brand, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:max-w-md bg-neutral-950 border border-neutral-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-neutral-400">
                  Showing {filteredProducts.length} items
                </span>
              </div>

              <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-850 text-xs">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-800 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{p.name}</h4>
                          <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 font-mono">
                            {p.category}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-[11px] mt-0.5">
                          {p.weight} · Brand: {p.brand}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:justify-end">
                      {/* Price Control */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Price:</span>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value) || 0)}
                          className="w-16 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Stock Count */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Stock:</span>
                        <input
                          type="number"
                          value={p.stockCount}
                          onChange={(e) => onUpdateStockCount(p.id, parseInt(e.target.value) || 0)}
                          className="w-14 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* In Stock toggle */}
                      <button
                        onClick={() => {
                          sounds.playPing();
                          onToggleStock(p.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                          p.inStock
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {p.inStock ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISPATCH QUEUE TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {activeOrders.length === 0 ? (
                <div className="text-center py-12 bg-neutral-950/40 rounded-2xl border border-neutral-800">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white text-base">All active orders dispatched!</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your dark store pick & pack queue is completely clear.
                  </p>
                </div>
              ) : (
                activeOrders.map((ord) => (
                  <div key={ord.id} className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-white">#{ord.orderNumber}</span>
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Current: {ord.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Delivery to: {ord.address.flat}, {ord.address.title} · Rider: {ord.rider.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-emerald-400">₹{ord.total}</span>
                        <p className="text-[11px] text-neutral-400">{ord.items.length} unique items</p>
                      </div>
                    </div>

                    {/* Quick advance status buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-neutral-400 font-medium">Update Status:</span>
                      <div className="flex gap-2">
                        {(['placed', 'packing', 'out_for_delivery', 'arrived', 'delivered'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              sounds.playPing();
                              onUpdateOrderStatus(ord.id, st);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              ord.status === st
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {st === 'out_for_delivery' ? 'Dispatched' : st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADD ITEM TAB */}
          {activeTab === 'addItem' && (
            <form onSubmit={handleCreateProduct} className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-bold text-white text-sm">Add New Product to Dark Store Catalog</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh Exotic Dragonfruit"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Unit / Weight (e.g. 500g, 1L) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 g pack"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Brand / Vendor</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">MRP Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 130"
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Stock Quantity</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Product Image URL</label>
                  <input
                    type="url"
                    placeholder="Unsplash image URL (optional)"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add SKU to Live Store</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
