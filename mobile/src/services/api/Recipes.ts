import { Recipe } from "../../model/Recipe";
import { HttpMethod, callApi } from "../Server";
import { parseRecipes, recipeToJson, parseRecipe } from "../RecipeParser";

export class RecipesApi {
    public static addRecipe(recipe: Recipe): Promise<number> {
        return callApi(
                "recipes",
                HttpMethod.POST,
                parseInt,
                recipeToJson(recipe));
    } 
    
    public static getAllRecipes(): Promise<Recipe[]> {
        return callApi(
                "recipes",
                HttpMethod.GET,
                parseRecipes);
    }

    public static getRecipe(recipeId: number): Promise<Recipe> {
        return callApi(
                "recipes/" + recipeId,
                HttpMethod.GET,
                parseRecipe);
    }

    public static deleteRecipe(recipeId: number): Promise<number> {
        return callApi(
                "recipes/" + recipeId,
                HttpMethod.DELETE,
                parseInt);
    }

    public static updateRecipe(recipe: Recipe): Promise<number> {
        return callApi(
                "recipes",
                HttpMethod.PUT,
                parseInt,
                recipeToJson(recipe));
    }
} 