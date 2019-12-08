module Tests

open NUnit.Framework
open Model

[<SetUp>]
let Setup () =
    ()

[<Test>]
let Test1 () =
    let recipe: Recipe = {
        Id = 1;
        Name = "test recipe";
        Description = "hello world";
        Ingredients = List.toArray [
            {
                Id = 1;
                Name = "test ingredient 1234";
            }
        ];
        Categories = List.toArray [
            {
                Id = 1;
                Name = "test category 54";
            }
        ];
        Method = {
            MethodId = 1;
            Steps = List.toArray [
                "Make the food";
                "Serve the food";
            ]
        }
    }
    AddRecipe.addRecipe recipe
    
    GetRecipe.getRecipe recipe.Id
    |> fun readRecipe -> match readRecipe with
        | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
        | Result.Ok readRecipe -> Assert.AreEqual(recipe.Name, readRecipe.Name);