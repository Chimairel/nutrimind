"use client";
import * as Dialog from '@radix-ui/react-dialog';
import { Meal } from '@/types';
import MacroBreakdown from './MacroBreakdown';
import CookingSteps from './CookingSteps';
import { X } from 'lucide-react';

export default function RecipeModal({ children, meal }: { children: React.ReactNode, meal: Meal }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40 z-[60] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[60] grid w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] max-h-[85vh] overflow-y-auto bg-white p-5 shadow-xl rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" aria-describedby={undefined}>
          
          <div className="flex justify-between items-start mb-1">
            <div className="pr-4">
              <Dialog.Title className="text-lg font-bold text-gray-900 leading-tight block">{meal.name}</Dialog.Title>
            </div>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100 transition-colors shrink-0 outline-none focus:ring-2 focus:ring-gray-200">
              <X size={18} className="text-gray-500" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          
          <p className="text-xs text-gray-500 mt-1 block">
            {meal.description} <span className="mx-1">•</span> <span className="font-semibold">{meal.calories} kcal</span>
          </p>

          <MacroBreakdown macros={meal.macros} />
          
          <div className="mt-4">
            <CookingSteps ingredients={meal.ingredients} instructions={meal.instructions} />
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
