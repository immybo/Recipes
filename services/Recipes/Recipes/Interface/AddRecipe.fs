module AddRecipe

open Model
open Railway
open Validation

let addRecipe (recipe: Recipe) =
    RecipeValidation.validateRecipe recipe
    >=> RecipeDomain.addRecipe