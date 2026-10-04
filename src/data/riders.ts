import { DeliveryRider } from '../types';

export const SAMPLE_RIDERS: DeliveryRider[] = [
  {
    id: 'rider-1',
    name: 'Vikram Singh Rawat',
    phone: '+91 98451 22394',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 4.94,
    deliveriesCompleted: 1840,
    vehicle: 'Ather 450X EV Scooter',
    vehicleNumber: 'KA 03 EV 8842',
    currentLat: 12.9240,
    currentLng: 77.6790,
    heading: 42
  },
  {
    id: 'rider-2',
    name: 'Arjun Nambiar',
    phone: '+91 97410 88231',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 4.91,
    deliveriesCompleted: 1210,
    vehicle: 'Ola S1 Pro Electric',
    vehicleNumber: 'KA 01 HY 3110',
    currentLat: 12.9250,
    currentLng: 77.6810,
    heading: 65
  },
  {
    id: 'rider-3',
    name: 'Santosh Gowda',
    phone: '+91 98860 19324',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rating: 4.96,
    deliveriesCompleted: 2430,
    vehicle: 'Bajaj Chetak EV',
    vehicleNumber: 'KA 04 MP 1904',
    currentLat: 12.9235,
    currentLng: 77.6780,
    heading: 30
  }
];

export function getRandomRider(): DeliveryRider {
  const idx = Math.floor(Math.random() * SAMPLE_RIDERS.length);
  return { ...SAMPLE_RIDERS[idx] };
}
