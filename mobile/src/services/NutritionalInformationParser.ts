import { NutritionalInformation } from "../model/NutritionalInformation";

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