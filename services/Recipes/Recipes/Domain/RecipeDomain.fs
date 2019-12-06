module RecipeDomain

open Model
open DataAccess

let loadCategoriesIntoRecipe (recipe: Recipe) : Recipe =
    CategoryDataAccess.getCategoriesForRecipe recipe.Id
    |> function categories -> { recipe with Categories = categories }

let loadIngredientsIntoRecipe (recipe: Recipe) : Recipe =
    IngredientDataAccess.getIngredientsForRecipe recipe.Id
    |> function ingredients -> { recipe with Ingredients = ingredients }

let getRecipeById (id: int) : Result<Recipe, Error> =
    RecipeDataAccess.getPartialRecipeById id
    |> function recipe -> match recipe with
        | Result.Error err -> Result.Error err
        | Result.Ok recipe ->
       loadCategoriesIntoRecipe recipe
    |> loadIngredientsIntoRecipe
    |> function recipe -> Result.Ok recipe