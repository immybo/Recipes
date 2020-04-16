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

let multiplyNutrition macronutrientInformation factor =
    Result.Ok {
        CaloriesPerServing = macronutrientInformation.CaloriesPerServing * factor;
        CarbGramsPerServing = macronutrientInformation.CarbGramsPerServing * factor;
        ProteinGramsPerServing = macronutrientInformation.ProteinGramsPerServing * factor;
        FatGramsPerServing = macronutrientInformation.FatGramsPerServing * factor;
        // TODO should serving size really be part of macronutrients?
        ServingSize = {
            Amount = macronutrientInformation.ServingSize.Amount * factor;
            Unit = macronutrientInformation.ServingSize.Unit;
        };
    }

let sumNutrition nutritionList =
    // We don't sum the serving size here; we leave that out... indicating as above that serving size shouldn't be part of macronutrients; these shouldn't be per serving TODO
    // so it should be a nutritionalinformation = calories,carbs,protein,fat, and an extra object above to link that to a serving size for use in a recipe or an ingredient
    let folder = fun nutrition next ->
        {
            CaloriesPerServing = nutrition.CaloriesPerServing + next.CaloriesPerServing;
            CarbGramsPerServing = nutrition.CarbGramsPerServing + next.CarbGramsPerServing;
            FatGramsPerServing = nutrition.FatGramsPerServing + next.FatGramsPerServing;
            ProteinGramsPerServing = nutrition.ProteinGramsPerServing + next.ProteinGramsPerServing;
            ServingSize = {
                Amount = nutrition.ServingSize.Amount;
                Unit = nutrition.ServingSize.Unit;
            };
        }

    Seq.fold folder ({
        CaloriesPerServing = 0m;
        CarbGramsPerServing = 0m;
        FatGramsPerServing = 0m;
        ProteinGramsPerServing = 0m;
        ServingSize = {
            Amount = 0m;
            Unit = QuantityUnit.None;
        };
    }) nutritionList
    |> Result.Ok