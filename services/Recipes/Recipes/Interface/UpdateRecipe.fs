module UpdateRecipe

open Model
open Railway
open DataAccess

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

let updateRecipeUnchecked (recipe: Recipe) : Result<int, Error> =
    GetRecipe.getRecipe (recipe.Id)
    |> function result ->
        match result with
        | Result.Error err -> Result.Error err
        | Result.Ok _ -> (
            RecipeDataAccess.updatePartialRecipe recipe
            CategoryDataAccess.updateCategoriesForRecipe recipe
            IngredientDataAccess.updateIngredientsForRecipe recipe
            MethodDataAccess.updateMethod recipe.Method
            Result.Ok recipe.Id
        )

let updateRecipe recipe : Result<int, Error> =
    validateUpdateRecipe recipe
    >=> updateRecipeUnchecked