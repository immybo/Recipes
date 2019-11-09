import { RecipeActionTypes, ADD_RECIPE, SELECT_RECIPE, DELETE_RECIPE } from "../actions/RecipeActions";
import { RecipeState, Recipe } from "../model/Recipe";

const initialState: RecipeState = {
    recipes: [
        {
            name: "Mushroom Pasta",
            categories: [
                {
                    name: "Pasta"
                },
                {
                    name: "Vegetarian"
                }
            ],
            description: "Some sort of mushroom pasta dish.",
            ingredients: [
                {
                    name:  "Rigatoni",
                    quantity: {
                        quantity: 3
                    }
                },
                {
                    name: "Portobello mushrooms",
                    quantity: {
                        quantity: 1.5
                    }
                }
            ]
        },
        {
            name: "Pizza",
            categories: [
                {
                    name: "Pizza"
                },
                {
                    name: "Italian"
                }
            ],
            description: "Classic margherita pizza.",
            ingredients: [
                {
                    name:  "Flour",
                    quantity: {
                        quantity: 5
                    }
                },
                {
                    name: "Active dry yeast",
                    quantity: {
                        quantity: 1
                    }
                },
                {
                    name: "Mozarella",
                    quantity: {
                        quantity: 5
                    }
                },
                {
                    name: "Tomato",
                    quantity: {
                        quantity: 2
                    }
                },
                {
                    name: "Sugar",
                    quantity: {
                        quantity: 1
                    }
                },
                {
                    name: "Whole basil leaf",
                    quantity: {
                        quantity: 3
                    }
                },
                {
                    name: "Cherry tomato",
                    quantity: {
                        quantity: 5
                    }
                }
            ]
        }
    ]
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