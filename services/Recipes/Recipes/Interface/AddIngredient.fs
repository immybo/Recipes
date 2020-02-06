module AddIngredient

open Model

let addIngredient (ingredient: Ingredient) =
    RecipeDomain.addIngredient ingredient