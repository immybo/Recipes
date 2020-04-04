namespace DataAccess

open FSharp.Data
open Model
open System

module MealPlanDataAccess =
    type GetMealPlansForUserQuery = SqlCommandProvider<"
        SELECT *
        FROM MealPlanner.MealPlans
        WHERE UserId = @userId AND Date >= @startDateInclusive AND Date <= @endDateInclusive
        ", Database.compileTimeConnectionString>
        
    type DeleteMealPlanCommand = SqlCommandProvider<"
        DELETE
        FROM MealPlanner.MealPlans
        WHERE UserId = @userId AND Date = @date AND MealNumber = @mealNumber
        ", Database.compileTimeConnectionString>
        
    type AddMealPlanCommand = SqlCommandProvider<"
        INSERT INTO MealPlanner.MealPlans (Date, UserId, MealNumber, RecipeId)
        VALUES (@date, @userId, @mealNumber, @recipeId)
        ", Database.compileTimeConnectionString>

    type DeleteMealPlanEntriesForRecipeCommand = SqlCommandProvider<"
        DELETE
        FROM MealPlanner.MealPlans
        WHERE RecipeId = @recipeId
        ", Database.compileTimeConnectionString>

    let mapToMealPlan (mealPlanEntity: GetMealPlansForUserQuery.Record) : MealPlanEntry = 
        {
            UserId = mealPlanEntity.userId;
            Date = mealPlanEntity.date;
            MealNumber = mealPlanEntity.mealNumber;
            RecipeId = mealPlanEntity.recipeId;
        }

    let getMealPlansForUser (userId: int, startDateInclusive: DateTime, endDateInclusive: DateTime) : MealPlanEntry[] =
        let query = new GetMealPlansForUserQuery(Database.realConnectionString);
        query.Execute(userId = userId, startDateInclusive = startDateInclusive, endDateInclusive = endDateInclusive)
        |> Seq.map mapToMealPlan
        |> Seq.toArray

    let deleteMealPlanEntry (userId: int, date: DateTime, mealNumber: int) : unit =
        let command = new DeleteMealPlanCommand(Database.realConnectionString)
        command.Execute(userId, date, mealNumber) |> ignore
        ()

    let addOrUpdateMealPlanEntry mealPlanEntry : unit =
        deleteMealPlanEntry (mealPlanEntry.UserId, mealPlanEntry.Date.Date, mealPlanEntry.MealNumber)

        let command = new AddMealPlanCommand(Database.realConnectionString);
        command.Execute(mealPlanEntry.Date, mealPlanEntry.UserId, mealPlanEntry.MealNumber, mealPlanEntry.RecipeId) |> ignore
        ()

    let deleteMealPlanEntriesInvolvingRecipe recipeId : unit =
        let command = new DeleteMealPlanEntriesForRecipeCommand(Database.realConnectionString)
        command.Execute(recipeId) |> ignore
        ()