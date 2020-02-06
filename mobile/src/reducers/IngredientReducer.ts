import { Ingredient } from "../model/Ingredient";
import { IngredientActionTypes, ADD_INGREDIENT, SET_ALL_INGREDIENTS } from "../actions/IngredientActions";

export interface IngredientState {
    allIngredients: Ingredient[]
}

const initialState: IngredientState = {
    allIngredients: []
}

export default function(state = initialState, action: IngredientActionTypes) {
    switch (action.type) {
        case ADD_INGREDIENT:
            return {
                ...state,
                allIngredients: [...state.allIngredients, action.payload]
            };
        case SET_ALL_INGREDIENTS:
            return {
                ...state,
                allIngredients: action.payload
            }
        default:
            return state;
    }
}