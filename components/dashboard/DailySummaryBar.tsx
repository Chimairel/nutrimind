"use client";
import * as Progress from '@radix-ui/react-progress';

interface Props {
  currentCal: number;
  targetCal: number;
}

export default function DailySummaryBar({ currentCal, targetCal }: Props) {
  const percentage = Math.min((currentCal / targetCal) * 100, 100);
  const isOver = currentCal > targetCal;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Calories</p>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-2xl font-bold text-gray-900">{currentCal}</span>
            <span className="text-sm text-gray-400 font-medium">/ {targetCal} kcal</span>
          </div>
        </div>
      </div>
      <Progress.Root className="relative overflow-hidden bg-gray-100 rounded-full w-full h-2.5">
        <Progress.Indicator
          className={`h-full w-full flex-1 transition-all duration-500 ease-in-out ${isOver ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </Progress.Root>
      {isOver && <p className="text-xs text-red-500 font-medium">Over daily target!</p>}
    </div>
  );
}
