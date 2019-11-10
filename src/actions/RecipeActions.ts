import { Recipe } from "../model/Recipe";

export const ADD_RECIPE = "ADD_RECIPE";
export const SELECT_RECIPE = "SELECT_RECIPE";
export const DELETE_RECIPE = "DELETE_RECIPE";
export const UPDATE_RECIPE = "UPDATE_RECIPE";
export const SET_ALL_RECIPES = "SET_ALL_RECIPES";

interface AddRecipeAction {
    type: typeof ADD_RECIPE,
    payload: Recipe
}

interface SelectRecipeAction {
    type: typeof SELECT_RECIPE,
    payload: Recipe
}

interface DeleteRecipeAction {
    type: typeof DELETE_RECIPE,
    payload: Recipe
}

interface UpdateRecipeAction {
    type: typeof UPDATE_RECIPE,
    payload: Recipe
}

interface SetAllRecipesAction {
    type: typeof SET_ALL_RECIPES,
    payload: Recipe[]
}

export type RecipeActionTypes = AddRecipeAction | SelectRecipeAction | DeleteRecipeAction | UpdateRecipeAction | SetAllRecipesAction;

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

export function deleteRecipe(toDelete: Recipe): RecipeActionTypes {
    return {
        type: DELETE_RECIPE,
        payload: toDelete
    }
}

export function updateRecipe(newRecipe: Recipe): RecipeActionTypes {
    return {
        type: UPDATE_RECIPE,
        payload: newRecipe
    }
}

export function setAllRecipes(allRecipes: Recipe[]): RecipeActionTypes {
    return {
        type: SET_ALL_RECIPES,
        payload: allRecipes
    }
}