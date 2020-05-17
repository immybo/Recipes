namespace DataAccess

open FSharp.Data
open Model

module IngredientNutritionDataAccess =
    type DeleteIngredientNutritionCommand = SqlCommandProvider<"
        DELETE FROM dbo.IngredientNutrition
        WHERE IngredientId = @ingredientId
        ", Database.compileTimeConnectionString>

    type AddIngredientNutritionCommand = SqlCommandProvider<"
        INSERT INTO dbo.IngredientNutrition (ingredientId, gramsPerCup, macronutrientsId, servingSizeQuantity, servingSizeUnit)
        VALUES (@ingredientId, @gramsPerCup, @macronutrientsId, @servingSizeQuantity, @servingSizeUnit)
        ", Database.compileTimeConnectionString>

    type GetIngredientNutritionCommand = SqlCommandProvider<"
        SELECT *
        FROM dbo.vwNutritionForIngredient
        WHERE IngredientId = @ingredientId
        ", Database.compileTimeConnectionString>

    let mapToIngredientNutrition (ingredientNutritionViewEntity: GetIngredientNutritionCommand.Record) : IngredientNutrition =
        {
            IngredientId = ingredientNutritionViewEntity.ingredientId
            Density = {
                EquivalentByVolume = {
                    Amount = 1m
                    Unit = QuantityUnit.Cups
                }
                EquivalentByWeight = {
                    Amount = decimal(ingredientNutritionViewEntity.gramsPerCup)
                    Unit = QuantityUnit.Grams
                }
            }
            ServingSize = {
                Amount = ingredientNutritionViewEntity.servingSizeQuantity
                Unit = enum<QuantityUnit>(ingredientNutritionViewEntity.servingSizeUnit)
            }
            MacronutrientsPerServing = {
                Calories = ingredientNutritionViewEntity.calories
                ProteinGrams = ingredientNutritionViewEntity.proteinGrams
                FatGrams = ingredientNutritionViewEntity.fatGrams
                CarbGrams = ingredientNutritionViewEntity.carbGrams
            }
        }

    let deleteIngredientNutritionEntry ingredientId =
        let command = new DeleteIngredientNutritionCommand(Database.realConnectionString)
        command.Execute ingredientId
        
    let addNutritionMappingForIngredient ingredientNutrition macronutrientsId gramsPerCup =
        deleteIngredientNutritionEntry ingredientNutrition.IngredientId |> ignore

        let command = new AddIngredientNutritionCommand(Database.realConnectionString)
        command.Execute (ingredientNutrition.IngredientId, gramsPerCup, macronutrientsId, ingredientNutrition.ServingSize.Amount, int(ingredientNutrition.ServingSize.Unit))

    let getNutritionForIngredient (ingredientId: int) =
        let query = new GetIngredientNutritionCommand(Database.realConnectionString)
        query.Execute(ingredientId)
        |> Seq.toArray
        |> function results ->
            match results.Length with
            | 0 -> Result.Error Error.NoNutritionalInformationForIngredient
            | 1 ->
                mapToIngredientNutrition results.[0]
                |> Result.Ok
            | _ -> Result.Error Error.ExpectedExactlyOne