module GetNutritionalInformationForRecipe

open Model

let getNutritionalInformationForRecipe recipeId : Result<NutritionalInformation[], Error> =
    RecipeDomain.getRecipeById recipeId
    |> function result -> 
        match result with
        | Result.Error err -> Result.Error err
        | Result.Ok recipe ->
            Array.map (function (ingredient: IngredientWithQuantity) -> ingredient.Ingredient.Id) recipe.Ingredients
            |> NutritionalInformationDomain.getNutritionalInformationForIngredients
    