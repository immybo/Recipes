module Tests

open NUnit.Framework
open Model

let TestRecipe: Recipe = {
    Name = "test recipe";
    Description = "hello world";
    Ingredients = List.toArray [
        {
            Ingredient = {
                Name = "test ingredient 1234";
            }
            Quantity = 1234
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

[<SetUp>]
let Setup () =
    ()

[<Test>]
let AddRecipeAndCheckThatItExistsAndIsEqual () =
    AddRecipe.addRecipe TestRecipe
    |> function result ->
        match result with
        | Result.Error err -> Assert.False(true, err.ToString())
        | Result.Ok recipeId -> 
            GetRecipe.getRecipe recipeId
            |> fun readRecipe -> match readRecipe with
                | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                | Result.Ok readRecipe -> Assert.AreEqual(TestRecipe, readRecipe);