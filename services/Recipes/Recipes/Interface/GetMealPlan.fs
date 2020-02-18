module GetMealPlan

open Model
open System

type MealPlanQuery = {
    UserId: int
    StartDateInclusive: DateTime
    EndDateInclusive: DateTime
}

let getMealPlan (query: MealPlanQuery) : Result<MealPlanEntry[], Error> =
    MealPlanDomain.getMealPlanForUserBetweenDates (query.UserId, query.StartDateInclusive, query.EndDateInclusive)