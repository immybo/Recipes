import { HttpMethod, callApi } from "../Server";
import { ingredientToJson, parseIngredients } from "../IngredientParser";
import { Ingredient } from "../../model/Ingredient";

export class IngredientsApi {
    public static addIngredient(newIngredient: Ingredient): Promise<number> {
        return callApi(
                "ingredients",
                HttpMethod.POST,
                parseInt,
                ingredientToJson(newIngredient));
    }

    public static getAllIngredients(): Promise<Ingredient[]> {
        return callApi(
                "ingredients",
                HttpMethod.GET,
                parseIngredients);
    }
} 