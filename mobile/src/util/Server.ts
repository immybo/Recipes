import { Recipe } from "../model/Recipe";
import { number } from "prop-types";

export function getRecipes(): Promise<Array<Recipe>> {
    return callApi("recipes/0")
        .then(
            json => {console.log("TEST:" + JSON.stringify(json)); return parseRecipes(json)}
        );
}

function parseRecipes(json: any): Array<Recipe> {
    // TODO error handling on the json to make it clear when we're
    // recieving invalid data
    // TODO Get multiple recipes
    // TODO handle multiple categories/ingredients
    return [{
        id: Number.parseInt(json.Id),
        name: json.Fields[0].Name,
        description: json.Fields[0].Description,
        // todo get this from DB
        method: {
            steps: [
                "hello"
            ]
        },
        categories: [{
            id: Number.parseInt(json.Fields[0].Categories[0].Id),
            name: json.Fields[0].Categories[0].Name
        }],
        ingredients: [{
            // TODO needs an ID
            quantity: {
                // todo get this from DB
                quantity: 5
            },
            name: json.Fields[0].Ingredients[0].Name
        }]
    }];
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