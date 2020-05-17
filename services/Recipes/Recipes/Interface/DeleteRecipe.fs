module DeleteRecipe

open Model
open Railway
open DataAccess

let deleteMealPlansInvolvingRecipe (recipeId: int): Result<int, Error> =
    MealPlanDataAccess.deleteMealPlanEntriesInvolvingRecipe recipeId
    Result.Ok recipeId

let deleteRecipeUnchecked (recipeId: int) : Result<int, Error> =
    GetRecipe.getRecipe recipeId
    |> function
        | Result.Error err -> Result.Error err
        | Result.Ok recipe -> (
            IngredientDataAccess.deleteIngredientMappingsForRecipe recipe.Id
            CategoryDataAccess.deleteCategoryMappingsForRecipe recipe.Id
            RecipeDataAccess.deletePartialRecipe recipe.Id
            MethodDataAccess.deleteMethod recipe.Method.Id
            Result.Ok recipe.Id
        )

let deleteRecipe recipeId : Result<int, Error> =
    deleteMealPlansInvolvingRecipe recipeId
    >=> deleteRecipeUnchecked