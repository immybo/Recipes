namespace DataAccess

open FSharp.Data
open Model
open System.Linq

module MacronutrientsDataAccess =
    type GetMacronutrientsByIdQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.Macronutrients
        WHERE Id = @id
        ", Database.compileTimeConnectionString>

    type AddMacronutrientsCommand = SqlCommandProvider<"
        INSERT INTO dbo.Macronutrients (calories, proteinGrams, carbGrams, fatGrams)
        OUTPUT INSERTED.id
        VALUES (@calories, @proteinGrams, @carbGrams, @fatGrams)
        ", Database.compileTimeConnectionString>

    type DeleteMacronutrientsCommand = SqlCommandProvider<"
        DELETE FROM dbo.Macronutrients
        WHERE id = @id
        ", Database.compileTimeConnectionString>

    let mapToMacronutrientInformation (macronutrientEntity: GetMacronutrientsByIdQuery.Record) : MacronutrientInformation =
        {
            Calories = macronutrientEntity.calories
            ProteinGrams = macronutrientEntity.proteinGrams
            CarbGrams = macronutrientEntity.carbGrams
            FatGrams = macronutrientEntity.fatGrams
        }

    let getMacronutrientsById macronutrientsId =
        let query = new GetMacronutrientsByIdQuery(Database.realConnectionString)
        query.Execute(macronutrientsId)

    let deleteMacronutrientsById macronutrientsId =
        let command = new DeleteMacronutrientsCommand(Database.realConnectionString)
        command.Execute(macronutrientsId)

    let addMacronutrients macronutrients =
        let command = new AddMacronutrientsCommand(Database.realConnectionString)
        command.Execute(macronutrients.Calories, macronutrients.ProteinGrams, macronutrients.CarbGrams, macronutrients.FatGrams).Single()
    
    type UpdateMacronutrientsCommand = SqlCommandProvider<"
        UPDATE dbo.Macronutrients
        SET calories = @calories, proteinGrams = @proteinGrams, carbGrams = @carbGrams, fatGrams = @fatGrams
        WHERE id = @id
        ", Database.compileTimeConnectionString>
    
    let updateMacronutrients macronutrientsId  macronutrients =
        let command = new UpdateMacronutrientsCommand(Database.realConnectionString)
        command.Execute(macronutrients.Calories, macronutrients.ProteinGrams, macronutrients.CarbGrams, macronutrients.FatGrams, macronutrientsId) |> ignore