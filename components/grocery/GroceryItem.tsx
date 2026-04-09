"use client";
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { GroceryItem as IGroceryItem } from '@/types';
import { useState } from 'react';

export default function GroceryItem({ item }: { item: IGroceryItem }) {
  const [checked, setChecked] = useState(item.isChecked);
  return (
    <div className="flex items-center space-x-3 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg -mx-2 transition-colors cursor-pointer group" onClick={() => setChecked(!checked)}>
      <Checkbox.Root
        className="flex h-5 w-5 appearance-none items-center justify-center rounded border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-green-500/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 shrink-0 shadow-sm"
        checked={checked}
        onCheckedChange={(c) => setChecked(c as boolean)}
        id={item.id}
      >
        <Checkbox.Indicator className="text-white">
          <Check size={14} strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className={`text-sm leading-none cursor-pointer flex-1 select-none transition-colors group-hover:text-gray-900 ${checked ? 'text-gray-400 line-through group-hover:text-gray-500' : 'text-gray-800'}`} htmlFor={item.id} onClick={(e) => e.stopPropagation()}>
        {item.name}
      </label>
      <span className="text-xs font-medium text-gray-500 shrink-0 bg-gray-100/50 px-2 py-0.5 rounded-sm">{item.amount} {item.unit}</span>
    </div>
  );
}
