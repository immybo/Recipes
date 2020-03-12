namespace DataAccess

open FSharp.Data
open Model

module MacronutrientsDataAccess =
    type DeleteMacronutrientsForIngredientCommand = SqlCommandProvider<"
        DELETE FROM dbo.Macronutrients
        WHERE IngredientId = @ingredientId
        ", Database.compileTimeConnectionString>

    type AddMacronutrientsForIngredientCommand = SqlCommandProvider<"
        INSERT INTO dbo.Macronutrients (IngredientId, CaloriesPerKilo, ProteinMassPercentage, FatMassPercentage, CarbMassPercentage)
        VALUES (@ingredientId, @caloriesPerKilo, @proteinMassPercentage, @fatMassPercentage, @carbMassPercentage)
        ", Database.compileTimeConnectionString>

    type GetMacronutrientsForIngredientQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.Macronutrients
        WHERE IngredientId = @ingredientId
        ", Database.compileTimeConnectionString>

    let mapToMacronutrientInformation (macronutrientEntity: GetMacronutrientsForIngredientQuery.Record) : MacronutrientInformation =
        {
            CaloriesPerKilo = macronutrientEntity.caloriesPerKilo
            ProteinMassPercentage = macronutrientEntity.proteinMassPercentage
            CarbMassPercentage = macronutrientEntity.carbMassPercentage
            FatMassPercentage = macronutrientEntity.fatMassPercentage
        }

    let deleteMacronutrientsForIngredient ingredientId =
        let command = new DeleteMacronutrientsForIngredientCommand(Database.realConnectionString)
        command.Execute ingredientId
        
    let setMacronutrientsForIngredient ingredientId macronutrientEntity =
        deleteMacronutrientsForIngredient ingredientId |> ignore

        let command = new AddMacronutrientsForIngredientCommand(Database.realConnectionString)
        command.Execute (ingredientId, macronutrientEntity.CaloriesPerKilo, macronutrientEntity.ProteinMassPercentage, macronutrientEntity.FatMassPercentage, macronutrientEntity.CarbMassPercentage)

    let getMacronutrientsForIngredient (ingredientId: int) =
        let query = new GetMacronutrientsForIngredientQuery(Database.realConnectionString)
        query.Execute(ingredientId)
        |> Seq.toArray
        |> function results ->
            match results.Length with
            | 0 -> Result.Error Error.NoNutritionalInformationForIngredient
            | 1 ->
                mapToMacronutrientInformation results.[0]
                |> Result.Ok
            | _ -> Result.Error Error.ExpectedExactlyOne