module AddRecipe

open Model

let addRecipe (recipe: Recipe) =
    RecipeDomain.addRecipe recipe;