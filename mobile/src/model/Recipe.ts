import { IngredientWithQuantity } from "./IngredientWithQuantity";
import { Category } from "./Category";
import { getEmptyMethod, Method } from "./Method";

export interface Recipe {
    id: number,
    ingredients: IngredientWithQuantity[];
    categories: Category[];
    method: Method;
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
        description: "",
        method: getEmptyMethod()
    };
}

var nextUniqueId: number = 0;

export function getUniqueRecipeId(): number {
    return nextUniqueId++;
}