module DeleteMealPlanEntry

open Model
open System

type DeleteMealPlanCommand = {
    UserId: int
    Date: DateTime
    MealNumber: int
}

let deleteMealPlanEntry (command: DeleteMealPlanCommand) : Result<unit, Error> =
    MealPlanDomain.deleteMealPlan (command.UserId, command.Date, command.MealNumber)