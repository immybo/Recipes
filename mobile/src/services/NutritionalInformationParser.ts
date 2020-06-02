import { IngredientNutrition } from "../model/IngredientNutrition";
import { MacronutrientInformation } from "../model/MacronutrientInformation";

export function parseIngredientNutritions(nutritionsJson: any): IngredientNutrition[] {
    return nutritionsJson.map((nutritionJson: any) => parseIngredientNutrition(nutritionJson));
}

export function parseIngredientNutrition(nutritionJson: any): IngredientNutrition {
    return {
        ingredientId: nutritionJson.IngredientId,
        servingSize: {
            unit: nutritionJson.ServingSize.Unit,
            amount: nutritionJson.ServingSize.Amount
        },
        density: {
            equivalentByVolume: {
                unit: nutritionJson.Density.EquivalentByVolume.Unit,
                amount: nutritionJson.Density.EquivalentByVolume.Amount
            },
            equivalentByWeight: {
                unit: nutritionJson.Density.EquivalentByWeight.Unit,
                amount: nutritionJson.Density.EquivalentByWeight.Amount
            }
        },
        macronutrientsPerServing: {
            calories: nutritionJson.MacronutrientsPerServing.Calories,
            carbGrams: nutritionJson.MacronutrientsPerServing.CarbGrams,
            fatGrams: nutritionJson.MacronutrientsPerServing.FatGrams,
            proteinGrams: nutritionJson.MacronutrientsPerServing.ProteinGrams
        }
    };
}

export function ingredientNutritionToJson(nutrition: IngredientNutrition) {
    return JSON.stringify(nutrition)
}

export function parseMacronutrientInformation(json: any): MacronutrientInformation {
    var nutritionJson = json.Fields[0];
    return {
        calories: nutritionJson.Calories,
        carbGrams: nutritionJson.CarbGrams,
        fatGrams: nutritionJson.FatGrams,
        proteinGrams: nutritionJson.ProteinGrams
    };
}