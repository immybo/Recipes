namespace DataAccess

open FSharp.Data.Sql
open Model

module IngredientDataAccess =
    let mapToIngredient (ingredientEntity: Database.sql.dataContext.``dbo.IngredientsEntity``) : Ingredient = 
        {
            Name = ingredientEntity.Name;
        }
        
    let getIngredientsForRecipe (recipeId: int) : Ingredient[] = 
        query {
            for ingredientMapping in Database.context.Dbo.RecipesToIngredients do
            join ingredient in Database.context.Dbo.Ingredients
                on (ingredientMapping.IngredientId = ingredient.Id)
            where (ingredientMapping.RecipeId = recipeId)
            select ingredient
        }
        |> Seq.map mapToIngredient
        |> Seq.toArray
        
    // TODO not good functional style
    let addIngredient (ingredient: Ingredient) : int =
        let ingredientRow = Database.context.Dbo.Ingredients.Create();
        ingredientRow.Name <- ingredient.Name;
        Database.context.SubmitUpdates();
        ingredientRow.Id

    let addIngredientMapping recipeId ingredientId =
        let ingredientMapping = Database.sql.GetDataContext().Dbo.RecipesToIngredients.Create();
        ingredientMapping.IngredientId <- ingredientId;
        ingredientMapping.RecipeId <- recipeId;
        Database.context.SubmitUpdates();

    let writeIngredientsForRecipe recipe recipeId : int =
        for ingredient in recipe.Ingredients do
            addIngredient ingredient
            |> addIngredientMapping recipeId
        recipeId