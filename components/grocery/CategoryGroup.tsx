import { GroceryItem as IGroceryItem } from '@/types';
import GroceryItem from './GroceryItem';

export default function CategoryGroup({ title, items }: { title: string, items: IGroceryItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-5 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{title}</h3>
      <div className="flex flex-col">
        {items.map(item => (
          <GroceryItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
