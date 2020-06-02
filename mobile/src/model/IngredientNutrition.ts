import { MacronutrientInformation, getDefaultMacronutrientInformation } from "./MacronutrientInformation";
import { Quantity } from "./Quantity";
import { Density, getDefaultDensity } from "./Density";
import { QuantityUnit } from "./QuantityUnit";

export interface IngredientNutrition {
    ingredientId: number,
    macronutrientsPerServing: MacronutrientInformation,
    servingSize: Quantity,
    density: Density
}

export function getDefaultIngredientNutrition(): IngredientNutrition {
    return {
        ingredientId: -1,
        macronutrientsPerServing: getDefaultMacronutrientInformation(),
        density: getDefaultDensity(),
        servingSize: {
            amount: 0,
            unit: QuantityUnit.Cups
        }
    }
}