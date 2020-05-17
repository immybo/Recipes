namespace Tests

open NUnit.Framework
open Model

module RecipeTests = 
    [<SetUp>]
    let Setup () =
        ()

    [<Test>]
    let AddRecipeAndCheckThatItExistsAndIsEqual () =
        AddRecipe.addRecipe TestUtils.TestRecipe
        |> function result ->
            match result with
            | Result.Error err -> Assert.False(true, err.ToString())
            | Result.Ok recipeId -> 
                GetRecipe.getRecipe recipeId
                |> fun readRecipe ->
                    match readRecipe with
                    | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                    | Result.Ok readRecipe -> TestUtils.recipesAreEqualExceptForIds TestUtils.TestRecipe readRecipe

    [<Test>]
    let AddAndThenUpdateRecipeAndCheckThatItUpdatedCorrectly () =
        AddRecipe.addRecipe TestUtils.TestRecipe
        |> function result ->
            match result with
            | Result.Error err -> Assert.False(true, err.ToString())
            | Result.Ok recipeId ->
                GetRecipe.getRecipe recipeId
                |> function result -> 
                    match result with
                    | Result.Error err -> Assert.False(true, err.ToString())
                    | Result.Ok recipe -> (
                        let updatedRecipe = { recipe with
                            Name = "hello test 123";
                            Ingredients = List.toArray [
                                { recipe.Ingredients.[0] with Quantity = { Unit = QuantityUnit.Cups; Amount = 4567m }; Ingredient = { recipe.Ingredients.[0].Ingredient with Name = "updated ingredient 1" } }
                                {
                                    Ingredient = {
                                        Id = -1;
                                        Name = "test ingredient 9876";
                                    }
                                    Quantity = {
                                        Unit = QuantityUnit.Kilograms;
                                        Amount = 0.001m;
                                    }
                                };
                            ];
                            Categories = List.toArray [
                                {
                                    Id = -1;
                                    Name = "test category 97";
                                }
                            ];
                            Method = {
                                Id = recipe.Method.Id;
                                Steps = List.toArray [
                                    "Make the food 2";
                                    "Serve the food 2";
                                    "Add an extra step";
                                ];
                            }
                        }
                        UpdateRecipe.updateRecipe updatedRecipe
                        |> function result ->
                            match result with
                            | Result.Error err -> Assert.False(true, err.ToString());
                            | Result.Ok recipeId ->
                                GetRecipe.getRecipe recipeId
                                |> fun readRecipe ->
                                    match readRecipe with
                                    | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                                    | Result.Ok readRecipe -> TestUtils.recipesAreEqualExceptForIds updatedRecipe readRecipe
                    )

    [<Test>]
    let AddAndDeleteRecipeAndCheckThatItNoLongerExists () =
        AddRecipe.addRecipe TestUtils.TestRecipe
        |> function
            | Result.Error err -> Assert.False(true, err.ToString());
            | Result.Ok recipeId ->
                DeleteRecipe.deleteRecipe recipeId
                |> function
                    | Result.Error err -> Assert.False(true, err.ToString())
                    | Result.Ok recipeId ->
                        GetRecipe.getRecipe recipeId
                        |> function
                            | Result.Error Error.RecipeDoesNotExist -> ()
                            | Result.Error err -> Assert.False(true, "Invalid error raised: " + err.ToString())
                            | Result.Ok recipeId -> Assert.False(true, "Recipe was not deleted...")