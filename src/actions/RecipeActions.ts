import { Recipe } from "../model/Recipe";

export const ADD_RECIPE = "ADD_RECIPE";
export const SELECT_RECIPE = "SELECT_RECIPE";

interface AddRecipeAction {
    type: typeof ADD_RECIPE,
    payload: Recipe
}

interface SelectRecipeAction {
    type: typeof SELECT_RECIPE,
    payload: Recipe
}

export type RecipeActionTypes = AddRecipeAction | SelectRecipeAction;

export function addRecipe(newRecipe: Recipe): RecipeActionTypes {
    return {
        type: ADD_RECIPE,
        payload: newRecipe
    }
}

export function selectRecipe(newSelectedRecipe: Recipe): RecipeActionTypes {
    return {
        type: SELECT_RECIPE,
        payload: newSelectedRecipe
    }
}