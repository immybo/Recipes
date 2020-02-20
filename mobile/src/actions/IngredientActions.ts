import { Dispatch } from "redux";
import { callApiRaw, HttpMethod } from "../services/Server";
import { Ingredient } from "../model/Ingredient";
import { parseIngredients, ingredientToJson } from "../services/IngredientParser";
import { IngredientsApi } from "../services/api/Ingredients";

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
    return function(dispatch: Dispatch<IngredientActionTypes>) {
        return IngredientsApi.addIngredient(newIngredient).then(
            ingredientId => dispatch(addIngredientLocal({...newIngredient, id: ingredientId})),
            error => console.error(error) // TODO error handling
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
            error => null
        );
    }
}

export function setAllIngredients(allIngredients: Ingredient[]): IngredientActionTypes {
    return {
        type: SET_ALL_INGREDIENTS,
        payload: allIngredients
    }
}