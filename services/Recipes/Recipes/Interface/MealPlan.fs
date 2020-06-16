namespace Interface

open Model
open System
open DataAccess
open Railway

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

    let generateRandom (startDate: DateTime, numDays: int): Result<MealPlanEntry[], Error> =
        let recipeResult = Recipes.getAll ()
        match recipeResult with
        | Result.Error err -> Result.Error err
        | Result.Ok recipes ->
            let mealPlan = 
                match recipes.Length < numDays with
                | true -> MealPlanGeneration.generateRandomMealPlan (recipes, numDays, startDate)
                | false -> MealPlanGeneration.generateRandomMealPlanNoDuplicates (recipes, numDays, startDate)

            addOrUpdate (mealPlan)
            >=> fun _ -> Result.Ok mealPlan