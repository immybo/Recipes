import { Recipe } from "../model/Recipe";
import { Dispatch } from "react";
import { callApi, HttpMethod } from "../services/Server";
import { parseRecipes, recipeToJson } from "../services/RecipeParser";

export const ADD_RECIPE = "ADD_RECIPE";
export const DELETE_RECIPE = "DELETE_RECIPE";
export const UPDATE_RECIPE = "UPDATE_RECIPE";
export const SET_ALL_RECIPES = "SET_ALL_RECIPES";

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

export type RecipeActionTypes = AddRecipeAction | DeleteRecipeAction | UpdateRecipeAction | SetAllRecipesAction;

export function addRecipe(newRecipe: Recipe)  {
    return function(dispatch: Dispatch<RecipeActionTypes>) {
        return callApi("recipes", HttpMethod.POST, recipeToJson(newRecipe)).then(
            response => response.json().then(json => dispatch(addRecipeLocal(newRecipe))),
            error => console.error(error) // TODO error handling
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
    return function(dispatch: Dispatch<RecipeActionTypes>) {
        return callApi("recipes/" + toDelete.id, HttpMethod.DELETE, {}).then(
            response => response.json().then(json => dispatch(deleteRecipeLocal(toDelete))),
            error => console.error(error) // TODO error handling
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
    return function(dispatch: Dispatch<RecipeActionTypes>) {
        return callApi("recipes", HttpMethod.PUT, recipeToJson(updatedRecipe)).then(
            response => response.json().then(json => dispatch(updateRecipeLocal(updatedRecipe))),
            error => console.error(error) // TODO error handling
        );
    }
}

export function updateRecipeLocal(newRecipe: Recipe): RecipeActionTypes {
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

export function fetchRecipes() {
    return function(dispatch: Dispatch<RecipeActionTypes>) {
        return callApi("recipes", HttpMethod.GET).then(
            response => response.json().then(json => dispatch(setAllRecipes(parseRecipes(json)))),
            error => console.error(error) // TODO error handling
        );
    }
}