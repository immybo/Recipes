namespace DataAccess

open FSharp.Data
open Model
open System.Linq

module CategoryDataAccess =
    type GetCategoryQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.Categories
        WHERE Id = @categoryId
        ", Database.compileTimeConnectionString>

    type GetCategoriesForRecipeQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.RecipesToCategories
        INNER JOIN dbo.Categories ON RecipesToCategories.CategoryId = Categories.Id
        WHERE RecipeId = @recipeId
        ", Database.compileTimeConnectionString>
    
    type DeleteCategoryMappingsForRecipeCommand = SqlCommandProvider<"
        DELETE FROM dbo.RecipesToCategories
        WHERE RecipeId = @recipeId
        ", Database.compileTimeConnectionString>
    
    type AddCategoryCommand = SqlCommandProvider<"
        INSERT INTO dbo.Categories (Name)
        OUTPUT INSERTED.id
        VALUES (@name)
        ", Database.compileTimeConnectionString>
    
    type UpdateCategoryCommand = SqlCommandProvider<"
        UPDATE dbo.Categories
        SET Name = @name
        WHERE Id = @categoryId
        ", Database.compileTimeConnectionString>
    
    type AddCategoryMappingCommand = SqlCommandProvider<"
        INSERT INTO dbo.RecipesToCategories (RecipeId, CategoryId)
        VALUES (@recipeId, @categoryId)
        ", Database.compileTimeConnectionString>

    let mapToCategory (categoryEntity: GetCategoryQuery.Record) : Category = 
        {
            Id = categoryEntity.id;
            Name = categoryEntity.name;
        }
       
    // TODO
    let mapToCategory2 (categoryEntity: GetCategoriesForRecipeQuery.Record) : Category = 
        {
            Id = categoryEntity.id;
            Name = categoryEntity.name;
        }
        
    let getCategory categoryId: Result<Category, Error> =
        let query = new GetCategoryQuery(Database.realConnectionString)
        query.Execute categoryId
        |> Seq.toArray
        |> function results ->
            match results.Length with
            | 0 -> Result.Error Error.CategoryDoesNotExist
            | 1 ->
                mapToCategory results.[0]
                |> Result.Ok
            | _ -> Result.Error Error.ExpectedExactlyOne

    let getCategoriesForRecipe (recipeId: int) : Category[] = 
        let query = new GetCategoriesForRecipeQuery(Database.realConnectionString)
        query.Execute recipeId
        |> Seq.map mapToCategory2
        |> Seq.toArray

    let deleteCategoryMappingsForRecipe (recipeId: int) =
        let command = new DeleteCategoryMappingsForRecipeCommand(Database.realConnectionString)
        command.Execute recipeId |> ignore

    let addCategory (category: Category) : int =
        let command = new AddCategoryCommand(Database.realConnectionString)
        command.Execute category.Name
        |> fun x -> x.Single()

    let updateCategory (updatedCategory: Category) : int =
        let command = new UpdateCategoryCommand(Database.realConnectionString)
        command.Execute (updatedCategory.Name, updatedCategory.Id) |> ignore
        updatedCategory.Id

    let addCategoryMapping recipeId categoryId =
        let command = new AddCategoryMappingCommand(Database.realConnectionString)
        command.Execute (recipeId, categoryId) |> ignore

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