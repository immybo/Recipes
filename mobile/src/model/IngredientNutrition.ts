import { MacronutrientInformation } from "./MacronutrientInformation";
import { Quantity } from "./Quantity";
import { Density } from "./Density";

export interface IngredientNutrition {
    ingredientId: number,
    macronutrientsPerServing: MacronutrientInformation,
    servingSize: Quantity,
    density: Density
}