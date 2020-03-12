namespace DataAccess

open FSharp.Data
open Model
open System.Linq

module IngredientDataAccess =
    type UpdateIngredientCommand = SqlCommandProvider<"
        UPDATE dbo.Ingredients
        SET Name = @name
        WHERE Id = @id
        ", Database.compileTimeConnectionString>
        
    type GetIngredientQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.Ingredients
        WHERE Id = @id
        ", Database.compileTimeConnectionString>

    type GetIngredientsForRecipeQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.RecipesToIngredients
        INNER JOIN dbo.Ingredients ON RecipesToIngredients.IngredientId = Ingredients.Id
        WHERE RecipeId = @recipeId
        ", Database.compileTimeConnectionString>
        
    type AddIngredientCommand = SqlCommandProvider<"
        INSERT INTO dbo.Ingredients (Name)
        OUTPUT INSERTED.Id
        VALUES (@name)
        ", Database.compileTimeConnectionString>
    
    type GetAllIngredientsQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.Ingredients
        ", Database.compileTimeConnectionString>
    
    type DeleteIngredientMappingsForRecipeCommand = SqlCommandProvider<"
        DELETE FROM dbo.RecipesToIngredients
        WHERE RecipeId = @recipeId
        ", Database.compileTimeConnectionString>
    
    type AddIngredientMappingCommand = SqlCommandProvider<"
        INSERT INTO dbo.RecipesToIngredients (IngredientId, RecipeId, Quantity, QuantityUnit)
        VALUES (@ingredientId, @recipeId, @quantity, @quantityUnit)
        ", Database.compileTimeConnectionString>

    let mapToIngredient (ingredientEntity: GetIngredientQuery.Record) : Ingredient =
        {
            Id = ingredientEntity.id
            Name = ingredientEntity.name
        }

    // TODO can we find some way to define these as 1?
    let mapToIngredient2 (ingredientEntity: GetAllIngredientsQuery.Record) : Ingredient =
        {
            Id = ingredientEntity.id
            Name = ingredientEntity.name
        }

    let mapToIngredientWithQuantity (entity: GetIngredientsForRecipeQuery.Record) : IngredientWithQuantity = 
        {
            Ingredient = {
                Id = entity.id
                Name = entity.name
            }
            Quantity = {
                Unit = enum<QuantityUnit> entity.quantityUnit
                Amount = entity.quantity
            }
        }
        
    let updateIngredient (updatedIngredient: Ingredient) : int =
        let command = new UpdateIngredientCommand(Database.realConnectionString)
        command.Execute (updatedIngredient.Name, updatedIngredient.Id) |> ignore
        updatedIngredient.Id

    let getIngredient (ingredientId: int): Result<Ingredient, Error> =
        let query = new GetIngredientQuery(Database.realConnectionString)
        query.Execute ingredientId
        |> Seq.toArray
        |> function results ->
            match results.Length with
            | 0 -> Result.Error Error.IngredientDoesNotExist
            | 1 ->
                mapToIngredient results.[0]
                |> Result.Ok
            | _ -> Result.Error Error.ExpectedExactlyOne
        
    let getIngredientsForRecipe (recipeId: int) : IngredientWithQuantity[] = 
        let query = new GetIngredientsForRecipeQuery(Database.realConnectionString)
        query.Execute recipeId
        |> Seq.map mapToIngredientWithQuantity
        |> Seq.toArray

    let getAllIngredients =
        let query = new GetAllIngredientsQuery(Database.realConnectionString)
        query.Execute ()
        |> Seq.map mapToIngredient2
        |> Seq.toArray

    let deleteIngredientMappingsForRecipe (recipeId: int) =
        let command = new DeleteIngredientMappingsForRecipeCommand(Database.realConnectionString)
        command.Execute recipeId
        
    let addIngredient (ingredient: Ingredient) : int =
        let command = new AddIngredientCommand(Database.realConnectionString)
        command.Execute ingredient.Name
        |> fun x -> x.Single()

    let addIngredientMapping recipeId quantity ingredientId =
        let command = new AddIngredientMappingCommand(Database.realConnectionString)
        command.Execute (ingredientId, recipeId, quantity.Amount, (int)quantity.Unit)

    let writeIngredientsForRecipe recipe recipeId : int =
        for ingredient in recipe.Ingredients do
            addIngredient ingredient.Ingredient
            |> addIngredientMapping recipeId ingredient.Quantity
            |> ignore
        recipeId

    let updateIngredientsForRecipe recipe =
        deleteIngredientMappingsForRecipe recipe.Id |> ignore

        for ingredient in recipe.Ingredients do
            getIngredient ingredient.Ingredient.Id
            |> function result ->
                match result with
                | Result.Error IngredientDoesNotExist -> addIngredient ingredient.Ingredient
                | _ -> updateIngredient ingredient.Ingredient
            |> addIngredientMapping recipe.Id ingredient.Quantity
            |> ignore