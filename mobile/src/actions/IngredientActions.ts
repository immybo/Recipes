import { Dispatch } from "redux";
import { Ingredient } from "../model/Ingredient";
import { IngredientsApi } from "../services/api/Ingredients";
import { IngredientNutrition } from "../model/IngredientNutrition";
import { NutritionApi } from "../services/api/Nutrition";
import { setApiErrorToDisplay } from "./NetworkActions";

export const ADD_INGREDIENT = "ADD_INGREDIENT";
export const SET_ALL_INGREDIENTS = "SET_ALL_INGREDIENTS";

interface AddIngredientAction {
    type: typeof ADD_INGREDIENT,
    payload: Ingredient
}

interface SetAllIngredientsAction {
    type: typeof SET_ALL_INGREDIENTS,
    payload: Ingredient[]
}

export type IngredientActionTypes = AddIngredientAction | SetAllIngredientsAction;

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
                NutritionApi.addNutritionalInformationForIngredient(nutrition);
            },
            error => dispatch(setApiErrorToDisplay("Error adding ingredient. " + String(error)))
        );
    }
}

export function addIngredientLocal(newIngredient: Ingredient): IngredientActionTypes {
    return {
        type: ADD_INGREDIENT,
        payload: newIngredient
    }
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