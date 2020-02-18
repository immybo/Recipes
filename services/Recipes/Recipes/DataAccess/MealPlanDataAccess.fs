namespace DataAccess

open FSharp.Data.Sql
open Model
open System
open System.Linq

module MealPlanDataAccess =
    let mapToMealPlan (mealPlanEntity: Database.sql.dataContext.``MealPlanner.MealPlansEntity``) : MealPlanEntry = 
        {
            UserId = mealPlanEntity.UserId;
            Date = mealPlanEntity.Date;
            MealNumber = mealPlanEntity.MealNumber;
            RecipeId = mealPlanEntity.RecipeId;
        }

    let getMealPlansForUser (userId: int, startDateInclusive: DateTime, endDateInclusive: DateTime) : MealPlanEntry[] = 
        query {
            for mealPlan in Database.context.MealPlanner.MealPlans do
            where (mealPlan.UserId = userId &&
                    mealPlan.Date >= startDateInclusive &&
                    mealPlan.Date <= endDateInclusive)
            select mealPlan
        }
        |> Seq.map mapToMealPlan
        |> Seq.toArray

    let deleteMealPlanEntry (userId: int, date: DateTime, mealNumber: int) : unit =
        query {
            for mealPlan in Database.context.MealPlanner.MealPlans do
            where (mealPlan.UserId = userId &&
                    mealPlan.Date = date &&
                    mealPlan.MealNumber = mealNumber)
            select mealPlan
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        |> ignore
        Database.context.SubmitUpdates();

    let addOrUpdateMealPlanEntry mealPlanEntry : unit =
        deleteMealPlanEntry (mealPlanEntry.UserId, mealPlanEntry.Date.Date, mealPlanEntry.MealNumber)

        let row = Database.context.MealPlanner.MealPlans.Create();
        row.Date <- mealPlanEntry.Date.Date
        row.UserId <- mealPlanEntry.UserId
        row.MealNumber <- mealPlanEntry.MealNumber
        row.RecipeId <- mealPlanEntry.RecipeId
        Database.context.SubmitUpdates();