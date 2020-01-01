namespace DataAccess

open FSharp.Data.Sql
open Model

module CategoryDataAccess =
    let mapToCategory (categoryEntity: Database.sql.dataContext.``dbo.CategoriesEntity``) : Category = 
        {
            Name = categoryEntity.Name;
        }

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

    let addCategory (category: Category) : int =
        let categoryRow = Database.context.Dbo.Categories.Create();
        categoryRow.Name <- category.Name;
        Database.context.SubmitUpdates();
        categoryRow.Id

    let addCategoryMapping recipeId categoryId =
        let categoryMapping = Database.sql.GetDataContext().Dbo.RecipesToCategories.Create();
        categoryMapping.CategoryId <- categoryId
        categoryMapping.RecipeId <- recipeId;
        Database.context.SubmitUpdates();

    let writeCategoriesForRecipe recipe recipeId : int =
        for category in recipe.Categories do
            addCategory category
            |> addCategoryMapping recipeId
        recipeId