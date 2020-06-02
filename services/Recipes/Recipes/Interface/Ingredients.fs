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

    let delete (ingredientId: int) : Result<unit, Error> =
        let anyRecipeUsesIngredient: bool = IngredientDataAccess.anyRecipeContainsIngredient ingredientId
        match anyRecipeUsesIngredient with
        | true -> Result.Error Error.IngredientIsUsedByARecipe
        | false ->
            IngredientNutritionDataAccess.deleteIngredientNutritionEntry ingredientId |> ignore
            IngredientDataAccess.deleteIngredient ingredientId |> ignore
            Result.Ok ()

    let update (newIngredient: Ingredient) : Result<unit, Error> =
        IngredientDataAccess.updateIngredient newIngredient |> ignore
        Result.Ok ()