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