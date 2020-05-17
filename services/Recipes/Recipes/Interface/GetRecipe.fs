module GetRecipe

open Model
open DataAccess

let loadCategoriesIntoRecipe recipeId recipe : Recipe =
    CategoryDataAccess.getCategoriesForRecipe recipeId
    |> function categories -> { recipe with Categories = categories }

let loadIngredientsIntoRecipe recipeId recipe : Recipe =
    IngredientDataAccess.getIngredientsForRecipe recipeId
    |> function ingredients -> { recipe with Ingredients = ingredients }

let loadMethodIntoRecipe recipe : Recipe =
    MethodDataAccess.getMethodById recipe.Method.Id
    |> function method -> { recipe with Method = method }

let getRecipe (id: int) : Result<Recipe, Error> =
    RecipeDataAccess.getPartialRecipeById id
    |> function recipe ->
        match recipe with
        | Result.Error err -> Result.Error err
        | Result.Ok recipe ->
            loadCategoriesIntoRecipe id recipe
            |> loadIngredientsIntoRecipe id
            |> loadMethodIntoRecipe
            |> Result.Ok