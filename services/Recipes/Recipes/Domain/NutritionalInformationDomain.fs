module NutritionalInformationDomain

open Model
open DataAccess
open System.Collections.Generic

let getNutritionalInformationForIngredients (ingredientIds: IEnumerable<int>) : Result<NutritionalInformation[], Error> =
    let nutritionalInformation = new List<NutritionalInformation>();

    for ingredientId in ingredientIds do
        MacronutrientsDataAccess.getMacronutrientsForIngredient ingredientId
        |> function result ->
            match result with
            // Hmm maybe we should do something here
            // Error if there's a single problem, or should we return a Result<NutritionalInformation, Error>[]?
            | Result.Error err -> ()
            | Result.Ok macronutrients ->
                nutritionalInformation.Add { IngredientId = ingredientId; Macronutrients = macronutrients }
                |> ignore

    Result.Ok (nutritionalInformation.ToArray())

let setNutritionalInformationForIngredient nutritionalInformation =
    IngredientDataAccess.getIngredient nutritionalInformation.IngredientId
    |> function result ->
        match result with
        | Result.Error err -> Result.Error err
        | Result.Ok _ ->
            MacronutrientsDataAccess.setMacronutrientsForIngredient nutritionalInformation.IngredientId nutritionalInformation.Macronutrients
            |> Result.Ok
    