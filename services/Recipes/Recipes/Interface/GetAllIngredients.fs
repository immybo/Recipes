module GetAllIngredients

open Model
open DataAccess

let getAllIngredients () : Result<Ingredient[], Error> =
    IngredientDataAccess.getAllIngredients ()
    |> Result.Ok 