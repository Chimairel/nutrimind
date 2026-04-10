import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GroceryList from "@/components/grocery/GroceryList";
import { GroceryItem, GroceryList as GroceryListType } from "@/types";
import { ShoppingCart } from "lucide-react";

export default async function GroceryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const meals = await db.meal.findMany({
    where: { userId: session.user.id, isAiGenerated: true },
  });

  if (meals.length === 0) return (
    <div className="flex flex-col items-center justify-center pt-32 px-4 space-y-4">
      <div className="bg-gray-100 p-4 rounded-full"><ShoppingCart size={32} className="text-gray-400"/></div>
      <p className="text-gray-500 font-medium text-center">No grocery list yet.<br/>Generate a meal plan first.</p>
    </div>
  );

  // Build grocery list from meal descriptions (ingredients are stored in description)
  const itemMap = new Map<string, GroceryItem>();

  meals.forEach(meal => {
    // Parse ingredients from the description field
    const descText = meal.description || "";
    const ingredientMatch = descText.match(/Ingredients:\s*([\s\S]*?)(\n\nSteps:|$)/);
    if (!ingredientMatch) return;

    const ingredientLine = ingredientMatch[1];
    const parts = ingredientLine.split(",").map(s => s.trim()).filter(Boolean);

    parts.forEach((part, index) => {
      // Try to parse "amount unit name" format e.g. "200 g chicken breast"
      const match = part.match(/^([\d.]+)\s+(\S+)\s+(.+)$/);
      const name = match ? match[3] : part;
      const amount = match ? parseFloat(match[1]) : 1;
      const unit = match ? match[2] : "pc";
      const key = name.toLowerCase().trim();

      if (itemMap.has(key)) {
        const existing = itemMap.get(key)!;
        if (existing.unit.toLowerCase() === unit.toLowerCase()) {
          existing.amount += amount;
        }
      } else {
        itemMap.set(key, {
          id: `ing-${meal.id}-${index}`,
          name,
          amount,
          unit,
          category: "PANTRY",
          availability: "BOTH",
          isChecked: false,
        });
      }
    });
  });

  const finalItems = Array.from(itemMap.values()).map(item => ({
    ...item,
    amount: Math.round(item.amount * 100) / 100,
  }));

  const list: GroceryListType = {
    id: "db-list",
    weekOf: new Date().toISOString().split("T")[0],
    items: finalItems,
  };

  return (
    <div className="px-4 pt-10 pb-24 space-y-6 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Grocery List</h1>
        <p className="text-sm text-gray-500">
          Week of {new Date(list.weekOf).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </header>

      <div className="pt-2">
        <GroceryList list={list} />
      </div>
    </div>
  );
}
