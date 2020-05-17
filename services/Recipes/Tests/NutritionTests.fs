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
                        GetNutritionalInformationForIngredients.getNutritionalInformationForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
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
                        AddNutritionalInformationForIngredient.addNutritionalInformationForIngredient ({TestUtils.TestNutritionalInformation with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id })
                        |> fun result ->
                            match result with
                            | Result.Error err -> Assert.False(true, err.ToString())
                            | Result.Ok _ -> 
                                GetNutritionalInformationForIngredients.getNutritionalInformationForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
                                |> fun result ->
                                    match result with
                                    | Result.Error err -> Assert.False(true, err.ToString())
                                    | Result.Ok nutritionalInfos ->
                                        Assert.AreEqual(({
                                            TestUtils.TestNutritionalInformation with
                                                IngredientId = readRecipe.Ingredients.[0].Ingredient.Id;
                                                Density = {
                                                    EquivalentByVolume = {
                                                        Amount = 1M;
                                                        Unit = QuantityUnit.Cups;
                                                    };
                                                    EquivalentByWeight = {
                                                        Amount = 10M;
                                                        Unit = QuantityUnit.Grams;
                                                    };
                                                }
                                        }), nutritionalInfos.[0])
                                        AddNutritionalInformationForIngredient.addNutritionalInformationForIngredient({
                                            TestUtils.TestNutritionalInformation2 with
                                                IngredientId = readRecipe.Ingredients.[0].Ingredient.Id;
                                        })
                                        |> fun result ->
                                            match result with
                                            | Result.Error err -> Assert.False(true, err.ToString())
                                            | Result.Ok _ -> 
                                                GetNutritionalInformationForIngredients.getNutritionalInformationForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
                                                |> fun result ->
                                                    match result with
                                                    | Result.Error err -> Assert.False(true, err.ToString())
                                                    | Result.Ok nutritionalInfos -> Assert.AreEqual(({
                                                        TestUtils.TestNutritionalInformation2 with
                                                            IngredientId = readRecipe.Ingredients.[0].Ingredient.Id;
                                                            Density = {
                                                                EquivalentByVolume = {
                                                                    Amount = 1M;
                                                                    Unit = QuantityUnit.Cups;
                                                                };
                                                                EquivalentByWeight = {
                                                                    Amount = 10M;
                                                                    Unit = QuantityUnit.Grams;
                                                                };
                                                            }
                                                    }), nutritionalInfos.[0])

    [<Test>]
    let TestNutritionalInformationForRecipeIsCalculatedCorrectly () =
        let expectedNutritionResult = {
            Calories = 1000m;
            ProteinGrams = 40m;
            CarbGrams = 30m;
            FatGrams = 30m;
        }

        let nutritionResult =
            AddRecipe.addRecipe TestUtils.TestRecipe
            >=> GetRecipe.getRecipe
            >=> fun readRecipe ->
                    AddNutritionalInformationForIngredient.addNutritionalInformationForIngredient ({TestUtils.TestNutritionalInformation with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id }) |> ignore
                    Result.Ok readRecipe.Id
            >=> GetNutritionalInformationForRecipe.getNutritionalInformationForRecipe
        match nutritionResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok nutrition ->
            Assert.AreEqual (float expectedNutritionResult.Calories, float nutrition.Calories, 0.01)
            Assert.AreEqual (float expectedNutritionResult.ProteinGrams, float nutrition.ProteinGrams, 0.01)
            Assert.AreEqual (float expectedNutritionResult.CarbGrams, float nutrition.CarbGrams, 0.01)
            Assert.AreEqual (float expectedNutritionResult.FatGrams, float nutrition.FatGrams, 0.01)