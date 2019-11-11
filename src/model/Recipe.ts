import { Ingredient } from "./Ingredient";
import { Category } from "./Category";

export interface Recipe {
    id: number,
    ingredients: Ingredient[];
    categories: Category[];
    name: string;
    description: string;
}

export interface RecipeState {
    recipes: Recipe[];
    recipeContext?: Recipe;
}

export function getBlankRecipe(): Recipe {
    return {
        id: getUniqueRecipeId(),
        ingredients: [],
        categories: [],
        name: "",
        description: ""
    };
}

var nextUniqueId: number = 0;

export function getUniqueRecipeId(): number {
    return nextUniqueId++;
}