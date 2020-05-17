module AddIngredient

open Model
open DataAccess

let addIngredient (ingredient: Ingredient) : Result<int, Error> =
    IngredientDataAccess.addIngredient ingredient
    |> Result.Ok