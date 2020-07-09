import { MacronutrientInformation } from "../model/MacronutrientInformation";
import { Recipe } from "../model/Recipe";

export function convertToNutritionPerServing(recipe: Recipe, totalNutrition: MacronutrientInformation): MacronutrientInformation {
    let numServings: number = recipe.numberOfServings;
    if (numServings < 1) numServings = 1;

    return {
        calories: totalNutrition.calories / numServings,
        carbGrams: totalNutrition.carbGrams / numServings,
        fatGrams: totalNutrition.fatGrams / numServings,
        proteinGrams: totalNutrition.proteinGrams / numServings
    };
}