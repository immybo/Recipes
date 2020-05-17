module AddRecipe

open Model
open Railway
open Validation
open DataAccess

let setMethodId recipe methodId =
    { recipe with Method = { recipe.Method with Id = methodId }}

let addRecipeUnchecked (recipe: Recipe) : Result<int, Error> =
    MethodDataAccess.addMethod recipe.Method
    |> setMethodId recipe
    |> RecipeDataAccess.writePartialRecipe
    |> CategoryDataAccess.writeCategoriesForRecipe
    |> IngredientDataAccess.writeIngredientsForRecipe
    |> fun recipe -> recipe.Id
    |> Result.Ok

let addRecipe (recipe: Recipe) =
    RecipeValidation.validateRecipe recipe
    >=> addRecipeUnchecked