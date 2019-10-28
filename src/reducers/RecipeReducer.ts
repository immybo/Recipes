import { RecipeActionTypes, ADD_RECIPE, SELECT_RECIPE, DELETE_RECIPE } from "../actions/RecipeActions";
import { RecipeState, Recipe } from "../model/Recipe";

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
        case DELETE_RECIPE:
            let indexOf: number = state.recipes.indexOf(action.payload);
            let newRecipes: Recipe[] = [...state.recipes];
            newRecipes.splice(indexOf, 1);
            return {
                ...state,
                recipes: newRecipes
            }
        default:
            return state;
    }
}