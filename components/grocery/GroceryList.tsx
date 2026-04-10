"use client";
import { useState } from 'react';
import { GroceryList as IGroceryList } from '@/types';
import CategoryGroup from './CategoryGroup';

export default function GroceryList({ list }: { list: IGroceryList }) {
  const [filter, setFilter] = useState<'ALL' | 'WET_MARKET' | 'SUPERMARKET'>('ALL');

  const visibleItems = list.items.filter(item => {
    if (filter === 'ALL') return true;
    if (item.availability === 'BOTH') return true;
    return item.availability === filter;
  });

  const produce = visibleItems.filter(i => i.category === 'PRODUCE');
  const protein = visibleItems.filter(i => i.category === 'PROTEIN');
  const pantry = visibleItems.filter(i => i.category === 'PANTRY');
  const spices = visibleItems.filter(i => i.category === 'SPICES');

  return (
    <div className="space-y-4">
      <div className="flex p-1 bg-gray-100 rounded-lg text-xs font-semibold sticky top-4 z-10 w-full mb-6">
        {['ALL', 'WET_MARKET', 'SUPERMARKET'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as 'ALL' | 'WET_MARKET' | 'SUPERMARKET')}
            className={`flex-1 py-2.5 rounded-md transition-all ${filter === tab ? 'bg-white shadow-sm text-green-700' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {tab === 'ALL' ? 'All Items' : tab === 'WET_MARKET' ? 'Wet Market' : 'Supermarket'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <CategoryGroup title="Fresh Produce" items={produce} />
        <CategoryGroup title="Meat & Seafood" items={protein} />
        <CategoryGroup title="Pantry Staples" items={pantry} />
        <CategoryGroup title="Spices & Seasonings" items={spices} />
      </div>
      
      {visibleItems.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm font-medium">No items in this category.</p>
        </div>
      )}
    </div>
  );
}
