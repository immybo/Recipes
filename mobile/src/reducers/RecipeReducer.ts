import { RecipeActionTypes, ADD_RECIPE, DELETE_RECIPE, UPDATE_RECIPE, SET_ALL_RECIPES, SET_NUTRITIONAL_INFORMATION_FOR_RECIPE } from "../actions/RecipeActions";
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
        case DELETE_RECIPE:
            let indexToDelete: number = state.recipes.indexOf(action.payload);
            let newRecipes: Recipe[] = [...state.recipes];
            newRecipes.splice(indexToDelete, 1);
            return {
                ...state,
                recipes: newRecipes
            }
        case UPDATE_RECIPE:
            let indexToUpdate: number = state.recipes.findIndex(x => x.id === action.payload.id);
            let recipesAfterUpdate: Recipe[] = [...state.recipes];
            recipesAfterUpdate[indexToUpdate] = action.payload;
            return {
                ...state,
                recipes: recipesAfterUpdate
            }
        case SET_ALL_RECIPES:
            return {
                ...state,
                recipes: action.payload
            }
        case SET_NUTRITIONAL_INFORMATION_FOR_RECIPE:
            return {
                ...state,
                nutritionalInformationForCurrentRecipe: action.payload[1]
            }
        default:
            return state;
    }
}