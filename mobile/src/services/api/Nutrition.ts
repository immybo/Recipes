import { callApi, HttpMethod } from "../Server";
import { ingredientNutritionToJson } from "../NutritionalInformationParser";
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
} 