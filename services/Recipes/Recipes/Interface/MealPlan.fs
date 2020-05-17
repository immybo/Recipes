namespace Interface

open Model
open System
open DataAccess

type DeleteMealPlanCommand = {
    UserId: int
    Date: DateTime
    MealNumber: int
}

type MealPlanQuery = {
    UserId: int
    StartDateInclusive: DateTime
    EndDateInclusive: DateTime
}

module MealPlan =
    let deleteEntry (command: DeleteMealPlanCommand) : Result<unit, Error> =
        MealPlanDataAccess.deleteMealPlanEntry (command.UserId, command.Date, command.MealNumber)
        |> Result.Ok
    
    let get (query: MealPlanQuery) : Result<MealPlanEntry[], Error> =
        MealPlanDataAccess.getMealPlansForUser (query.UserId, query.StartDateInclusive, query.EndDateInclusive)
        |> Result.Ok

    let addOrUpdate (mealPlans: MealPlanEntry[]): Result<unit, Error> =
        mealPlans
        |> Seq.iter MealPlanDataAccess.addOrUpdateMealPlanEntry
        |> Result.Ok