import { RecipeActionTypes, ADD_RECIPE, SELECT_RECIPE } from "../actions/RecipeActions";
import { RecipeState } from "../model/Recipe";

const initialState: RecipeState = {
    recipes: []
}

export default function(state = initialState, action: RecipeActionTypes) {
    switch (action.type) {
        case ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case SELECT_RECIPE:
            return {
                ...state,
                recipeContext: action.payload
            };
        default:
            return state;
    }
}