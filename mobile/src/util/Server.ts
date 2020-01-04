import { Recipe } from "../model/Recipe";
import { Category } from "../model/Category";
import { Ingredient } from "../model/Ingredient";

export function getRecipes(): Promise<Array<Recipe>> {
    return callApi("recipes")
        .then(
            json => parseRecipes(json)
        );
}

function parseRecipes(json: any): Array<Recipe> {
    // TODO error handling on the json to make it clear when we're
    // recieving invalid data
    // TODO Get multiple recipes
    // TODO handle multiple categories/ingredients
    // TODO figure out types with this json; does it have to be any? Maybe some shared config file and automatic mapping
    return json.Fields[0].map((recipeJson: any) => parseRecipe(recipeJson));
}

function parseRecipe(recipeJson: any): Recipe {
    return {
        id: Number.parseInt(recipeJson.Id),
        name: recipeJson.Name,
        description: recipeJson.Description,
        method: {
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

function parseIngredients(ingredientsJson: any[]): Array<Ingredient> {
    return ingredientsJson.map<Ingredient>(ingredient => ({
        name: ingredient.Ingredient.Name,
        quantity: {
            quantity: Number.parseFloat(ingredient.Quantity)
        }
    }));
}

function callApi(endpoint: string, payload?: object) {
    return fetch("http://10.0.2.2:52354/"+endpoint, { method: "GET" })
        .then(
            response => {return response.json()},
            error => handleError(error)
        );
}

function handleError(error: any): void { 
    console.log("ERROR: " + error.toString())
}