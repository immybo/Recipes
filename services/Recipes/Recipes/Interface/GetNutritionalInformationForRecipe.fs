module GetNutritionalInformationForRecipe

open Model

let getNutritionalInformationForRecipe recipeId : Result<MacronutrientInformation, Error> =
    let ingredientNutrition =
        GetRecipe.getRecipe recipeId
        |> function result -> 
            match result with
            | Result.Error err -> Result.Error err
            | Result.Ok recipe ->
                Array.map (function (ingredient: IngredientWithQuantity) -> ingredient.Ingredient.Id) recipe.Ingredients
                |> GetNutritionalInformationForIngredients.getNutritionalInformationForIngredients
    match ingredientNutrition with
    | Result.Error err -> Result.Error err
    | Result.Ok nutritions -> Seq.map (fun x -> x.MacronutrientsPerServing) nutritions |> NutritionalInformationDomain.sumNutrition