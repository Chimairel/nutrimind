import { Ingredient } from '@/types';

export default function CookingSteps({ ingredients, instructions }: { ingredients: Ingredient[], instructions: string[] }) {
  return (
    <div className="space-y-6">
      <section>
        <h4 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1.5">Ingredients</h4>
        <ul className="space-y-1.5">
          {ingredients.map((ing) => (
            <li key={ing.id} className="text-xs flex justify-between py-0.5">
              <span className="text-gray-700">{ing.name}</span>
              <span className="text-gray-500 font-medium">{ing.amount} {ing.unit}</span>
            </li>
          ))}
        </ul>
      </section>
      
      <section>
        <h4 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1.5">Instructions</h4>
        <ol className="space-y-2.5 list-decimal list-outside pl-4">
          {instructions.map((step, idx) => (
            <li key={idx} className="text-xs text-gray-700 pl-1 leading-relaxed border-b border-gray-50 pb-2 last:border-0">
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
