import React, { useState } from 'react';
import { Address } from '../types';
import { DEFAULT_ADDRESSES, DARK_STORE_INFO } from '../data/addresses';
import { 
  X, MapPin, Check, Plus, Home, Briefcase, Navigation, ShieldCheck, Zap
} from 'lucide-react';
import { sounds } from '../services/audio';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: Address;
  onSelectAddress: (addr: Address) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  selectedAddress,
  onSelectAddress
}) => {
  if (!isOpen) return null;

  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New address fields
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [flat, setFlat] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flat.trim() || !street.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label,
      title: `${flat}, ${street.split(',')[0]}`,
      street,
      landmark: landmark.trim() || 'Near main road',
      city: 'Bengaluru, Karnataka',
      flat,
      lat: 12.9300,
      lng: 77.6850
    };

    setAddresses([newAddr, ...addresses]);
    onSelectAddress(newAddr);
    sounds.playSuccessTone();
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Delivery Location</h2>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Delivering in 10-12 Mins from Hub #07</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {isAddingNew ? (
            <form onSubmit={handleAddNew} className="space-y-3.5 text-xs">
              <h3 className="font-bold text-white text-sm">Add New Delivery Address</h3>

              {/* Label selector */}
              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Save Address As</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLabel(l)}
                      className={`py-2 rounded-xl border font-bold transition-all ${
                        label === l
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Flat / House / Floor No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, 3rd Floor"
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Street / Society / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Tech Vista, Outer Ring Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Starbucks"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save & Select
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddress.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      sounds.playAddToCart();
                      onSelectAddress(addr);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500 shadow-md'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        isSelected ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {addr.label === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{addr.label}</h4>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-200 mt-0.5 font-medium">{addr.flat}</p>
                        <p className="text-xs text-neutral-400">{addr.street}</p>
                        <p className="text-[11px] text-neutral-400 mt-1">Landmark: {addr.landmark}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-500 text-neutral-950 shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-emerald-500 text-neutral-400 hover:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>

              {/* Dark Store Guarantee Info */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3.5 text-xs text-neutral-400 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-semibold block">{DARK_STORE_INFO.name}</span>
                  <span className="text-[11px]">Direct fulfillment within {DARK_STORE_INFO.distanceKm} km radius</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
