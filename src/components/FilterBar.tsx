import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'rating';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterUnder99: boolean;
  onToggleUnder99: () => void;
  filterHighDiscount: boolean;
  onToggleHighDiscount: () => void;
  filterInStockOnly: boolean;
  onToggleInStockOnly: () => void;
  totalProductsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  onSortChange,
  filterUnder99,
  onToggleUnder99,
  filterHighDiscount,
  onToggleHighDiscount,
  filterInStockOnly,
  onToggleInStockOnly,
  totalProductsCount
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 text-xs">
      {/* Quick Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 text-neutral-400 mr-1 shrink-0 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <button
          onClick={onToggleInStockOnly}
          className={`px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filterInStockOnly
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          In Stock Only
        </button>

        <button
          onClick={onToggleUnder99}
          className={`px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filterUnder99
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          Under ₹99
        </button>

        <button
          onClick={onToggleHighDiscount}
          className={`px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filterHighDiscount
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          20%+ Off
        </button>
      </div>

      {/* Sort By Dropdown & Count */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className="text-neutral-400 text-xs">
          <span className="text-white font-bold">{totalProductsCount}</span> products found
        </span>

        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-neutral-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="popularity" className="bg-neutral-900">Popularity</option>
            <option value="rating" className="bg-neutral-900">Highest Rated</option>
            <option value="price-asc" className="bg-neutral-900">Price: Low to High</option>
            <option value="price-desc" className="bg-neutral-900">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};
