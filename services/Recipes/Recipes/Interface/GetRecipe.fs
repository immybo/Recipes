module GetRecipe

open Model

let getRecipe id : Result<Recipe, Error> =
    GetRecipeImpl.getRecipe id