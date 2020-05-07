import { Recipe } from "../model/Recipe";
import { Category } from "../model/Category";
import { IngredientWithQuantity } from "../model/IngredientWithQuantity";

export function parseRecipes(json: any): Array<Recipe> {
    // TODO error handling on the json to make it clear when we're
    // recieving invalid data
    return json.map((recipeJson: any) => parseRecipe(recipeJson));
}

export function parseRecipe(recipeJson: any): Recipe {
    return {
        id: Number.parseInt(recipeJson.Id),
        name: recipeJson.Name,
        description: recipeJson.Description,
        method: {
            id: recipeJson.Method.Id,
            steps: recipeJson.Method.Steps
        },
        categories: parseCategories(recipeJson.Categories),
        ingredients: parseIngredients(recipeJson.Ingredients)
    };
}

function parseCategories(categoriesJson: any[]): Array<Category> {
    return categoriesJson.map<Category>(category => ({
        id: Number.parseInt(category.Id),
        name: category.Name
    }));
}

function parseIngredients(ingredientsJson: any[]): Array<IngredientWithQuantity> {
    return ingredientsJson.map<IngredientWithQuantity>(ingredient => ({
        ingredient: {
            id: ingredient.Ingredient.Id,
            name: ingredient.Ingredient.Name
        },
        quantity: {
            amount: Number.parseFloat(ingredient.Quantity.Amount),
            unit: ingredient.Quantity.Unit
        }
    }));
}

export function recipeToJson(recipe: Recipe) {
    return JSON.stringify(recipe)
}