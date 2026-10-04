import { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items', icon: '✨', color: 'from-amber-500/10 to-emerald-500/10' },
  { id: 'fruits-veg', name: 'Fruits & Veggies', icon: '🥦', color: 'from-emerald-500/10 to-green-600/10', badge: 'Fresh Daily' },
  { id: 'dairy-bread', name: 'Dairy, Bread & Eggs', icon: '🥛', color: 'from-blue-500/10 to-indigo-500/10' },
  { id: 'snacks-munchies', name: 'Chips & Munchies', icon: '🍿', color: 'from-yellow-500/10 to-amber-600/10' },
  { id: 'cold-drinks', name: 'Cold Drinks & Juices', icon: '🥤', color: 'from-cyan-500/10 to-blue-600/10' },
  { id: 'sweets-desserts', name: 'Sweets & Chocolates', icon: '🍫', color: 'from-rose-500/10 to-pink-600/10' },
  { id: 'instant-food', name: 'Instant & Noodles', icon: '🍜', color: 'from-red-500/10 to-orange-500/10' },
  { id: 'tea-coffee', name: 'Tea & Artisanal Coffee', icon: '☕', color: 'from-amber-700/10 to-yellow-800/10' },
  { id: 'household', name: 'Cleaning & Bath', icon: '🧼', color: 'from-teal-500/10 to-emerald-500/10' },
];
