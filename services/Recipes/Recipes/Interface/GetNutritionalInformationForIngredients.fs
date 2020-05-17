module GetNutritionalInformationForIngredients

open Model
open System.Collections.Generic
open DataAccess

let getNutritionalInformationForIngredients (ingredientIds: IEnumerable<int>) : Result<IngredientNutrition[], Error> =
    let nutritionalInformation = new List<IngredientNutrition>();

    for ingredientId in ingredientIds do
        IngredientNutritionDataAccess.getNutritionForIngredient(ingredientId)
        |> function result ->
            match result with
            // Hmm maybe we should do something here
            // Error if there's a single problem, or should we return a Result<NutritionalInformation, Error>[]?
            | Result.Error err -> ()
            | Result.Ok nutrition ->
                nutritionalInformation.Add(nutrition)
                |> ignore

    Result.Ok (nutritionalInformation.ToArray())