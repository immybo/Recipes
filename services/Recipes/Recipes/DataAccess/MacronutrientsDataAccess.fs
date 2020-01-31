namespace DataAccess

open FSharp.Data.Sql
open Model
open System.Collections.Generic
open System.Linq

module MacronutrientsDataAccess =
    let mapToMacronutrientInformation (macronutrientEntity: Database.sql.dataContext.``dbo.MacronutrientsEntity``) : MacronutrientInformation =
        {
            CaloriesPerKilo = macronutrientEntity.CaloriesPerKilo
            ProteinMassPercentage = macronutrientEntity.ProteinMassPercentage
            CarbMassPercentage = macronutrientEntity.CarbMassPercentage
            FatMassPercentage = macronutrientEntity.FatMassPercentage
        }

    let deleteMacronutrientsForIngredient ingredientId =
        query {
            for macronutrients in Database.context.Dbo.Macronutrients do
            where (macronutrients.IngredientId = ingredientId)
            select macronutrients
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        |> ignore
        Database.context.SubmitUpdates();
        
    let setMacronutrientsForIngredient ingredientId macronutrientEntity =
        deleteMacronutrientsForIngredient ingredientId

        let macronutrients = Database.context.Dbo.Macronutrients.Create();
        macronutrients.IngredientId <- ingredientId;
        macronutrients.CaloriesPerKilo <- macronutrientEntity.CaloriesPerKilo;
        macronutrients.ProteinMassPercentage <- macronutrientEntity.ProteinMassPercentage;
        macronutrients.FatMassPercentage <- macronutrientEntity.FatMassPercentage;
        macronutrients.CarbMassPercentage <- macronutrientEntity.CarbMassPercentage;
        Database.context.SubmitUpdates();

    let getMacronutrientsForIngredient (ingredientId: int) =
        query {
            for macronutrients in Database.context.Dbo.Macronutrients do
            where (macronutrients.IngredientId = ingredientId)
            select macronutrients
        }
        |> Seq.toArray
        |> function results ->
            match results.Length with
            | 0 -> Result.Error NoNutritionalInformationForIngredient
            | 1 ->
                mapToMacronutrientInformation results.[0]
                |> Result.Ok
            | _ -> Result.Error ExpectedExactlyOne