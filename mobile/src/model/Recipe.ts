import { IngredientWithQuantity } from "./IngredientWithQuantity";
import { Category } from "./Category";
import { getEmptyMethod, Method } from "./Method";
import { MacronutrientInformation } from "./MacronutrientInformation";

export interface Recipe {
    id: number,
    ingredients: IngredientWithQuantity[];
    categories: Category[];
    method: Method;
    name: string;
    description: string;
    numberOfServings: number;
}

export interface RecipeState {
    recipes: Recipe[];
    recipeContext?: Recipe;
    recipeNutrition: Map<number, MacronutrientInformation>;
}

export function getBlankRecipe(): Recipe {
    return {
        id: getUniqueRecipeId(),
        ingredients: [],
        categories: [],
        name: "",
        description: "",
        numberOfServings: 1,
        method: getEmptyMethod()
    };
}

var nextUniqueId: number = 0;

export function getUniqueRecipeId(): number {
    return nextUniqueId++;
}