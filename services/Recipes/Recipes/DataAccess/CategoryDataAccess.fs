namespace DataAccess

open FSharp.Data.Sql
open Model

module CategoryDataAccess =
    let mapToCategory (categoryEntity: Database.sql.dataContext.``dbo.CategoriesEntity``) : Category = 
        {
            Id = categoryEntity.Id;
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

    // TODO not good functional style
    let addCategory (recipeId: int, category: Category) =
        let categoryRow = Database.context.Dbo.Categories.Create();
        categoryRow.Id <- category.Id;
        categoryRow.Name <- category.Name;

        let categoryMapping = Database.sql.GetDataContext().Dbo.RecipesToCategories.Create();
        categoryMapping.CategoryId <- category.Id;
        categoryMapping.RecipeId <- recipeId;

    let writeCategoriesForRecipe (recipe: Recipe) =
        for category in recipe.Categories do
            addCategory(recipe.Id, category)
        Database.context.SubmitUpdates();