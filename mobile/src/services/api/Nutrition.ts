import { callApi, HttpMethod } from "../Server";
import { ingredientNutritionToJson, parseIngredientNutritions } from "../NutritionalInformationParser";
import { IngredientNutrition } from "../../model/IngredientNutrition";
import { parseNull } from "../NullParser";

export class NutritionApi {
    public static addNutritionalInformationForIngredient(nutrition: IngredientNutrition): Promise<void> {
        return callApi(
                "nutrition/ingredients",
                HttpMethod.POST,
                parseNull,
                ingredientNutritionToJson(nutrition));
    }
    
    public static updateNutritionalInformationForIngredient(nutrition: IngredientNutrition): Promise<void> {
        return callApi(
                "nutrition/ingredients",
                HttpMethod.PUT,
                parseNull,
                ingredientNutritionToJson(nutrition));
    }

    public static getNutritionForIngredients(ingredientIds: number[]): Promise<IngredientNutrition[]> {
        return callApi(
                "nutrition/ingredients/get",
                HttpMethod.PUT,
                parseIngredientNutritions,
                JSON.stringify(ingredientIds))
    }
} 