module Tests

open NUnit.Framework
open Model

let TestRecipe: Recipe = {
    Id = -1;
    Name = "test recipe";
    Description = "hello world";
    Ingredients = List.toArray [
        {
            Ingredient = {
                Id = -1;
                Name = "test ingredient 1234";
            }
            Quantity = 1234
        }
    ];
    Categories = List.toArray [
        {
            Id = -1;
            Name = "test category 54";
        }
    ];
    Method = {
        Id = -1;
        Steps = List.toArray [
            "Make the food";
            "Serve the food";
        ];
    }
}

// TODO is there a cleaner way to do this?
let recipesAreEqualExceptForIds (r1: Recipe) (r2: Recipe) =
    Assert.AreEqual(r1.Name, r2.Name);
    Assert.AreEqual(r1.Description, r2.Description);

    let ingredientPairs = Array.zip r1.Ingredients r2.Ingredients;
    for (i1, i2) in ingredientPairs do
        Assert.AreEqual(i1.Quantity, i2.Quantity);
        Assert.AreEqual(i1.Ingredient.Name, i2.Ingredient.Name);

    let categoryPairs = Array.zip r1.Categories r2.Categories;
    for (c1, c2) in categoryPairs do
        Assert.AreEqual(c1.Name, c2.Name);

    Assert.AreEqual(r1.Method.Steps, r2.Method.Steps);


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
            |> fun readRecipe ->
                match readRecipe with
                | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                | Result.Ok readRecipe -> recipesAreEqualExceptForIds TestRecipe readRecipe

[<Test>]
let AddAndThenUpdateRecipeAndCheckThatItUpdatedCorrectly () =
    AddRecipe.addRecipe TestRecipe
    |> function result ->
        match result with
        | Result.Error err -> Assert.False(true, err.ToString())
        | Result.Ok recipeId ->
            RecipeDomain.getRecipeById recipeId
            |> function result -> 
                match result with
                | Result.Error err -> Assert.False(true, err.ToString())
                | Result.Ok recipe -> (
                    let updatedRecipe = { recipe with
                        Name = "hello test 123";
                        Ingredients = List.toArray [
                            { recipe.Ingredients.[0] with Quantity = 4567; Ingredient = { recipe.Ingredients.[0].Ingredient with Name = "updated ingredient 1" } }
                            {
                                Ingredient = {
                                    Id = -1;
                                    Name = "test ingredient 9876";
                                }
                                Quantity = 1234
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
                                | Result.Ok readRecipe -> recipesAreEqualExceptForIds updatedRecipe readRecipe
                )

[<Test>]
let AddAndDeleteRecipeAndCheckThatItNoLongerExists () =
    AddRecipe.addRecipe TestRecipe
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