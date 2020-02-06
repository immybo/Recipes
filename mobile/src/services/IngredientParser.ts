import { Ingredient } from "../model/Ingredient";

export function parseIngredients(ingredientsJson: any): Array<Ingredient> {
    return ingredientsJson.Fields[0].map((ingredientJson: any) => parseIngredient(ingredientJson));
}

export function parseIngredient(ingredientJson: any): Ingredient {
    return {
        id: ingredientJson.Id,
        name: ingredientJson.Name
    };
}

export function ingredientToJson(ingredient: Ingredient) {
    return JSON.stringify(ingredient)
}