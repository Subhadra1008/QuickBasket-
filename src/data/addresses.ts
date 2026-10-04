import { Address } from '../types';

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    title: 'Apartment 402, Tower B',
    street: 'Green Glen Heights, Bellandur Outer Ring Rd',
    landmark: 'Opposite EcoSpace Tech Park Gate 2',
    city: 'Bengaluru, Karnataka - 560103',
    flat: 'Flat 402, 4th Floor',
    lat: 12.9279,
    lng: 77.6830,
    isDefault: true
  },
  {
    id: 'addr-2',
    label: 'Work',
    title: 'WeWork Galaxy, 5th Floor',
    street: '43 Residency Road, Shanthala Nagar, Ashok Nagar',
    landmark: 'Near Brigade Towers',
    city: 'Bengaluru, Karnataka - 560025',
    flat: 'Desk #512, Co-working space',
    lat: 12.9716,
    lng: 77.5946,
    isDefault: false
  },
  {
    id: 'addr-3',
    label: 'Other',
    title: 'Parents Residence, Villa 18',
    street: 'Palm Meadows Gated Community, Ramagondanahalli',
    landmark: 'Near Varthur Lake',
    city: 'Bengaluru, Karnataka - 560066',
    flat: 'Villa 18, Phase 2',
    lat: 12.9592,
    lng: 77.7321,
    isDefault: false
  }
];

export const DARK_STORE_INFO = {
  name: 'QuickBasket Dark Store #07 (Bellandur Hub)',
  code: 'DS-BLR-07',
  address: 'Shed 4B, Industrial Ring Corridor, Bellandur',
  distanceKm: 1.4,
  avgDispatchTimeMins: 2.1,
  guaranteedDeliveryMins: 11,
  activeRidersCount: 14,
  operatingStatus: 'High Speed Fulfillment Active',
  temperatureControlled: true
};
