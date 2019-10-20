import { Recipe } from "../model/Recipe";
export const ADD_RECIPE = "ADD_RECIPE";

interface AddRecipeAction {
    type: typeof ADD_RECIPE
    payload: Recipe
}

export type RecipeActionTypes = AddRecipeAction;

export function addRecipe(newRecipe: Recipe): RecipeActionTypes {
    return {
        type: ADD_RECIPE,
        payload: newRecipe
    }
}