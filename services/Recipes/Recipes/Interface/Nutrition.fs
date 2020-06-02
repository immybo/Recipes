namespace Interface

open Model
open System.Collections.Generic
open DataAccess
open Railway
open RecipeNutritionDomain

module Nutrition =
    let addForIngredient nutritionalInformation : Result<int, Error> =
        IngredientDataAccess.getIngredient nutritionalInformation.IngredientId
        |> function result ->
            match result with
            | Result.Error err -> Result.Error err
            | Result.Ok _ ->
                let macronutrientsId = MacronutrientsDataAccess.addMacronutrients nutritionalInformation.MacronutrientsPerServing
                match QuantityDomain.toGramsPerCup nutritionalInformation.Density with
                | Result.Error err -> Result.Error err
                | Result.Ok gramsPerCup ->
                    IngredientNutritionDataAccess.addOrUpdateNutritionMappingForIngredient nutritionalInformation macronutrientsId gramsPerCup
                    |> Result.Ok
    
    let updateForIngredient nutritionalInformation : Result<int, Error> =
        IngredientDataAccess.getIngredient nutritionalInformation.IngredientId
        |> function result ->
            match result with
            | Result.Error err -> Result.Error err
            | Result.Ok _ ->
                match IngredientNutritionDataAccess.getNutritionIdForIngredient nutritionalInformation.IngredientId with
                | Result.Ok macronutrientId ->
                    MacronutrientsDataAccess.updateMacronutrients macronutrientId nutritionalInformation.MacronutrientsPerServing
                    match QuantityDomain.toGramsPerCup nutritionalInformation.Density with
                    | Result.Error err -> Result.Error err
                    | Result.Ok gramsPerCup ->
                        IngredientNutritionDataAccess.addOrUpdateNutritionMappingForIngredient nutritionalInformation macronutrientId gramsPerCup
                        |> Result.Ok
                | Result.Error Error.NoNutritionalInformationForIngredient -> addForIngredient nutritionalInformation
                | Result.Error err -> Result.Error err

    let getForIngredients (ingredientIds: IEnumerable<int>) : Result<IngredientNutrition[], Error> =
        let nutritionalInformation = new List<IngredientNutrition>();
    
        for ingredientId in ingredientIds do
            IngredientNutritionDataAccess.getNutritionForIngredient(ingredientId)
            |> function result ->
                match result with
                // If we can't find the nutritional information, we treat it as having no nutrition
                | Result.Error err -> ()
                | Result.Ok nutrition ->
                    nutritionalInformation.Add(nutrition)
                    |> ignore
    
        Result.Ok (nutritionalInformation.ToArray())

    let addNutrition (ingredient: IngredientWithQuantity) : Result<IngredientWithQuantityAndNutrition, Error> =
        IngredientNutritionDataAccess.getNutritionForIngredient ingredient.Ingredient.Id
        >=> fun nutrition -> Result.Ok { Ingredient = ingredient; Nutrition = nutrition }

    let getForRecipe recipeId : Result<MacronutrientInformation, Error> =
        Recipes.get recipeId
        |> function result -> 
            match result with
            | Result.Error err -> Result.Error err
            | Result.Ok recipe ->
                recipe.Ingredients
                |> Seq.map addNutrition
                |> Seq.where (fun res ->
                    match res with
                        | Result.Error Error.NoNutritionalInformationForIngredient -> false
                        | _ -> true
                    )
                |> coalesceResults
                >=> RecipeNutritionDomain.getTotalNutrition