namespace Interface

open Model
open DataAccess

module Ingredients =
    let add (ingredient: Ingredient) : Result<int, Error> =
        IngredientDataAccess.addIngredient ingredient
        |> Result.Ok

    let getAll () : Result<Ingredient[], Error> =
        IngredientDataAccess.getAllIngredients ()
        |> Result.Ok 