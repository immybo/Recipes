import { Quantity } from "./Quantity";

export interface Ingredient {
    name: string,
    quantity: Quantity
}

export function getBlankIngredient() {
    return { name: "", quantity: { quantity: 0 } };
}