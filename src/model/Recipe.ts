export interface Recipe {
    ingredients: string[];
    name: string;
}

export interface RecipeState {
    recipes: Recipe[];
}