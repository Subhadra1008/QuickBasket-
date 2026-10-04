import React from 'react';
import { Category, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategoryPillsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  productCounts: Record<CategoryId, number>;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const count = productCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400'
                  : 'bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-850 border border-neutral-800'
              }`}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                isSelected ? 'bg-emerald-800/80 text-emerald-100' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
