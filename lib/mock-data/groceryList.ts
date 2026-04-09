import { GroceryList } from "@/types";

export const mockGroceryList: GroceryList = {
  id: "gl-001",
  weekOf: new Date().toISOString().split('T')[0],
  items: [
    // PRODUCE
    { id: "item-1", name: "Garlic", amount: 2, unit: "heads", category: "PRODUCE", availability: "BOTH", isChecked: false },
    { id: "item-2", name: "Onion", amount: 3, unit: "pcs", category: "PRODUCE", availability: "BOTH", isChecked: true },
    { id: "item-3", name: "Kangkong (Water Spinach)", amount: 2, unit: "bunches", category: "PRODUCE", availability: "WET_MARKET", isChecked: false },
    { id: "item-4", name: "Tomatoes", amount: 5, unit: "pcs", category: "PRODUCE", availability: "WET_MARKET", isChecked: false },
    
    // PROTEIN
    { id: "item-5", name: "Tilapia (Cleaned)", amount: 1, unit: "pc", category: "PROTEIN", availability: "WET_MARKET", isChecked: false },
    { id: "item-6", name: "Chicken Breast (Skinless)", amount: 1, unit: "kg", category: "PROTEIN", availability: "BOTH", isChecked: false },
    { id: "item-7", name: "Eggs", amount: 1, unit: "dozen", category: "PROTEIN", availability: "BOTH", isChecked: false },
    
    // PANTRY
    { id: "item-8", name: "Soy Sauce (Datu Puti/Silver Swan)", amount: 1, unit: "bottle", category: "PANTRY", availability: "SUPERMARKET", isChecked: true },
    { id: "item-9", name: "Vinegar", amount: 1, unit: "bottle", category: "PANTRY", availability: "SUPERMARKET", isChecked: true },
    { id: "item-12", name: "White Rice (Jasmine / Dinorado)", amount: 5, unit: "kg", category: "PANTRY", availability: "SUPERMARKET", isChecked: true },
    { id: "item-13", name: "Olive oil", amount: 1, unit: "bottle", category: "PANTRY", availability: "SUPERMARKET", isChecked: false },

    // SPICES
    { id: "item-10", name: "Black Peppercorns", amount: 1, unit: "pack", category: "SPICES", availability: "BOTH", isChecked: false },
    { id: "item-11", name: "Sinigang Mix", amount: 2, unit: "packs", category: "SPICES", availability: "SUPERMARKET", isChecked: false },
  ]
};
