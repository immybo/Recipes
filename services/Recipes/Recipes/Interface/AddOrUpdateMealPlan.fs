module AddOrUpdateMealPlan

open Model
open DataAccess

let addOrUpdateMealPlan (mealPlans: MealPlanEntry[]): Result<unit, Error> =
    mealPlans
    |> Seq.iter MealPlanDataAccess.addOrUpdateMealPlanEntry
    |> Result.Ok