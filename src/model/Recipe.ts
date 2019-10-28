import { Ingredient } from "./Ingredient";
import { Category } from "./Category";

export interface Recipe {
    ingredients: Ingredient[];
    categories: Category[];
    name: string;
    description: string;
}

export interface RecipeState {
    recipes: Recipe[];
    recipeContext?: Recipe;
}