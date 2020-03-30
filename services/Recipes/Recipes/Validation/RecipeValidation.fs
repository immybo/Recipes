namespace Validation

open Model
open Railway

module RecipeValidation =
    let validatePartialRecipe (recipe: Recipe): Result<Recipe, Error> =
        match recipe.Description with
        | null -> Result.Error Error.RecipeMustHaveDescription
        | _ -> Result.Ok recipe

    let validateIngredients (recipe: Recipe): Result<Recipe, Error> =
        Result.Ok recipe // TODO

    let validateRecipe recipe: Result<Recipe, Error> =
        validatePartialRecipe recipe
        >=> validateIngredients
