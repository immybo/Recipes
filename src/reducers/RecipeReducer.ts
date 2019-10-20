import { RecipeActionTypes, ADD_RECIPE } from "../actions/RecipeActions";
import { RecipeState } from "../model/Recipe";

const initialState: RecipeState = {
    recipes: [
        {
            ingredients: ["ingredient1", "ingredient2"],
            name: "test recipe"
        }
    ]
}

export default function(state = initialState, action: RecipeActionTypes) {
    switch (action.type) {
        case ADD_RECIPE:
            return {
                recipes: [...state.recipes, action.payload]
            }
        default:
            return state;
    }
}