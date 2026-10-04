import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { TrackingMap } from './TrackingMap';
import { RiderChatModal } from './RiderChatModal';
import { 
  X, Phone, MessageSquare, ShieldCheck, CheckCircle2, Clock, 
  Package, Bike, Home, ChevronRight, Star, Heart, FileText, ArrowRight
} from 'lucide-react';
import { sounds } from '../services/audio';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onViewInvoice: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrderStatus,
  onViewInvoice
}) => {
  if (!isOpen || !order) return null;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    order.status === 'delivered' ? 0 : 540 // 9 minutes default
  );
  const [riderTipAdded, setRiderTipAdded] = useState(order.tip > 0);
  const [showItemsList, setShowItemsList] = useState(false);

  // Map progress calculation based on status and countdown
  let progressPercent = 15;
  if (order.status === 'packing') progressPercent = 30;
  if (order.status === 'out_for_delivery') {
    // Dynamic progress from 35% to 92% based on remaining time
    const ratio = Math.max(0, Math.min(1, 1 - secondsRemaining / 540));
    progressPercent = 35 + ratio * 57;
  }
  if (order.status === 'arrived') progressPercent = 98;
  if (order.status === 'delivered') progressPercent = 100;

  // Live countdown timer & auto status transition simulation
  useEffect(() => {
    if (order.status === 'delivered' || order.status === 'cancelled') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (order.status !== 'delivered') {
            onUpdateOrderStatus(order.id, 'delivered');
            sounds.playOrderPlaced();
          }
          return 0;
        }

        // Auto trigger transitions
        if (prev === 480 && order.status === 'placed') {
          onUpdateOrderStatus(order.id, 'packing');
          sounds.playPing();
        } else if (prev === 400 && order.status === 'packing') {
          onUpdateOrderStatus(order.id, 'out_for_delivery');
          sounds.playPing();
        } else if (prev === 45 && order.status === 'out_for_delivery') {
          onUpdateOrderStatus(order.id, 'arrived');
          sounds.playPing();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order.id, order.status]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; time: string }[] = [
    { key: 'placed', label: 'Order Confirmed', icon: <FileText className="w-4 h-4" />, time: 'Dark store accepted' },
    { key: 'packing', label: 'Packed & Quality Checked', icon: <Package className="w-4 h-4" />, time: 'Under 2.5 mins' },
    { key: 'out_for_delivery', label: 'Rider on the Way', icon: <Bike className="w-4 h-4" />, time: 'Electric express' },
    { key: 'arrived', label: 'Arrived at Gate', icon: <Home className="w-4 h-4" />, time: 'Doorstep arrival' },
  ];

  const getStepStatus = (stepKey: OrderStatus) => {
    const orderOfStates: OrderStatus[] = ['placed', 'packing', 'out_for_delivery', 'arrived', 'delivered'];
    const currentIdx = orderOfStates.indexOf(order.status);
    const stepIdx = orderOfStates.indexOf(stepKey);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  const handleFastForward = () => {
    sounds.playPing();
    if (order.status === 'placed') {
      onUpdateOrderStatus(order.id, 'packing');
      setSecondsRemaining(420);
    } else if (order.status === 'packing') {
      onUpdateOrderStatus(order.id, 'out_for_delivery');
      setSecondsRemaining(240);
    } else if (order.status === 'out_for_delivery') {
      onUpdateOrderStatus(order.id, 'arrived');
      setSecondsRemaining(30);
    } else if (order.status === 'arrived') {
      onUpdateOrderStatus(order.id, 'delivered');
      setSecondsRemaining(0);
      sounds.playOrderPlaced();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-3xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
          {/* Top Bar */}
          <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800/90 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide">
                  10-MIN EXPRESS
                </span>
                <span className="text-xs text-neutral-400 font-mono">#{order.orderNumber}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                {order.status === 'delivered' ? (
                  <span className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" /> Order Delivered!
                  </span>
                ) : order.status === 'arrived' ? (
                  <span className="text-amber-400 flex items-center gap-2">
                    <Home className="w-6 h-6 animate-bounce" /> Rider has arrived!
                  </span>
                ) : (
                  <span>
                    Arriving in <span className="text-emerald-400 font-mono tracking-tight">{formatTimer(secondsRemaining)}</span>
                  </span>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFastForward}
                disabled={order.status === 'delivered'}
                title="Fast forward simulation for testing"
                className="text-xs font-semibold px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-30"
              >
                <span>Simulate Next ⏩</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar">
            {/* Live Vector Map */}
            <TrackingMap
              rider={order.rider}
              orderStatus={order.status}
              userAddressTitle={order.address.title}
              progressPercent={progressPercent}
            />

            {/* Rider Card */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={order.rider.avatar}
                    alt={order.rider.name}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{order.rider.name}</h3>
                    <span className="flex items-center gap-0.5 bg-amber-500/20 text-amber-300 text-xs px-1.5 py-0.5 rounded font-bold">
                      <Star className="w-3 h-3 fill-amber-300" /> {order.rider.rating}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {order.rider.vehicle} · <span className="font-mono text-neutral-300">{order.rider.vehicleNumber}</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">
                    Completed {order.rider.deliveriesCompleted.toLocaleString()}+ safe deliveries
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <a
                  href={`tel:${order.rider.phone}`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs border border-neutral-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Partner</span>
                </a>

                <button
                  onClick={() => setIsChatOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-900/30 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Live</span>
                </button>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="bg-neutral-950/40 border border-neutral-800/80 rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Live Order Milestones
              </h4>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                {steps.map((st) => {
                  const status = getStepStatus(st.key);
                  const isDone = status === 'completed' || order.status === 'delivered';
                  const isActive = status === 'active';

                  return (
                    <div key={st.key} className="relative flex items-start gap-3">
                      {/* Node Bullet */}
                      <span
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                            : isActive
                            ? 'bg-neutral-900 border-emerald-400 text-emerald-400 ring-4 ring-emerald-500/20 animate-pulse'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-600'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        )}
                      </span>

                      <div className="flex-1 -mt-0.5">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${isActive ? 'text-emerald-400 font-bold' : isDone ? 'text-white' : 'text-neutral-500'}`}>
                            {st.label}
                          </p>
                          <span className="text-[11px] text-neutral-400 font-mono">{st.time}</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {st.key === 'placed' && 'Dark Store #07 received order and allocated picker'}
                          {st.key === 'packing' && 'Bags sealed and scanned for accuracy'}
                          {st.key === 'out_for_delivery' && `${order.rider.name} is navigating through green corridor`}
                          {st.key === 'arrived' && 'Delivery hero at gate / lobby'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tip Delivery Hero Feature */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-amber-950/20 border border-emerald-800/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Heart className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Appreciate {order.rider.name}?</h4>
                  <p className="text-xs text-neutral-400">100% of the tip goes straight to your rider partner</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[20, 30, 50].map((tipVal) => (
                  <button
                    key={tipVal}
                    onClick={() => {
                      sounds.playSuccessTone();
                      setRiderTipAdded(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      riderTipAdded
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                    }`}
                  >
                    + ₹{tipVal}
                  </button>
                ))}
              </div>
            </div>

            {/* View Items Toggle */}
            <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950/50">
              <button
                onClick={() => setShowItemsList(!showItemsList)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-900/60 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Billed Total: <span className="font-mono text-emerald-400 font-bold">₹{order.total}</span> · Paid via {order.paymentMethod.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span>{showItemsList ? 'Hide details' : 'View details'}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showItemsList ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {showItemsList && (
                <div className="p-4 pt-0 divide-y divide-neutral-800/80">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-800"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">{item.product.name}</p>
                          <p className="text-[11px] text-neutral-400">{item.product.weight} · Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-200">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => onViewInvoice(order)}
                      className="text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-1.5 py-1 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Digital Receipt</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Rider Chat Modal */}
      <RiderChatModal
        rider={order.rider}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};
