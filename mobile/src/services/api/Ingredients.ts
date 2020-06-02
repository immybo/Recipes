import { HttpMethod, callApi } from "../Server";
import { ingredientToJson, parseIngredients } from "../IngredientParser";
import { Ingredient } from "../../model/Ingredient";
import { parseNull } from "../NullParser";

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

    public static deleteIngredient(ingredientId: number): Promise<void> {
        return callApi(
                "ingredients",
                HttpMethod.DELETE,
                parseNull,
                JSON.stringify(ingredientId));
    }

    public static updateIngredient(updatedIngredient: Ingredient): Promise<void> {
        return callApi(
                "ingredients",
                HttpMethod.PUT,
                parseNull,
                ingredientToJson(updatedIngredient));
    }
} 