namespace Interface

open Model
open System.Collections.Generic
open DataAccess

module Nutrition =
    let addForIngredient nutritionalInformation : Result<int, Error> =
        IngredientDataAccess.getIngredient nutritionalInformation.IngredientId
        |> function result ->
            match result with
            | Result.Error err -> Result.Error err
            | Result.Ok _ ->
                let macronutrientsId = MacronutrientsDataAccess.addMacronutrients nutritionalInformation.MacronutrientsPerServing
                match NutritionalInformationDomain.toGramsPerCup nutritionalInformation.Density with
                | Result.Error err -> Result.Error err
                | Result.Ok gramsPerCup ->
                    IngredientNutritionDataAccess.addNutritionMappingForIngredient nutritionalInformation macronutrientsId gramsPerCup
                    |> Result.Ok

    let getForIngredients (ingredientIds: IEnumerable<int>) : Result<IngredientNutrition[], Error> =
        let nutritionalInformation = new List<IngredientNutrition>();
    
        for ingredientId in ingredientIds do
            IngredientNutritionDataAccess.getNutritionForIngredient(ingredientId)
            |> function result ->
                match result with
                // Hmm maybe we should do something here
                // Error if there's a single problem, or should we return a Result<NutritionalInformation, Error>[]?
                | Result.Error err -> ()
                | Result.Ok nutrition ->
                    nutritionalInformation.Add(nutrition)
                    |> ignore
    
        Result.Ok (nutritionalInformation.ToArray())

    let getForRecipe recipeId : Result<MacronutrientInformation, Error> =
        let ingredientNutrition =
            Recipes.get recipeId
            |> function result -> 
                match result with
                | Result.Error err -> Result.Error err
                | Result.Ok recipe ->
                    Array.map (function (ingredient: IngredientWithQuantity) -> ingredient.Ingredient.Id) recipe.Ingredients
                    |> getForIngredients
        match ingredientNutrition with
        | Result.Error err -> Result.Error err
        | Result.Ok nutritions -> Seq.map (fun x -> x.MacronutrientsPerServing) nutritions |> NutritionalInformationDomain.sumNutrition