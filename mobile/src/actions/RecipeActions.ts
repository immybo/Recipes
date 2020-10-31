import { Recipe } from "../model/Recipe";
import { Dispatch } from "redux";
import { RecipesApi } from "../services/api/Recipes";
import { setApiErrorToDisplay } from "./NetworkActions";
import { IngredientNutrition } from "../model/IngredientNutrition";
import { MacronutrientInformation } from "../model/MacronutrientInformation";

export const ADD_RECIPE = "ADD_RECIPE";
export const DELETE_RECIPE = "DELETE_RECIPE";
export const UPDATE_RECIPE = "UPDATE_RECIPE";
export const SET_ALL_RECIPES = "SET_ALL_RECIPES";
export const SET_NUTRITIONAL_INFORMATION_FOR_RECIPE = "SET_NUTRITIONAL_INFORMATION_FOR_RECIPE";

interface AddRecipeAction {
    type: typeof ADD_RECIPE,
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

interface SetNutritionalInformationForRecipeAction {
    type: typeof SET_NUTRITIONAL_INFORMATION_FOR_RECIPE,
    payload: [number, MacronutrientInformation]
}

export type RecipeActionTypes = AddRecipeAction | DeleteRecipeAction | UpdateRecipeAction | SetAllRecipesAction | SetNutritionalInformationForRecipeAction;

export function addRecipe(newRecipe: Recipe)  {
    return function(dispatch: Dispatch) {
        return RecipesApi.addRecipe(newRecipe).then(
            _ => fetchRecipes()(dispatch),
            error => dispatch(setApiErrorToDisplay("Error adding recipe. " + String(error)))
        );
    }
}

export function addRecipeLocal(newRecipe: Recipe): RecipeActionTypes {
    return {
        type: ADD_RECIPE,
        payload: newRecipe
    }
}

export function deleteRecipe(toDelete: Recipe) {
    return function(dispatch: Dispatch) {
        return RecipesApi.deleteRecipe(toDelete.id).then(
            _ => dispatch(deleteRecipeLocal(toDelete)),
            error => dispatch(setApiErrorToDisplay("Error deleting recipe. " + String(error)))
        );
    }
}

export function deleteRecipeLocal(toDelete: Recipe): RecipeActionTypes {
    return {
        type: DELETE_RECIPE,
        payload: toDelete
    }
}

export function updateRecipe(updatedRecipe: Recipe) {
    return function(dispatch: Dispatch) {
        return RecipesApi.updateRecipe(updatedRecipe).then(
            _ => dispatch(updateRecipeLocal(updatedRecipe)),
            error => dispatch(setApiErrorToDisplay("Error updating recipe. " + String(error)))
        );
    }
}

export function updateRecipeLocal(newRecipe: Recipe): RecipeActionTypes {
    return {
        type: UPDATE_RECIPE,
        payload: newRecipe
    }
}

export function fetchRecipes() {
    return function(dispatch: Dispatch) {
        return RecipesApi.getAllRecipes().then(
            recipes => dispatch(setAllRecipes(recipes)),
            error => Promise.reject(error)
        );
    }
}

export function setAllRecipes(allRecipes: Recipe[]): RecipeActionTypes {
    return {
        type: SET_ALL_RECIPES,
        payload: allRecipes
    }
}

export function getNutritionalInformationForRecipe(recipeId: number) {
    return function(dispatch: Dispatch) {
        return RecipesApi.getNutritionalInformationForRecipe(recipeId).then(
            nutrition => dispatch(setNutritionalInformationForRecipe(recipeId, nutrition)),
            error => dispatch(setApiErrorToDisplay("Couldn't calculate nutrition of recipe. " + String(error)))
        );
    }
}

export function setNutritionalInformationForRecipe(recipeId: number, nutrition: MacronutrientInformation): RecipeActionTypes {
    return {
        type: SET_NUTRITIONAL_INFORMATION_FOR_RECIPE,
        payload: [recipeId, nutrition]
    }
}