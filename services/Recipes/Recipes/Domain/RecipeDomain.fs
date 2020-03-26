module RecipeDomain

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

let getRecipeById (id: int) : Result<Recipe, Error> =
    RecipeDataAccess.getPartialRecipeById id
    |> function recipe ->
        match recipe with
        | Result.Error err -> Result.Error err
        | Result.Ok recipe ->
            loadCategoriesIntoRecipe id recipe
            |> loadIngredientsIntoRecipe id
            |> loadMethodIntoRecipe
            |> Result.Ok

let setMethodId recipe methodId =
    { recipe with Method = { recipe.Method with Id = methodId }}

// TODO this file will become too big. need multiple domain files
let addRecipe (recipe: Recipe) : Result<int, Error> =
    MethodDataAccess.addMethod recipe.Method
    |> setMethodId recipe
    |> RecipeDataAccess.writePartialRecipe recipe
    |> CategoryDataAccess.writeCategoriesForRecipe recipe
    |> IngredientDataAccess.writeIngredientsForRecipe recipe
    |> Result.Ok

let getAllRecipes () : Result<Recipe[], Error> =
    RecipeDataAccess.getAllRecipeIds
    |> Array.map(function recipeId -> getRecipeById recipeId)
    // Remove any that weren't read correctly; might want to handle individual error types here
    // - TODO this behaviour is only correct on RecipeDoesNotExist
    |> Array.choose(function result -> 
        match result with
        | Result.Ok recipe -> Some recipe
        | Result.Error err -> None)
    |> Result.Ok

let getAllIngredients () : Result<Ingredient[], Error> =
    IngredientDataAccess.getAllIngredients
    |> Result.Ok 

let updateRecipe (recipe: Recipe) : Result<int, Error> =
    getRecipeById(recipe.Id)
    |> function result ->
        match result with
        | Result.Error err -> Result.Error err
        | Result.Ok _ -> (
            RecipeDataAccess.updatePartialRecipe recipe
            CategoryDataAccess.updateCategoriesForRecipe recipe
            IngredientDataAccess.updateIngredientsForRecipe recipe
            MethodDataAccess.updateMethod recipe.Method
            Result.Ok recipe.Id
        )
    
let deleteRecipe (recipeId: int) : Result<int, Error> =
    getRecipeById recipeId
    |> function
        | Result.Error err -> Result.Error err
        | Result.Ok recipe -> (
            IngredientDataAccess.deleteIngredientMappingsForRecipe recipe.Id
            CategoryDataAccess.deleteCategoryMappingsForRecipe recipe.Id
            RecipeDataAccess.deletePartialRecipe recipe.Id
            MethodDataAccess.deleteMethod recipe.Method.Id
            Result.Ok recipe.Id
        )

let addIngredient (ingredient: Ingredient) : Result<int, Error> =
    IngredientDataAccess.addIngredient ingredient
    |> Result.Ok