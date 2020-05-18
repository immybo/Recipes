namespace Tests

open NUnit.Framework
open Model
open Railway
open Interface

module NutritionTests =
    [<SetUp>]
    let Setup () =
        ()

    [<Test>]
    let AddRecipeAndCheckThatItHasNoNutritionalInformation () =
        Recipes.add TestUtils.TestRecipe
        |> function result ->
            match result with
            | Result.Error err -> Assert.False(true, err.ToString())
            | Result.Ok recipeId -> 
                Recipes.get recipeId
                |> fun readRecipe ->
                    match readRecipe with
                    | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                    | Result.Ok readRecipe ->
                        Nutrition.getForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
                        |> fun result ->
                            match result with
                            | Result.Error err -> Assert.False(true, err.ToString())
                            | Result.Ok nutritionalInfos -> Assert.IsEmpty(nutritionalInfos, "There should be no nutritional information for a newly created ingredient.")
                        

    [<Test>]
    let AddRecipeAndNutritionalInformationForIngredientsAndMakeSureWeCanRetrieveItThenUpdateItAndEnsureThatItChanges () =
        Recipes.add TestUtils.TestRecipe
        |> function result ->
            match result with
            | Result.Error err -> Assert.False(true, err.ToString())
            | Result.Ok recipeId -> 
                Recipes.get recipeId
                |> fun readRecipe ->
                    match readRecipe with
                    | Result.Error Error.RecipeDoesNotExist -> Assert.False(true)
                    | Result.Ok readRecipe ->
                        Nutrition.addForIngredient ({TestUtils.TestNutritionalInformation with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id })
                        |> fun result ->
                            match result with
                            | Result.Error err -> Assert.False(true, err.ToString())
                            | Result.Ok _ -> 
                                Nutrition.getForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
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
                                        Nutrition.addForIngredient({
                                            TestUtils.TestNutritionalInformation2 with
                                                IngredientId = readRecipe.Ingredients.[0].Ingredient.Id;
                                        })
                                        |> fun result ->
                                            match result with
                                            | Result.Error err -> Assert.False(true, err.ToString())
                                            | Result.Ok _ -> 
                                                Nutrition.getForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
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
            Calories = 1000m * 0.822666667m;
            ProteinGrams = 40m * 0.822666667m;
            CarbGrams = 30m * 0.822666667m;
            FatGrams = 30m * 0.822666667m;
        }

        let nutritionResult =
            Recipes.add TestUtils.TestRecipe
            >=> Recipes.get
            >=> fun readRecipe ->
                    Nutrition.addForIngredient ({TestUtils.TestNutritionalInformation with IngredientId = readRecipe.Ingredients.[0].Ingredient.Id }) |> ignore
                    Result.Ok readRecipe.Id
            >=> Nutrition.getForRecipe
        match nutritionResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok nutrition ->
            Assert.AreEqual (float expectedNutritionResult.Calories, float nutrition.Calories, 0.01)
            Assert.AreEqual (float expectedNutritionResult.ProteinGrams, float nutrition.ProteinGrams, 0.01)
            Assert.AreEqual (float expectedNutritionResult.CarbGrams, float nutrition.CarbGrams, 0.01)
            Assert.AreEqual (float expectedNutritionResult.FatGrams, float nutrition.FatGrams, 0.01)