module DeleteRecipe

open Model
open Railway

let deleteRecipe recipeId : Result<int, Error> =
    MealPlanDomain.deleteMealPlansInvolvingRecipe recipeId
    >=> RecipeDomain.deleteRecipe