namespace Tests

open NUnit.Framework
open Model

module NutritionTests =
    [<SetUp>]
    let Setup () =
        ()

    [<Test>]
    let AddRecipeAndCheckThatItHasNoNutritionalInformation () =
        AddRecipe.addRecipe TestUtils.TestRecipe
        |> function result ->
            match result with
            | Result.Error err -> Assert.False(true, err.ToString())
            | Result.Ok recipeId -> 
                GetRecipe.getRecipe recipeId
                |> fun readRecipe ->
                    match readRecipe with
                    | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                    | Result.Ok readRecipe ->
                        NutritionalInformationDomain.getNutritionalInformationForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
                        |> fun result ->
                            match result with
                            | Result.Error err -> Assert.False(true, err.ToString())
                            | Result.Ok nutritionalInfos -> Assert.IsEmpty(nutritionalInfos, "There should be no nutritional information for a newly created ingredient.")
                        

    [<Test>]
    let AddRecipeAndNutritionalInformationForIngredientsAndMakeSureWeCanRetrieveItThenUpdateItAndEnsureThatItChanges () =
        AddRecipe.addRecipe TestUtils.TestRecipe
        |> function result ->
            match result with
            | Result.Error err -> Assert.False(true, err.ToString())
            | Result.Ok recipeId -> 
                GetRecipe.getRecipe recipeId
                |> fun readRecipe ->
                    match readRecipe with
                    | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                    | Result.Ok readRecipe ->
                        NutritionalInformationDomain.setNutritionalInformationForIngredient ({TestUtils.TestNutritionalInformation with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id })
                        |> fun result ->
                            match result with
                            | Result.Error err -> Assert.False(true, err.ToString())
                            | Result.Ok _ -> 
                                NutritionalInformationDomain.getNutritionalInformationForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
                                |> fun result ->
                                    match result with
                                    | Result.Error err -> Assert.False(true, err.ToString())
                                    | Result.Ok nutritionalInfos ->
                                        Assert.AreEqual(nutritionalInfos.[0], {TestUtils.TestNutritionalInformation with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id })
                                        NutritionalInformationDomain.setNutritionalInformationForIngredient ({TestUtils.TestNutritionalInformation2 with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id })
                                        |> fun result ->
                                            match result with
                                            | Result.Error err -> Assert.False(true, err.ToString())
                                            | Result.Ok _ -> 
                                                NutritionalInformationDomain.getNutritionalInformationForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
                                                |> fun result ->
                                                    match result with
                                                    | Result.Error err -> Assert.False(true, err.ToString())
                                                    | Result.Ok nutritionalInfos -> Assert.AreEqual(nutritionalInfos.[0], {TestUtils.TestNutritionalInformation2 with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id })