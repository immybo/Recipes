import { Dispatch } from "redux";
import { Ingredient } from "../model/Ingredient";
import { IngredientsApi } from "../services/api/Ingredients";
import { IngredientNutrition } from "../model/IngredientNutrition";
import { NutritionApi } from "../services/api/Nutrition";
import { setApiErrorToDisplay } from "./NetworkActions";

export const ADD_INGREDIENT = "ADD_INGREDIENT";
export const SET_ALL_INGREDIENTS = "SET_ALL_INGREDIENTS";
export const DELETE_INGREDIENT = "DELETE_INGREDIENT";
export const UPDATE_INGREDIENT = "UPDATE_INGREDIENT";
export const UPDATE_INGREDIENT_NUTRITION = "UPDATE_INGREDIENT_NUTRITION";

interface AddIngredientAction {
    type: typeof ADD_INGREDIENT,
    payload: Ingredient
}

interface SetAllIngredientsAction {
    type: typeof SET_ALL_INGREDIENTS,
    payload: Ingredient[]
}

interface DeleteIngredientAction {
    type: typeof DELETE_INGREDIENT,
    payload: Ingredient
}

interface UpdateIngredientAction {
    type: typeof UPDATE_INGREDIENT,
    payload: Ingredient
}

interface UpdateIngredientNutritionAction {
    type: typeof UPDATE_INGREDIENT_NUTRITION,
    payload: IngredientNutrition
}

export type IngredientActionTypes = AddIngredientAction | SetAllIngredientsAction | DeleteIngredientAction | UpdateIngredientAction | UpdateIngredientNutritionAction;

export function addIngredient(newIngredient: Ingredient)  {
    return function(dispatch: Dispatch) {
        return IngredientsApi.addIngredient(newIngredient).then(
            ingredientId => { dispatch(addIngredientLocal({...newIngredient, id: ingredientId})); return ingredientId; },
            error => dispatch(setApiErrorToDisplay("Error adding ingredient. " + String(error)))
        );
    }
}

export function addIngredientWithNutritionalInformation(newIngredient: Ingredient, nutrition: IngredientNutrition) {
    return function(dispatch: Dispatch) {
        return IngredientsApi.addIngredient(newIngredient).then(
            ingredientId => {
                dispatch(addIngredientLocal({...newIngredient, id: ingredientId}));
                nutrition.ingredientId = ingredientId;

                if (nutrition != null) {
                    NutritionApi.addNutritionalInformationForIngredient(nutrition);
                }
            },
            error => dispatch(setApiErrorToDisplay("Error adding ingredient. " + String(error)))
        );
    }
}

export function deleteIngredient(ingredient: Ingredient) {
    return function(dispatch: Dispatch) {
        return IngredientsApi.deleteIngredient(ingredient.id).then(
            _ => {
                dispatch(removeIngredientLocal(ingredient))
            },
            error => {
                if (error == 12) {
                    dispatch(setApiErrorToDisplay("Can't delete ingredient " + ingredient.name + " because it's used by a recipe."))
                } else {
                    dispatch(setApiErrorToDisplay("Error deleting ingredient. " + String(error)))
                }
            }
        );
    }
}

export function updateIngredient(ingredient: Ingredient) {
    return function(dispatch: Dispatch) {
        return IngredientsApi.updateIngredient(ingredient).then(
            _ => dispatch(updateIngredientLocal(ingredient)),
            error => dispatch(setApiErrorToDisplay("Error updating ingredient. " + String(error)))
        );
    }
}

export function updateIngredientNutrition(nutrition: IngredientNutrition) {
    return function(dispatch: Dispatch) {
        return NutritionApi.updateNutritionalInformationForIngredient(nutrition).then(
            _ => dispatch(updateIngredientNutritionLocal(nutrition)),
            error => dispatch(setApiErrorToDisplay("Error updating nutritional information for ingredient. " + String(error)))
        );
    }
}

export function fetchNutritionForIngredient(ingredient: Ingredient) {
    return function(dispatch: Dispatch) {
        return NutritionApi.getNutritionForIngredients([ ingredient.id ]).then(
            nutrition => {
                if (nutrition.length > 0) dispatch(updateIngredientNutritionLocal(nutrition[0]))
            },
            error => dispatch(setApiErrorToDisplay("Error fetching nutritional information for ingredient. " + String(error)))
        );
    }
}

export function updateIngredientNutritionLocal(nutrition: IngredientNutrition): IngredientActionTypes {
    return {
        type: UPDATE_INGREDIENT_NUTRITION,
        payload: nutrition
    }
}

export function addIngredientLocal(newIngredient: Ingredient): IngredientActionTypes {
    return {
        type: ADD_INGREDIENT,
        payload: newIngredient
    }
}

export function removeIngredientLocal(ingredient: Ingredient): IngredientActionTypes {
    return {
        type: DELETE_INGREDIENT,
        payload: ingredient
    }
}

export function updateIngredientLocal(newIngredient: Ingredient): IngredientActionTypes {
    return {
        type: UPDATE_INGREDIENT,
        payload: newIngredient
    };
}

export function fetchIngredients() {
    return function(dispatch: Dispatch) {
        return IngredientsApi.getAllIngredients().then(
            ingredients => dispatch(setAllIngredients(ingredients)),
            error => dispatch(setApiErrorToDisplay("Error getting ingredients. " + String(error)))
        );
    }
}

export function setAllIngredients(allIngredients: Ingredient[]): IngredientActionTypes {
    return {
        type: SET_ALL_INGREDIENTS,
        payload: allIngredients
    }
}