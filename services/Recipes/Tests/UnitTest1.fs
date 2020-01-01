module Tests

open NUnit.Framework
open Model

[<SetUp>]
let Setup () =
    ()

[<Test>]
let Test1 () =
    let recipe: Recipe = {
        Name = "test recipe";
        Description = "hello world";
        Ingredients = List.toArray [
            {
                Name = "test ingredient 1234";
            }
        ];
        Categories = List.toArray [
            {
                Name = "test category 54";
            }
        ];
        Method = {
            Steps = List.toArray [
                "Make the food";
                "Serve the food";
            ]
        }
    }
    
    AddRecipe.addRecipe recipe
    |> function result ->
        match result with
        | Result.Error err -> Assert.False(true, err.ToString())
        | Result.Ok recipeId -> 
            GetRecipe.getRecipe recipeId
            |> fun readRecipe -> match readRecipe with
                | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                | Result.Ok readRecipe -> Assert.AreEqual(recipe.Name, readRecipe.Name);