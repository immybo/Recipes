module RecipeNutritionDomain

open Model
open Railway
open NutritionalInformationDomain
open QuantityDomain

type IngredientWithQuantityAndNutrition = {
    Ingredient: IngredientWithQuantity
    Nutrition: NutritionalInformation
}

let loadNutritionIntoIngredient (ingredient: IngredientWithQuantity, nutritionSeq: NutritionalInformation[]) =
    Seq.filter (fun nutrition -> nutrition.IngredientId = ingredient.Ingredient.Id) nutritionSeq
    |> Seq.exactlyOne
    |> fun nutrition ->
        {
            Ingredient = ingredient;
            Nutrition = nutrition;
        }

let loadNutritionIntoIngredientsList (ingredients: IngredientWithQuantity[]) =
    let nutritionalInformation = Seq.map (fun (ingredient: IngredientWithQuantity) -> ingredient.Ingredient.Id) ingredients |> getNutritionalInformationForIngredients
    match nutritionalInformation with
    | Result.Ok res -> Result.Ok (Seq.map (fun ingredient -> loadNutritionIntoIngredient(ingredient, res)) ingredients)
    | Result.Error err -> Result.Error err

let getNutritionForQuantityOfIngredient ingredient =
    getRatioBetweenQuantities ingredient.Ingredient.Quantity ingredient.Nutrition.Macronutrients.ServingSize
    >=> multiplyNutrition ingredient.Nutrition.Macronutrients

let getTotalNutrition ingredients =
    Seq.map (fun ingredient -> getNutritionForQuantityOfIngredient ingredient) ingredients
    |> coalesceResults
    >=> sumNutrition

let getNutritionalInformationForRecipe recipeId =
    RecipeDomain.getRecipeById recipeId
    >=> fun recipe -> Result.Ok recipe.Ingredients
    >=> loadNutritionIntoIngredientsList
    >=> getTotalNutrition
