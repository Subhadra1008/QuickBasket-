import React, { useState } from 'react';
import { Order } from '../types';
import { 
  X, Clock, CheckCircle2, RotateCcw, FileText, ChevronRight, 
  MapPin, Bike, Calendar, Receipt, Printer, ArrowLeft
} from 'lucide-react';
import { sounds } from '../services/audio';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onTrackOrder,
  onReorder
}) => {
  if (!isOpen) return null;

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {selectedInvoiceOrder ? (
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Receipt className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {selectedInvoiceOrder ? 'Tax Invoice & Receipt' : 'Order History'}
              </h2>
              <p className="text-xs text-neutral-400">
                {selectedInvoiceOrder ? `Invoice #${selectedInvoiceOrder.orderNumber}` : `${orders.length} past orders placed`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedInvoiceOrder && (
              <button
                onClick={handlePrint}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 font-semibold"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {selectedInvoiceOrder ? (
            /* Digital Tax Invoice View */
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 sm:p-6 text-neutral-200 text-xs space-y-5 print:text-black print:bg-white">
              {/* Invoice header */}
              <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">QuickBasket Dark Store #07</h3>
                  <p className="text-neutral-400 mt-0.5">Quick Commerce Retail Ltd.</p>
                  <p className="text-neutral-400">GSTIN: 29AABCU9603R1ZM</p>
                  <p className="text-neutral-400">Bellandur Industrial Hub, Bengaluru - 560103</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
                    PAID ({selectedInvoiceOrder.paymentMethod.toUpperCase()})
                  </span>
                  <p className="font-mono text-neutral-300 mt-1 font-bold">#{selectedInvoiceOrder.orderNumber}</p>
                  <p className="text-neutral-400">{selectedInvoiceOrder.createdAt}</p>
                </div>
              </div>

              {/* Delivery To */}
              <div className="grid grid-cols-2 gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider block">Billed To</span>
                  <p className="font-bold text-white mt-1">Subhadra Singh</p>
                  <p className="text-neutral-300">{selectedInvoiceOrder.address.flat}</p>
                  <p className="text-neutral-400">{selectedInvoiceOrder.address.street}</p>
                  <p className="text-neutral-400">{selectedInvoiceOrder.address.city}</p>
                </div>
                <div>
                  <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider block">Delivery Partner</span>
                  <p className="font-bold text-white mt-1">{selectedInvoiceOrder.rider.name}</p>
                  <p className="text-neutral-400">{selectedInvoiceOrder.rider.vehicle}</p>
                  <p className="text-neutral-400 font-mono">{selectedInvoiceOrder.rider.vehicleNumber}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-neutral-400 border-b border-neutral-800 pb-2 text-[11px] uppercase">
                  <span>Item Description</span>
                  <div className="flex gap-6">
                    <span>Qty</span>
                    <span>Price</span>
                    <span>Total</span>
                  </div>
                </div>

                {selectedInvoiceOrder.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between py-1.5 border-b border-neutral-850">
                    <div>
                      <p className="font-semibold text-white">{item.product.name}</p>
                      <p className="text-[11px] text-neutral-400">{item.product.weight}</p>
                    </div>
                    <div className="flex gap-6 font-mono text-neutral-300">
                      <span className="w-6 text-center">{item.quantity}</span>
                      <span className="w-12 text-right">₹{item.product.price}</span>
                      <span className="w-14 text-right font-bold text-white">₹{item.product.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-800 text-right">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{selectedInvoiceOrder.itemTotal}</span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">- ₹{selectedInvoiceOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Partner Fee</span>
                  <span className="font-mono text-white">
                    {selectedInvoiceOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedInvoiceOrder.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Handling & Packaging</span>
                  <span className="font-mono text-white">₹{selectedInvoiceOrder.handlingFee}</span>
                </div>
                {selectedInvoiceOrder.tip > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Rider Tip</span>
                    <span className="font-mono text-white">₹{selectedInvoiceOrder.tip}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-800">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-400">₹{selectedInvoiceOrder.total}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-neutral-500 pt-3">
                This is a computer-generated tax invoice. Thank you for shopping with QuickBasket!
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-2xl mx-auto mb-3">
                📦
              </div>
              <h3 className="font-bold text-white text-base">No orders placed yet</h3>
              <p className="text-xs text-neutral-400 mt-1">Add items from the store to experience 10-minute instant delivery!</p>
            </div>
          ) : (
            orders.map((ord) => {
              const isOngoing = ord.status !== 'delivered' && ord.status !== 'cancelled';

              return (
                <div
                  key={ord.id}
                  className="bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-4 sm:p-5 transition-all space-y-4"
                >
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">#{ord.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isOngoing
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{ord.createdAt}</span>
                      </p>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-base font-black text-white font-mono">₹{ord.total}</span>
                      <p className="text-[11px] text-neutral-400">{ord.items.length} items</p>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {ord.items.map((item) => (
                      <div key={item.product.id} className="relative shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-neutral-800"
                          title={`${item.product.name} (x${item.quantity})`}
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono text-[9px] font-bold px-1 rounded-full">
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location & Rider */}
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{ord.address.title}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ord.rider.name}</span>
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-850 gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Invoice</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isOngoing ? (
                        <button
                          onClick={() => {
                            sounds.playPing();
                            onTrackOrder(ord);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 flex items-center gap-1 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Track Live GPS</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            sounds.playSuccessTone();
                            onReorder(ord);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder All</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
