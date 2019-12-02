namespace DataAccess

open Model.Recipe
open FSharp.Data.Sql

module RecipeDataAccess =

    let mapToRecipe (recipeEntity: Database.sql.dataContext.``dbo.RecipesEntity``) : Recipe = 
        {
            Name = recipeEntity.Name;
            Description = recipeEntity.Description;
            Ingredients = "";
            Categories = ""
        }

    let getRecipeById (id: int) : Option<Recipe> = 
        query {
            for recipe in Database.context.Dbo.Recipes do
            where (recipe.Id = id)
            select recipe
        }
        |> Seq.toArray
        |> Seq.tryExactlyOne
        |> function recipe ->
                        match recipe with
                            | None -> None
                            | Some recipe -> Some (mapToRecipe recipe)
