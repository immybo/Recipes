﻿module GetRecipeImpl

open Model

let getRecipe id : Result<Recipe, Error> =
    RecipeDomain.getRecipeById id