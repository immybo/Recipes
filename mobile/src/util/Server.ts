import { Recipe } from "../model/Recipe";
import CategoryReducer from "../reducers/CategoryReducer";
import { Category } from "../model/Category";
import { Ingredient } from "../model/Ingredient";

export function getRecipes(): Promise<Array<Recipe>> {
    return callApi("recipes/4")
        .then(
            json => {console.log("TEST:" + JSON.stringify(json)); return parseRecipes(json)}
        );
}

function parseRecipes(json: any): Array<Recipe> {
    // TODO error handling on the json to make it clear when we're
    // recieving invalid data
    // TODO Get multiple recipes
    // TODO handle multiple categories/ingredients
    // TODO figure out types with this json; does it have to be any? Maybe some shared config file and automatic mapping
    return [{
        id: Number.parseInt(json.Id),
        name: json.Fields[0].Name,
        description: json.Fields[0].Description,
        method: {
            steps: json.Fields[0].Method.Steps
        },
        categories: parseCategories(json.Fields[0].Categories),
        ingredients: parseIngredients(json.Fields[0].Ingredients)
    }];
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