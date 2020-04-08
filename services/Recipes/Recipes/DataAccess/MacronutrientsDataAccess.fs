namespace DataAccess

open FSharp.Data
open Model

module MacronutrientsDataAccess =
    type DeleteMacronutrientsForIngredientCommand = SqlCommandProvider<"
        DELETE FROM dbo.Macronutrients
        WHERE IngredientId = @ingredientId
        ", Database.compileTimeConnectionString>

    type AddMacronutrientsForIngredientCommand = SqlCommandProvider<"
        INSERT INTO dbo.Macronutrients (IngredientId, CaloriesPerServing, ProteinGramsPerServing, FatGramsPerServing, CarbGramsPerServing, Quantity, QuantityUnit)
        VALUES (@ingredientId, @caloriesPerServing, @proteinGramsPerServing, @fatGramsPerServing, @carbGramsPerServing, @quantity, @quantityUnit)
        ", Database.compileTimeConnectionString>

    type GetMacronutrientsForIngredientQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.Macronutrients
        WHERE IngredientId = @ingredientId
        ", Database.compileTimeConnectionString>

    let mapToMacronutrientInformation (macronutrientEntity: GetMacronutrientsForIngredientQuery.Record) : MacronutrientInformation =
        {
            CaloriesPerServing = macronutrientEntity.caloriesPerServing
            ProteinGramsPerServing = macronutrientEntity.proteinGramsPerServing
            CarbGramsPerServing = macronutrientEntity.carbGramsPerServing
            FatGramsPerServing = macronutrientEntity.fatGramsPerServing
            ServingSize = {
                Amount = macronutrientEntity.quantity
                Unit = enum<QuantityUnit> macronutrientEntity.quantityUnit
            }
        }

    let deleteMacronutrientsForIngredient ingredientId =
        let command = new DeleteMacronutrientsForIngredientCommand(Database.realConnectionString)
        command.Execute ingredientId
        
    let setMacronutrientsForIngredient ingredientId macronutrientEntity =
        deleteMacronutrientsForIngredient ingredientId |> ignore

        let command = new AddMacronutrientsForIngredientCommand(Database.realConnectionString)
        command.Execute (ingredientId, macronutrientEntity.CaloriesPerServing, macronutrientEntity.ProteinGramsPerServing, macronutrientEntity.FatGramsPerServing, macronutrientEntity.CarbGramsPerServing, macronutrientEntity.ServingSize.Amount, (int)macronutrientEntity.ServingSize.Unit)

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