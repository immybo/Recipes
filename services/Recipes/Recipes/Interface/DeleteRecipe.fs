module DeleteRecipe

open Model

let deleteRecipe recipeId : Result<int, Error> =
    RecipeDomain.deleteRecipe recipeId