import { Macros } from '@/types';

export default function MacroPills({ macros }: { macros: Macros }) {
  return (
    <div className="flex space-x-2">
      <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
        <span>{macros.protein}g</span>
        <span className="text-[9px] uppercase tracking-wider text-blue-500/70">Protein</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold">
        <span>{macros.carbs}g</span>
        <span className="text-[9px] uppercase tracking-wider text-amber-500/70">Carbs</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-semibold">
        <span>{macros.fat}g</span>
        <span className="text-[9px] uppercase tracking-wider text-rose-500/70">Fat</span>
      </div>
    </div>
  );
}
