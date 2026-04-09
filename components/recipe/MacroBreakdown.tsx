import { Macros } from '@/types';

export default function MacroBreakdown({ macros }: { macros: Macros }) {
  const total = macros.protein + macros.carbs + macros.fat;
  const getPercent = (val: number) => Math.round((val / total) * 100) || 0;

  return (
    <div className="space-y-3 w-full my-4">
      <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-gray-100">
        <div style={{ width: `${getPercent(macros.protein)}%` }} className="bg-blue-500 h-full" />
        <div style={{ width: `${getPercent(macros.carbs)}%` }} className="bg-amber-500 h-full" />
        <div style={{ width: `${getPercent(macros.fat)}%` }} className="bg-rose-500 h-full" />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="flex flex-col bg-blue-50/50 rounded p-1.5 border border-blue-100/50">
          <span className="font-bold text-blue-700">{macros.protein}g</span>
          <span className="text-gray-500 text-[9px] uppercase tracking-wider">Protein</span>
        </div>
        <div className="flex flex-col bg-amber-50/50 rounded p-1.5 border border-amber-100/50">
          <span className="font-bold text-amber-700">{macros.carbs}g</span>
          <span className="text-gray-500 text-[9px] uppercase tracking-wider">Carbs</span>
        </div>
        <div className="flex flex-col bg-rose-50/50 rounded p-1.5 border border-rose-100/50">
          <span className="font-bold text-rose-700">{macros.fat}g</span>
          <span className="text-gray-500 text-[9px] uppercase tracking-wider">Fat</span>
        </div>
      </div>
    </div>
  );
}
