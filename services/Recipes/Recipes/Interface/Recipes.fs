namespace Interface

open Model
open DataAccess
open Validation
open Railway

module Recipes =
    let loadCategoriesIntoRecipe recipeId recipe : Recipe =
        CategoryDataAccess.getCategoriesForRecipe recipeId
        |> function categories -> { recipe with Categories = categories }

    let loadIngredientsIntoRecipe recipeId recipe : Recipe =
        IngredientDataAccess.getIngredientsForRecipe recipeId
        |> function ingredients -> { recipe with Ingredients = ingredients }

    let loadMethodIntoRecipe recipe : Recipe =
        MethodDataAccess.getMethodById recipe.Method.Id
        |> function method -> { recipe with Method = method }

    let get (id: int) : Result<Recipe, Error> =
        RecipeDataAccess.getPartialRecipeById id
        |> function recipe ->
            match recipe with
            | Result.Error err -> Result.Error err
            | Result.Ok recipe ->
                loadCategoriesIntoRecipe id recipe
                |> loadIngredientsIntoRecipe id
                |> loadMethodIntoRecipe
                |> Result.Ok

    let getAll () : Result<Recipe[], Error> =
        RecipeDataAccess.getAllRecipeIds ()
        |> Array.map(function recipeId -> get recipeId)
        // Remove any that weren't read correctly; might want to handle individual error types here
        // - TODO this behaviour is only correct on RecipeDoesNotExist
        |> Array.choose(function result -> 
            match result with
            | Result.Ok recipe -> Some recipe
            | Result.Error err -> None)
        |> Result.Ok

    let setMethodId recipe methodId =
        { recipe with Method = { recipe.Method with Id = methodId }}
    
    let addRecipeUnchecked (recipe: Recipe) : Result<int, Error> =
        MethodDataAccess.addMethod recipe.Method
        |> setMethodId recipe
        |> RecipeDataAccess.writePartialRecipe
        |> CategoryDataAccess.writeCategoriesForRecipe
        |> IngredientDataAccess.writeIngredientsForRecipe
        |> fun recipe -> recipe.Id
        |> Result.Ok
    
    let add (recipe: Recipe) =
        RecipeValidation.validateRecipe recipe
        >=> addRecipeUnchecked

    let deleteMealPlansInvolvingRecipe (recipeId: int): Result<int, Error> =
        MealPlanDataAccess.deleteMealPlanEntriesInvolvingRecipe recipeId
        Result.Ok recipeId
    
    let deleteRecipeUnchecked (recipeId: int) : Result<int, Error> =
        get recipeId
        |> function
            | Result.Error err -> Result.Error err
            | Result.Ok recipe -> (
                IngredientDataAccess.deleteIngredientMappingsForRecipe recipe.Id
                CategoryDataAccess.deleteCategoryMappingsForRecipe recipe.Id
                RecipeDataAccess.deletePartialRecipe recipe.Id
                MethodDataAccess.deleteMethod recipe.Method.Id
                Result.Ok recipe.Id
            )
    
    let delete recipeId : Result<int, Error> =
        deleteMealPlansInvolvingRecipe recipeId
        >=> deleteRecipeUnchecked

    let hasMethodId recipe : Result<Recipe, Error> =
        match recipe.Method.Id > 0 with
        | true -> Result.Ok recipe
        | false -> Result.Error Error.RequiredParameter
    
    let validateUpdateRecipe recipe : Result<Recipe, Error> =
        hasMethodId recipe
    
    let updateRecipeUnchecked (recipe: Recipe) : Result<int, Error> =
        let getResult = get (recipe.Id)
        match getResult with
        | Result.Ok _ ->
            RecipeDataAccess.updatePartialRecipe recipe |> ignore
            CategoryDataAccess.updateCategoriesForRecipe recipe
            IngredientDataAccess.updateIngredientsForRecipe recipe
            MethodDataAccess.updateMethod recipe.Method
            Result.Ok recipe.Id
        | Result.Error err -> Result.Error err
    
    let update recipe : Result<int, Error> =
        validateUpdateRecipe recipe
        >=> updateRecipeUnchecked