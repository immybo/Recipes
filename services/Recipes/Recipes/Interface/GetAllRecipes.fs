module GetAllRecipes

open Model
open DataAccess

let getAllRecipes () : Result<Recipe[], Error> =
    RecipeDataAccess.getAllRecipeIds ()
    |> Array.map(function recipeId -> GetRecipe.getRecipe recipeId)
    // Remove any that weren't read correctly; might want to handle individual error types here
    // - TODO this behaviour is only correct on RecipeDoesNotExist
    |> Array.choose(function result -> 
        match result with
        | Result.Ok recipe -> Some recipe
        | Result.Error err -> None)
    |> Result.Ok