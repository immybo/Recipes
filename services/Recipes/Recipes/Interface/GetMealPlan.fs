module GetMealPlan

open Model
open System
open DataAccess

type MealPlanQuery = {
    UserId: int
    StartDateInclusive: DateTime
    EndDateInclusive: DateTime
}

let getMealPlan (query: MealPlanQuery) : Result<MealPlanEntry[], Error> =
    MealPlanDataAccess.getMealPlansForUser (query.UserId, query.StartDateInclusive, query.EndDateInclusive)
    |> Result.Ok