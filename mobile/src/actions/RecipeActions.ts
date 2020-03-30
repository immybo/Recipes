import { Recipe } from "../model/Recipe";
import { Dispatch } from "redux";
import { RecipesApi } from "../services/api/Recipes";
import { ServerError } from "../services/api/ServerError";
import { setApiErrorToDisplay } from "./NetworkActions";

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
        return RecipesApi.addRecipe(newRecipe).then(
            recipeId => fetchRecipes()(dispatch),
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
        return RecipesApi.deleteRecipe(toDelete.id).then(
            response => dispatch(deleteRecipeLocal(toDelete)),
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
        return RecipesApi.updateRecipe(updatedRecipe).then(
            response => dispatch(updateRecipeLocal(updatedRecipe)),
            (error: ServerError) => {
                switch (error) {
                    case ServerError.MethodMustNotBeEmpty:
                    default:
                        // I don't think we're meant to do this... TODO find some other way
                        dispatch(setApiErrorToDisplay("Error updating recipe. Please try again."));
                        return;
                }
            }
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
    return function(dispatch: Dispatch<RecipeActionTypes>) {
        return RecipesApi.getAllRecipes().then(
            recipes => dispatch(setAllRecipes(recipes)),
            // I don't think we're meant to do this... TODO find some other way
            error => dispatch(setApiErrorToDisplay("Error retrieving recipes."))
        );
    }
}

export function setAllRecipes(allRecipes: Recipe[]): RecipeActionTypes {
    return {
        type: SET_ALL_RECIPES,
        payload: allRecipes
    }
}