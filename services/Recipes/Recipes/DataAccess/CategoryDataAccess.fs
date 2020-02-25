namespace DataAccess

open FSharp.Data.Sql
open Model

module CategoryDataAccess =
    let mapToCategory (categoryEntity: Database.sql.dataContext.``dbo.CategoriesEntity``) : Category = 
        {
            Id = categoryEntity.Id;
            Name = categoryEntity.Name;
        }
        
    let getCategory categoryId: Result<Category, Error> =
        query {
            for category in Database.context.Dbo.Categories do
            where (category.Id = categoryId)
            select category
        }
        |> Seq.toArray
        |> function results ->
            match results.Length with
            | 0 -> Result.Error Error.CategoryDoesNotExist
            | 1 ->
                mapToCategory results.[0]
                |> Result.Ok
            | _ -> Result.Error Error.ExpectedExactlyOne

    let getCategoriesForRecipe (recipeId: int) : Category[] = 
        query {
            for categoryMapping in Database.context.Dbo.RecipesToCategories do
            join category in Database.context.Dbo.Categories
                on (categoryMapping.CategoryId = category.Id)
            where (categoryMapping.RecipeId = recipeId)
            select category
        }
        |> Seq.map mapToCategory
        |> Seq.toArray

    let deleteCategoryMappingsForRecipe (recipeId: int) =
        query {
            for categoryMapping in Database.context.Dbo.RecipesToCategories do
            where (categoryMapping.RecipeId = recipeId)
            select categoryMapping
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        Database.context.SubmitUpdates();

    let addCategory (category: Category) : int =
        let categoryRow = Database.context.Dbo.Categories.Create();
        categoryRow.Name <- category.Name;
        Database.context.SubmitUpdates();
        categoryRow.Id

    let updateCategory (updatedCategory: Category) : int =
        let category = (query {
            for category in Database.context.Dbo.Categories do
            where (category.Id = updatedCategory.Id)
            select category
        }
        |> Seq.toArray
        |> Seq.exactlyOne)
        
        category.Name <- updatedCategory.Name;
        Database.context.SubmitUpdates();
        category.Id;

    let addCategoryMapping recipeId categoryId =
        let categoryMapping = Database.context.Dbo.RecipesToCategories.Create();
        categoryMapping.CategoryId <- categoryId
        categoryMapping.RecipeId <- recipeId;
        Database.context.SubmitUpdates();

    let writeCategoriesForRecipe recipe recipeId : int =
        for category in recipe.Categories do
            addCategory category
            |> addCategoryMapping recipeId
        recipeId

    let updateCategoriesForRecipe recipe =
        deleteCategoryMappingsForRecipe recipe.Id |> ignore

        for category in recipe.Categories do
            getCategory category.Id
            |> function result ->
                match result with
                | Result.Error CategoryDoesNotExist -> addCategory category
                | _ -> updateCategory category
            |> addCategoryMapping recipe.Id