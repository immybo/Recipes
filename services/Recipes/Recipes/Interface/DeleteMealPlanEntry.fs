module DeleteMealPlanEntry

open Model
open System
open DataAccess

type DeleteMealPlanCommand = {
    UserId: int
    Date: DateTime
    MealNumber: int
}

let deleteMealPlanEntry (command: DeleteMealPlanCommand) : Result<unit, Error> =
    MealPlanDataAccess.deleteMealPlanEntry (command.UserId, command.Date, command.MealNumber)
    |> Result.Ok