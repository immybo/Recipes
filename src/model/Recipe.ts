import { Ingredient } from "./Ingredient";

export interface Recipe {
    ingredients: Ingredient[];
    name: string;
    description: string;
}

export interface RecipeState {
    recipes: Recipe[];
}