export type CategoryId = 
  | 'all'
  | 'fruits-veg'
  | 'dairy-bread'
  | 'snacks-munchies'
  | 'cold-drinks'
  | 'sweets-desserts'
  | 'instant-food'
  | 'tea-coffee'
  | 'household';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  weight: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMins: number;
  inStock: boolean;
  stockCount: number;
  brand: string;
  description: string;
  shelfLife?: string;
  origin?: string;
  nutrients?: {
    calories: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    [key: string]: string | undefined;
  };
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  title: string;
  street: string;
  landmark: string;
  city: string;
  flat: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'placed'
  | 'packing'
  | 'out_for_delivery'
  | 'arrived'
  | 'delivered'
  | 'cancelled';

export interface DeliveryRider {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  deliveriesCompleted: number;
  vehicle: string;
  vehicleNumber: string;
  currentLat: number;
  currentLng: number;
  heading: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  handlingFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  address: Address;
  rider: DeliveryRider;
  estimatedDeliveryMins: number;
  placedTimestamp: number;
  deliveredTimestamp?: number;
  paymentMethod: 'upi' | 'card' | 'cod' | 'wallet';
  couponCode?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'rider' | 'system';
  text: string;
  timestamp: string;
}
