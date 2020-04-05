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

let deleteMealPlansInvolvingRecipe (recipeId: int): Result<int, Error> =
    MealPlanDataAccess.deleteMealPlanEntriesInvolvingRecipe recipeId
    Result.Ok recipeId

let deleteMealPlan (userId: int, date: DateTime, mealNumber: int): Result<unit, Error> =
    MealPlanDataAccess.deleteMealPlanEntry (userId, date, mealNumber)
    |> Result.Ok