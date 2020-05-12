module GetNutritionalInformationForRecipe

open Model

let getNutritionalInformationForRecipe recipeId : Result<MacronutrientInformation, Error> =
    let ingredientNutrition =
        RecipeDomain.getRecipeById recipeId
        |> function result -> 
            match result with
            | Result.Error err -> Result.Error err
            | Result.Ok recipe ->
                Array.map (function (ingredient: IngredientWithQuantity) -> ingredient.Ingredient.Id) recipe.Ingredients
                |> NutritionalInformationDomain.getNutritionalInformationForIngredients
    match ingredientNutrition with
    | Result.Error err -> Result.Error err
    | Result.Ok nutritions -> Seq.map (fun x -> x.Macronutrients) nutritions |> NutritionalInformationDomain.sumNutrition
    