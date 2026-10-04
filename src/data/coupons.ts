import { Coupon } from '../types';

export const PROMO_COUPONS: Coupon[] = [
  {
    code: 'QUICK10',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 199,
    description: '10% OFF on orders above ₹199 (Max ₹100)'
  },
  {
    code: 'FREESHIP',
    discountType: 'flat',
    discountValue: 25,
    minOrder: 149,
    description: 'Free instant 10-min delivery on orders above ₹149'
  },
  {
    code: 'WELCOME50',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 299,
    description: 'Flat ₹50 OFF for today\'s quick basket'
  },
  {
    code: 'ZEPTOSTYLE',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 499,
    description: '15% Mega Quick-Commerce Super Saver'
  }
];
