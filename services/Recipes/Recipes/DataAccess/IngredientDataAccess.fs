namespace DataAccess

open FSharp.Data.Sql
open Model

module IngredientDataAccess =
    let mapToIngredient (ingredientEntity: Database.sql.dataContext.``dbo.IngredientsEntity``) : Ingredient = 
        {
            Id = ingredientEntity.Id;
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
    let addIngredient (recipeId: int, ingredient: Ingredient) =
        let ingredientRow = Database.context.Dbo.Ingredients.Create();
        ingredientRow.Id <- ingredient.Id;
        ingredientRow.Name <- ingredient.Name;

        let ingredientMapping = Database.sql.GetDataContext().Dbo.RecipesToIngredients.Create();
        ingredientMapping.IngredientId <- ingredient.Id;
        ingredientMapping.RecipeId <- recipeId;

    let writeIngredientsForRecipe (recipe: Recipe) =
        for ingredient in recipe.Ingredients do
            addIngredient(recipe.Id, ingredient)
        Database.context.SubmitUpdates();