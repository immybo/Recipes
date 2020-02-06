namespace DataAccess

open FSharp.Data.Sql
open Model

module IngredientDataAccess =
    let mapToIngredient (ingredientEntity: Database.sql.dataContext.``dbo.IngredientsEntity``) : Ingredient =
        {
            Id = ingredientEntity.Id
            Name = ingredientEntity.Name
        }

    let mapToIngredientWithQuantity (id: int, name: string, quantityUnit: int, quantity: decimal) : IngredientWithQuantity = 
        {
            Ingredient = {
                Id = id
                Name = name
            }
            Quantity = {
                Unit = enum<QuantityUnit> quantityUnit
                Amount = quantity
            }
        }
        
    let updateIngredient (updatedIngredient: Ingredient) : int =
        let ingredient = (query {
            for ingredient in Database.context.Dbo.Ingredients do
            where (ingredient.Id = updatedIngredient.Id)
            select ingredient
        }
        |> Seq.toArray
        |> Seq.exactlyOne)
        
        ingredient.Name <- updatedIngredient.Name;
        Database.context.SubmitUpdates();
        ingredient.Id;

    let getIngredient (ingredientId: int): Result<Ingredient, Error> =
        query {
            for ingredient in Database.context.Dbo.Ingredients do
            where (ingredient.Id = ingredientId)
            select ingredient
        }
        |> Seq.toArray
        |> function results ->
            match results.Length with
            | 0 -> Result.Error IngredientDoesNotExist
            | 1 ->
                mapToIngredient results.[0]
                |> Result.Ok
            | _ -> Result.Error ExpectedExactlyOne
        
    let getIngredientsForRecipe (recipeId: int) : IngredientWithQuantity[] = 
        query {
            for ingredientMapping in Database.context.Dbo.RecipesToIngredients do
            join ingredient in Database.context.Dbo.Ingredients
                on (ingredientMapping.IngredientId = ingredient.Id)
            where (ingredientMapping.RecipeId = recipeId)
            select (ingredient.Id, ingredient.Name, ingredientMapping.QuantityUnit, ingredientMapping.Quantity)
        }
        |> Seq.map mapToIngredientWithQuantity
        |> Seq.toArray

    let getAllIngredients =
        // TODO what if there are too many recipes? Maybe we need pagination here
        query {
            for ingredient in Database.context.Dbo.Ingredients do
            select ingredient
        }
        |> Seq.map mapToIngredient
        |> Seq.toArray

    let deleteIngredientMappingsForRecipe (recipeId: int) =
        query {
            for ingredientMapping in Database.context.Dbo.RecipesToIngredients do
            where (ingredientMapping.RecipeId = recipeId)
            select ingredientMapping
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        |> ignore
        Database.context.SubmitUpdates();
        
    // TODO not good functional style
    let addIngredient (ingredient: Ingredient) : int =
        let ingredientRow = Database.context.Dbo.Ingredients.Create();
        ingredientRow.Name <- ingredient.Name;
        Database.context.SubmitUpdates();
        ingredientRow.Id

    let addIngredientMapping recipeId quantity ingredientId =
        let ingredientMapping = Database.context.Dbo.RecipesToIngredients.Create();
        ingredientMapping.IngredientId <- ingredientId;
        ingredientMapping.RecipeId <- recipeId;
        ingredientMapping.Quantity <- quantity.Amount;
        ingredientMapping.QuantityUnit <- int quantity.Unit;
        Database.context.SubmitUpdates();

    let writeIngredientsForRecipe recipe recipeId : int =
        for ingredient in recipe.Ingredients do
            addIngredient ingredient.Ingredient
            |> addIngredientMapping recipeId ingredient.Quantity
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