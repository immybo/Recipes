import { Dispatch } from "redux";
import { callApi, HttpMethod, callApiAsync } from "../services/Server";
import { Ingredient } from "../model/Ingredient";
import { parseIngredients, ingredientToJson } from "../services/IngredientParser";

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
        return callApi("ingredients", HttpMethod.POST, ingredientToJson(newIngredient)).then(
            response => response.json().then(json =>
                dispatch(addIngredientLocal({...newIngredient, id: json}))),
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

export function setAllIngredients(allIngredients: Ingredient[]): IngredientActionTypes {
    return {
        type: SET_ALL_INGREDIENTS,
        payload: allIngredients
    }
}

export function fetchIngredients() {
    return function(dispatch: Dispatch) {
        return callApi("ingredients", HttpMethod.GET).then(
            response => response.json().then(json => dispatch(setAllIngredients(parseIngredients(json)))),
            error => null
        );
    }
}