import { Meal } from '@/types';
import MacroPills from './MacroPills';
import RecipeModal from '@/components/recipe/RecipeModal';
import { Clock } from 'lucide-react';

export default function MealCard({ meal }: { meal: Meal }) {
  return (
    <RecipeModal meal={meal}>
      <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3 cursor-pointer hover:bg-gray-50 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-green-500/20">
        <div className="flex justify-between items-start w-full">
          <div className="flex-1 pr-2">
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">{meal.type}</span>
            <h3 className="font-semibold text-gray-900 leading-tight mt-0.5">{meal.name}</h3>
          </div>
          <div className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs font-medium border border-gray-100 shrink-0">
            <Clock size={12} className="mr-1" />
            {meal.preparationTimeMin}m
          </div>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 w-full">{meal.description}</p>
        <div className="pt-2 flex justify-between items-center border-t border-gray-50 w-full mt-2">
          <MacroPills macros={meal.macros} />
          <span className="text-sm font-bold text-gray-900 shrink-0">{meal.calories} kcal</span>
        </div>
      </button>
    </RecipeModal>
  );
}
