module RecipeNutritionDomain

open Model
open Railway
open NutritionalInformationDomain
open QuantityDomain

type IngredientWithQuantityAndNutrition = {
    Ingredient: IngredientWithQuantity
    Nutrition: IngredientNutrition
}

let getNutritionForQuantityOfIngredient (ingredient: IngredientWithQuantityAndNutrition) =
    getRatioBetweenQuantities (ingredient.Ingredient.Quantity, ingredient.Nutrition.Density, ingredient.Nutrition.ServingSize)
    >=> multiplyNutrition ingredient.Nutrition.MacronutrientsPerServing

let getTotalNutrition ingredients =
    Seq.map (fun ingredient -> getNutritionForQuantityOfIngredient ingredient) ingredients
    |> coalesceResults
    >=> sumNutrition