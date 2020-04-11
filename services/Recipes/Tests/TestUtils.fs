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
            CaloriesPerServing = 1000m;
            ProteinGramsPerServing = 40m;
            CarbGramsPerServing = 30m;
            FatGramsPerServing = 30m;
            ServingSize = {
                Amount = 30m;
                Unit = QuantityUnit.Cups;
            };
        }
    }
    
    let TestNutritionalInformation2: NutritionalInformation = {
        IngredientId = -1;
        Macronutrients = {
            CaloriesPerServing = 2000m;
            ProteinGramsPerServing = 50m;
            CarbGramsPerServing = 20m;
            FatGramsPerServing = 25m;
            ServingSize = {
                Amount = 30m;
                Unit = QuantityUnit.Cups;
            };
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