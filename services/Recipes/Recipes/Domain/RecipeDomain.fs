module RecipeDomain

open Model
open DataAccess

let loadCategoriesIntoRecipe recipeId recipe : Recipe =
    CategoryDataAccess.getCategoriesForRecipe recipeId
    |> function categories -> { recipe with Categories = categories }

let loadIngredientsIntoRecipe recipeId recipe : Recipe =
    IngredientDataAccess.getIngredientsForRecipe recipeId
    |> function ingredients -> { recipe with Ingredients = ingredients }

let loadMethodIntoRecipe methodId recipe : Recipe =
    MethodDataAccess.getMethodById methodId
    |> function method -> { recipe with Method = method }

let getRecipeById (id: int) : Result<Recipe, Error> =
    RecipeDataAccess.getPartialRecipeById id
    |> function recipe ->
        match recipe with
        | Result.Error err -> Result.Error err
        | Result.Ok recipe ->
            loadCategoriesIntoRecipe id recipe
            |> loadIngredientsIntoRecipe id
            |> loadMethodIntoRecipe id
            |> Result.Ok

let addRecipe (recipe: Recipe) : Result<int, Error> =
    MethodDataAccess.addMethod recipe.Method
    |> RecipeDataAccess.writePartialRecipe recipe
    |> CategoryDataAccess.writeCategoriesForRecipe recipe
    |> IngredientDataAccess.writeIngredientsForRecipe recipe
    |> Result.Ok