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