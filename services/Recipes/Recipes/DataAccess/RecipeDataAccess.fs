namespace DataAccess

open FSharp.Data.Sql
open Model
open System.Collections.Generic

module RecipeDataAccess =
    let mapToRecipe (recipeEntity: Database.sql.dataContext.``dbo.RecipesEntity``) : Recipe = 
        {
            Id = recipeEntity.Id;
            Name = recipeEntity.Name;
            Description = recipeEntity.Description;
            Ingredients = Array.empty<IngredientWithQuantity>;
            Categories = Array.empty<Category>;
            Method = {
                Id = -1;
                Steps = Array.empty<string>;
            }
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

    let writePartialRecipe recipe methodId : int =
        let row = Database.context.Dbo.Recipes.Create();
        row.Description <- recipe.Description;
        row.Name <- recipe.Name;
        row.MethodId <- methodId;
        Database.context.SubmitUpdates();
        row.Id;

    let getAllRecipeIds : int[] =
        query {
            for recipe in Database.context.Dbo.Recipes do
            select recipe.Id
        }
        |> Seq.toArray

    let updatePartialRecipe updatedRecipe =
        let recipe = (query {
            for recipe in Database.context.Dbo.Recipes do
            where (recipe.Id = updatedRecipe.Id)
            select recipe
        }
        |> Seq.toArray
        |> Seq.exactlyOne)

        recipe.Description <- updatedRecipe.Description;
        recipe.Name <- updatedRecipe.Name;
        recipe.MethodId <- updatedRecipe.Method.Id;

        Database.context.SubmitUpdates();

    let deletePartialRecipe recipeId =
        query {
            for recipe in Database.context.Dbo.Recipes do
            where (recipe.Id = recipeId)
            select recipe
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        |> ignore
        Database.context.SubmitUpdates();