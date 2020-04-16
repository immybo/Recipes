namespace Tests

open NUnit.Framework
open Model
open Railway

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

    [<Test>]
    let TestNutritionalInformationForRecipeIsCalculatedCorrectly () =
        let expectedNutritionResult = {
            CaloriesPerServing = 1000m * 0.822666667m;
            ProteinGramsPerServing = 40m * 0.822666667m;
            CarbGramsPerServing = 30m * 0.822666667m;
            FatGramsPerServing = 30m * 0.822666667m;
            ServingSize = {
                Amount = 0m;
                Unit = QuantityUnit.None;
            };
        }

        let nutritionResult =
            AddRecipe.addRecipe TestUtils.TestRecipe
            >=> GetRecipe.getRecipe
            >=> fun readRecipe ->
                    NutritionalInformationDomain.setNutritionalInformationForIngredient ({TestUtils.TestNutritionalInformation with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id }) |> ignore
                    Result.Ok readRecipe.Id
            >=> RecipeNutritionDomain.getNutritionalInformationForRecipe
        match nutritionResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok nutrition ->
            Assert.AreEqual (float expectedNutritionResult.CaloriesPerServing, float nutrition.CaloriesPerServing, 0.01)
            Assert.AreEqual (float expectedNutritionResult.ProteinGramsPerServing, float nutrition.ProteinGramsPerServing, 0.01)
            Assert.AreEqual (float expectedNutritionResult.CarbGramsPerServing, float nutrition.CarbGramsPerServing, 0.01)
            Assert.AreEqual (float expectedNutritionResult.FatGramsPerServing, float nutrition.FatGramsPerServing, 0.01)