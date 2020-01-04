module UpdateRecipe

open Model

let updateRecipe recipe : Result<int, Error> =
    RecipeDomain.updateRecipe recipe