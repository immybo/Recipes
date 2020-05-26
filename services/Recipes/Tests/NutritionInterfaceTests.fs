namespace Tests

open NUnit.Framework
open Model
open Railway
open Interface
open System.Linq

module NutritionInterfaceTests =
    [<Test>]
    let Nutritional_Information_For_Recipe_Is_Added_And_Retrieved_Correctly () =
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
    
    [<Test>]
    let Nutritional_Information_For_Ingredient_Is_Added_And_Retrieved_Correctly () =
        let expectedNutritionResult = {
            Calories = 1000m;
            ProteinGrams = 40m;
            CarbGrams = 30m;
            FatGrams = 30m;
        }

        let addIngredientResult = Ingredients.add TestUtils.TestIngredient

        match addIngredientResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok ingredientId ->
            Nutrition.addForIngredient ({TestUtils.TestNutritionalInformation with IngredientId = ingredientId }) |> ignore
            
            match Nutrition.getForIngredients [ingredientId] with
            | Result.Error err -> Assert.Fail (err.ToString())
            | Result.Ok nutritions ->
                Assert.AreEqual (1, nutritions.Length)

                let nutrition = nutritions.Single().MacronutrientsPerServing
                Assert.AreEqual (float expectedNutritionResult.Calories, float nutrition.Calories, 0.01)
                Assert.AreEqual (float expectedNutritionResult.ProteinGrams, float nutrition.ProteinGrams, 0.01)
                Assert.AreEqual (float expectedNutritionResult.CarbGrams, float nutrition.CarbGrams, 0.01)
                Assert.AreEqual (float expectedNutritionResult.FatGrams, float nutrition.FatGrams, 0.01)