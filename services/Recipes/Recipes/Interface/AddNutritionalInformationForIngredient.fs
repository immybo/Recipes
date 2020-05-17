module AddNutritionalInformationForIngredient

open Model
open DataAccess

let addNutritionalInformationForIngredient nutritionalInformation : Result<int, Error> =
    IngredientDataAccess.getIngredient nutritionalInformation.IngredientId
    |> function result ->
        match result with
        | Result.Error err -> Result.Error err
        | Result.Ok _ ->
            let macronutrientsId = MacronutrientsDataAccess.addMacronutrients nutritionalInformation.MacronutrientsPerServing
            match NutritionalInformationDomain.toGramsPerCup nutritionalInformation.Density with
            | Result.Error err -> Result.Error err
            | Result.Ok gramsPerCup ->
                IngredientNutritionDataAccess.addNutritionMappingForIngredient nutritionalInformation macronutrientsId gramsPerCup
                |> Result.Ok