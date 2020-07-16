namespace DataAccess

open FSharp.Data
open Model
open System.Linq

module RecipeDataAccess =
    type GetRecipeByIdQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.Recipes
        WHERE Id = @id
        ", Database.compileTimeConnectionString>

    type AddRecipeCommand = SqlCommandProvider<"
        INSERT INTO dbo.Recipes (Description, Name, MethodId, NumberOfServings)
        OUTPUT INSERTED.Id
        VALUES (@description, @name, @methodId, @numberOfServings)
        ", Database.compileTimeConnectionString>
        
    type GetAllRecipeIdsQuery = SqlCommandProvider<"
        SELECT Id
        FROM dbo.Recipes
        ", Database.compileTimeConnectionString>

    type UpdateRecipeCommand = SqlCommandProvider<"
        UPDATE dbo.Recipes
        SET Description=@description, Name=@name, MethodId=@methodId, NumberOfServings=@numberOfServings
        WHERE Id = @id
        ", Database.compileTimeConnectionString>
        
    type DeleteRecipeCommand = SqlCommandProvider<"
        DELETE FROM dbo.Recipes
        WHERE Id = @id
        ", Database.compileTimeConnectionString>

    let mapToRecipe (recipeEntity: GetRecipeByIdQuery.Record) : Recipe = 
        {
            Id = recipeEntity.id;
            Name = recipeEntity.name;
            Description = recipeEntity.description;
            Ingredients = Array.empty<IngredientWithQuantity>;
            Categories = Array.empty<Category>;
            Method = {
                Id = recipeEntity.methodId;
                Steps = Array.empty<string>;
            };
            NumberOfServings = recipeEntity.numberOfServings;
        }

    let getPartialRecipeById (id: int) : Result<Recipe, Error> = 
        let query = new GetRecipeByIdQuery(Database.realConnectionString);
        query.Execute(id)
        |> Seq.toArray
        |> Seq.tryExactlyOne
        |> function recipe -> match recipe with
            | None -> Result.Error Error.RecipeDoesNotExist
            | Some recipe -> Result.Ok (mapToRecipe recipe)

    let writePartialRecipe recipe : Recipe =
        let command = new AddRecipeCommand(Database.realConnectionString);
        command.Execute(recipe.Description, recipe.Name, recipe.Method.Id, recipe.NumberOfServings)
        |> fun x -> { recipe with Id = x.Single() }

    let getAllRecipeIds () : int[] =
        let query = new GetAllRecipeIdsQuery(Database.realConnectionString);
        query.Execute()
        |> Seq.toArray

    let updatePartialRecipe updatedRecipe =
        let command = new UpdateRecipeCommand(Database.realConnectionString);
        command.Execute(updatedRecipe.Description, updatedRecipe.Name, updatedRecipe.Method.Id, updatedRecipe.NumberOfServings, updatedRecipe.Id)

    let deletePartialRecipe recipeId =
        let command = new DeleteRecipeCommand(Database.realConnectionString);
        command.Execute(recipeId)