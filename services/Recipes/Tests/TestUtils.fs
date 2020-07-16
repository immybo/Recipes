namespace Tests

open Model
open NUnit.Framework
open Interface

module TestUtils =
    let (>=>) currentValue nextFunc =
        match currentValue with
        | Result.Ok result -> nextFunc result
        | Result.Error error ->
            error.ToString ()
            |> Assert.Fail
            Result.Error error
    
    let (>>>) currentValue nextFunc: Result<'b, 'ErrorType> =
        match currentValue with
        | Result.Ok result -> nextFunc result |> Result.Ok
        | Result.Error error -> Result.Error error
            
    let (>|) currentValue nextFunc: unit =
        match currentValue with
        | Result.Ok result ->
            nextFunc result
        | Result.Error error -> ()

        ()

    let TestIngredient: Ingredient =
        {
            Id = -1;
            Name = "test ingredient 1234";
        }

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
                Quantity = {
                    Unit = QuantityUnit.Teaspoons;
                    Amount = 1234m;
                }
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
        };
        NumberOfServings = 1
    }

    let TestNutritionalInformation: IngredientNutrition = {
        IngredientId = -1;
        Density = {
            EquivalentByVolume = {
                Amount = 10m
                Unit = QuantityUnit.Cups
            }
            EquivalentByWeight = {
                Amount = 1m
                Unit = QuantityUnit.Grams
            }
        }
        ServingSize = {
            Amount = 30m
            Unit = QuantityUnit.Cups
        }
        MacronutrientsPerServing = {
            Calories = 1000m;
            ProteinGrams = 40m;
            CarbGrams = 30m;
            FatGrams = 30m;
        }
    }

    
    let TestNutritionalInformation2: IngredientNutrition = {
        IngredientId = -1;
        Density = {
            EquivalentByVolume = {
                Amount = 10m
                Unit = QuantityUnit.Cups
            }
            EquivalentByWeight = {
                Amount = 1m
                Unit = QuantityUnit.Grams
            }
        }
        ServingSize = {
            Amount = 30m
            Unit = QuantityUnit.Cups
        }
        MacronutrientsPerServing = {
            Calories = 2000m;
            ProteinGrams = 50m;
            CarbGrams = 20m;
            FatGrams = 25m;
        }
    }

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

    let addRecipe : int =
        let addRecipeResult = Recipes.add TestRecipe

        match addRecipeResult with
        | Result.Error err ->
            Assert.Fail (err.ToString())
            -1
        | Result.Ok recipeId -> recipeId