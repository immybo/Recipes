namespace DataAccess

open FSharp.Data.Sql
open Model

module IngredientDataAccess =
    let mapToIngredientWithQuantity (name: string, quantity: int) : IngredientWithQuantity = 
        {
            Ingredient = {
                Name = name
            }
            Quantity = quantity
        }
        
    let getIngredientsForRecipe (recipeId: int) : IngredientWithQuantity[] = 
        query {
            for ingredientMapping in Database.context.Dbo.RecipesToIngredients do
            join ingredient in Database.context.Dbo.Ingredients
                on (ingredientMapping.IngredientId = ingredient.Id)
            where (ingredientMapping.RecipeId = recipeId)
            select (ingredient.Name, ingredientMapping.Quantity)
        }
        |> Seq.map mapToIngredientWithQuantity
        |> Seq.toArray
        
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
        ingredientMapping.Quantity <- quantity;
        Database.context.SubmitUpdates();

    let writeIngredientsForRecipe recipe recipeId : int =
        for ingredient in recipe.Ingredients do
            addIngredient ingredient.Ingredient
            |> addIngredientMapping recipeId ingredient.Quantity
        recipeId