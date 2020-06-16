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

type GenerateRandomMealPlanCommand = {
    StartDate: DateTime
    NumDays: int
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

    let generateRandom (command: GenerateRandomMealPlanCommand): Result<MealPlanEntry[], Error> =
        let recipeResult = Recipes.getAll ()
        match recipeResult with
        | Result.Error err -> Result.Error err
        | Result.Ok recipes ->
            let mealPlan = 
                match recipes.Length < command.NumDays with
                | true -> MealPlanGeneration.generateRandomMealPlan (recipes, command.NumDays, command.StartDate)
                | false -> MealPlanGeneration.generateRandomMealPlanNoDuplicates (recipes, command.NumDays, command.StartDate)

            addOrUpdate (mealPlan)
            >=> fun _ -> Result.Ok mealPlan