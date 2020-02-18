module AddOrUpdateMealPlan

open Model

let addOrUpdateMealPlan (mealPlans: MealPlanEntry[]): Result<unit, Error> =
    MealPlanDomain.addMealPlansForUser mealPlans
    |> Result.Ok