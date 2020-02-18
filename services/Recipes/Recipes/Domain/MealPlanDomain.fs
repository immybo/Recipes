module MealPlanDomain

open Model
open DataAccess
open System

let getMealPlanForUserBetweenDates (userId: int, startDateInclusive: DateTime, endDateInclusive: DateTime) : Result<MealPlanEntry[], Error> =
    MealPlanDataAccess.getMealPlansForUser (userId, startDateInclusive, endDateInclusive)
    |> Result.Ok

let addMealPlansForUser (mealPlans: MealPlanEntry[]) =
    mealPlans
    |> Seq.iter MealPlanDataAccess.addOrUpdateMealPlanEntry