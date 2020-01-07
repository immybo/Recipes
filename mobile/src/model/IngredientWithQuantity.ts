import { Ingredient } from "./Ingredient";

export interface IngredientWithQuantity {
    ingredient: Ingredient
    quantity: number
}

export function getBlankIngredient(): IngredientWithQuantity {
    return { ingredient: { id: -1, name: "" }, quantity: 0 };
}