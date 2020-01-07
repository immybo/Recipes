import { Recipe } from "../model/Recipe";
import { Category } from "../model/Category";
import { IngredientWithQuantity } from "../model/IngredientWithQuantity";

// TODO automatic mapping, syncronization between both models maybe. But is that too coupled?

export function parseRecipes(json: any): Array<Recipe> {
    // TODO error handling on the json to make it clear when we're
    // recieving invalid data
    // TODO Maybe some shared config file and automatic mapping
    return json.Fields[0].map((recipeJson: any) => parseRecipe(recipeJson));
}

function parseRecipe(recipeJson: any): Recipe {
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
        quantity: Number.parseFloat(ingredient.Quantity)
    }));
}

export function recipeToJson(recipe: Recipe) {
    return JSON.stringify(recipe)
}