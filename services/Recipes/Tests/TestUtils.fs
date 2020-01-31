namespace Tests

open Model
open NUnit.Framework

module TestUtils =
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
        }
    }

    let TestNutritionalInformation: NutritionalInformation = {
        IngredientId = -1;
        Macronutrients = {
            CaloriesPerKilo = 1000m;
            ProteinMassPercentage = 40m;
            CarbMassPercentage = 30m;
            FatMassPercentage = 30m;
        }
    }
    
    let TestNutritionalInformation2: NutritionalInformation = {
        IngredientId = -1;
        Macronutrients = {
            CaloriesPerKilo = 2000m;
            ProteinMassPercentage = 50m;
            CarbMassPercentage = 20m;
            FatMassPercentage = 25m;
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