namespace Tests

open TestUtils
open NUnit.Framework
open Model
open Interface

module RecipeInterfaceTests = 
    [<SetUp>]
    let Setup () =
        ()

    [<Test>]
    let AddRecipeAndCheckThatItExistsAndIsEqual () =
        Recipes.add TestUtils.TestRecipe
        >=> Recipes.get
        >| TestUtils.recipesAreEqualExceptForIds TestUtils.TestRecipe
        
    let GetUpdatedRecipe recipe =
        { recipe with
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
            };
        }

    [<Test>]
    let AddAndThenUpdateRecipeAndCheckThatItUpdatedCorrectly () =
        let initialRecipeResult =
            Recipes.add TestUtils.TestRecipe
            >=> Recipes.get

        match initialRecipeResult with
        | Result.Ok initialRecipe ->
            GetUpdatedRecipe initialRecipe           
            |> Recipes.update
            >=> Recipes.get
            >| TestUtils.recipesAreEqualExceptForIds (GetUpdatedRecipe initialRecipe)
        | Result.Error _ -> ()

    [<Test>]
    let AddAndDeleteRecipeAndCheckThatItNoLongerExists () =
        Recipes.add TestUtils.TestRecipe
        >=> Recipes.delete
        >=> Recipes.get
        |> function
            | Result.Error Error.RecipeDoesNotExist -> ()
            | Result.Error err -> Assert.False(true, "Invalid error raised: " + err.ToString())
            | Result.Ok _ -> Assert.False(true, "Recipe was not deleted...")
    
    [<Test>]
    let AddRecipeAndCheckThatItHasNoNutritionalInformation () =
        Recipes.add TestUtils.TestRecipe
        >=> Recipes.get
        >=> function readRecipe -> Nutrition.getForIngredients([readRecipe.Ingredients.[0].Ingredient.Id])
        >| function nutritionalInfos -> Assert.IsEmpty(nutritionalInfos, "There should be no nutritional information for a newly created ingredient.")