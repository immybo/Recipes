import { NutritionalInformation } from "../model/NutritionalInformation";
import { MacronutrientInformation } from "../model/MacronutrientInformation";

export function parseNutritionalInformation(nutritionJson: any): NutritionalInformation {
    return {
        ingredientId: nutritionJson.IngredientId,
        macronutrients: {
            caloriesPerServing: nutritionJson.Macronutrients.CaloriesPerServing,
            carbGramsPerServing: nutritionJson.Macronutrients.CarbGramsPerServing,
            fatGramsPerServing: nutritionJson.Macronutrients.FatGramsPerServing,
            proteinGramsPerServing: nutritionJson.Macronutrients.ProteinGramsPerServing,
            servingSize: {
                amount: Number.parseFloat(nutritionJson.Macronutrients.ServingSize.Amount),
                unit: nutritionJson.Macronutrients.ServingSize.Unit
            }
        }
    };
}

export function nutritionalInformationToJson(nutrition: NutritionalInformation) {
    return JSON.stringify(nutrition)
}

export function parseMacronutrientInformation(json: any): MacronutrientInformation {
    var nutritionJson = json.Fields[0];
    return {
        caloriesPerServing: nutritionJson.CaloriesPerServing,
        carbGramsPerServing: nutritionJson.CarbGramsPerServing,
        fatGramsPerServing: nutritionJson.FatGramsPerServing,
        proteinGramsPerServing: nutritionJson.ProteinGramsPerServing,
        servingSize: {
            amount: Number.parseFloat(nutritionJson.ServingSize.Amount),
            unit: nutritionJson.ServingSize.Unit
        }
    };
}