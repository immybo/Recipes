namespace DataAccess

open FSharp.Data.Sql
open Model

module RecipeDataAccess =
    let mapToRecipe (recipeEntity: Database.sql.dataContext.``dbo.RecipesEntity``) : Recipe = 
        {
            Id = recipeEntity.Id;
            Name = recipeEntity.Name;
            Description = recipeEntity.Description;
            Ingredients = Array.empty<Ingredient>;
            Categories = Array.empty<Category>;
        }

    let getPartialRecipeById (id: int) : Result<Recipe, Error> = 
        query {
            for recipe in Database.context.Dbo.Recipes do
            where (recipe.Id = id)
            select recipe
        }
        |> Seq.toArray
        |> Seq.tryExactlyOne
        |> function recipe -> match recipe with
            | None -> Result.Error Error.RecipeDoesNotExist
            | Some recipe -> Result.Ok (mapToRecipe recipe)