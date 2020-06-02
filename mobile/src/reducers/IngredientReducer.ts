import { Ingredient } from "../model/Ingredient";
import { IngredientActionTypes, ADD_INGREDIENT, SET_ALL_INGREDIENTS, DELETE_INGREDIENT, UPDATE_INGREDIENT, UPDATE_INGREDIENT_NUTRITION } from "../actions/IngredientActions";
import { IngredientNutrition } from "../model/IngredientNutrition";

export interface IngredientState {
    allIngredients: Ingredient[]
    ingredientNutrition: IngredientNutrition[]
}

const initialState: IngredientState = {
    allIngredients: [],
    ingredientNutrition: []
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
        case DELETE_INGREDIENT:
            return {
                ...state,
                allIngredients: state.allIngredients.filter(x => x.id !== action.payload.id)
            }
        case UPDATE_INGREDIENT:
            let indexToUpdate: number = state.allIngredients.findIndex(x => x.id === action.payload.id);
            let ingredientsAfterUpdate: Ingredient[] = [...state.allIngredients];
            ingredientsAfterUpdate[indexToUpdate] = action.payload;
            return {
                ...state,
                allIngredients: ingredientsAfterUpdate
            }
        case UPDATE_INGREDIENT_NUTRITION:
            // Could make this a dictionary but it's unlikely to be worth it
            let filteredNutrition = state.ingredientNutrition.filter(x => x.ingredientId !== action.payload.ingredientId);
            return {
                ...state,
                ingredientNutrition: [...filteredNutrition, action.payload]
            }
        default:
            return state;
    }
}