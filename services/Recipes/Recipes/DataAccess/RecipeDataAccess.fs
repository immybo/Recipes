namespace DataAccess

open Model.Recipe
open FSharp.Data.Sql

type sql = SqlDataProvider<
            Common.DatabaseProviderTypes.MSSQLSERVER,
            "Server=(LocalDb)\MSSQLLocalDB;Database=Recipes;Trusted_Connection=True;">

module RecipeDataAccess =
    let context = sql.GetDataContext()

    let getRecipeById id : Recipe = 
        query {
            for recipe in context.Dbo.Recipes do
            where (recipe.Id == id)
            select (recipe.Name, recipe.Description)
        }
        //match id = 0 with
        //| true -> { Recipe.Name = "testRecipe1"; Description = "hello"; Ingredients = "hello"; Categories = "hello"}
        //| false -> { Recipe.Name = "testRecipe2"; Description = "hello"; Ingredients = "hello"; Categories = "hello"}
