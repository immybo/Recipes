import { Ingredient } from "./Ingredient";
import { Quantity } from "./Quantity";
import { QuantityUnit } from "./QuantityUnit";

export interface IngredientWithQuantity {
    ingredient: Ingredient
    quantity: Quantity
}

export function getBlankIngredientWithQuantity(): IngredientWithQuantity {
    return { ingredient: { id: -1, name: "" }, quantity: { amount: 0, unit: QuantityUnit.Kilograms }};
}