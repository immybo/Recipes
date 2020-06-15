namespace Validation

open Model
open Railway

// TODO
module RecipeValidation =
    let validatePartialRecipe (recipe: Recipe): Result<Recipe, Error> =
        Result.Ok recipe

    let validateIngredients (recipe: Recipe): Result<Recipe, Error> =
        Result.Ok recipe

    let validateRecipe recipe: Result<Recipe, Error> =
        validatePartialRecipe recipe
        >=> validateIngredients
