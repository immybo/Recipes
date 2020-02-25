module UpdateRecipe

open Model
open Railway

let hasMethodId recipe : Result<Recipe, Error> =
    match recipe.Method.Id > 0 with
    | true -> Result.Ok recipe
    | false -> Result.Error Error.RequiredParameter

let hasMethodSteps recipe : Result<Recipe, Error> =
    match recipe.Method.Steps.Length with
    | 0 -> Result.Error Error.MethodMustNotBeEmpty
    | _ -> Result.Ok recipe

let validateUpdateRecipe recipe : Result<Recipe, Error> =
    hasMethodId recipe
    >=> hasMethodSteps

let updateRecipe recipe : Result<int, Error> =
    validateUpdateRecipe recipe
    >=> RecipeDomain.updateRecipe