
namespace Tests

open NUnit.Framework
open Model
open Interface
open System
open System.Linq

module MealPlanInterfaceTests = 
    let ExampleMealPlan: MealPlanEntry[] = [|
        {
            UserId = 0;
            Date = new DateTime(2020, 01, 01);
            MealNumber = 1;
            RecipeId = -1;
        }
    |]

    let GetMealPlan (recipeId: int) : MealPlanEntry[] =
        ExampleMealPlan
        |> Seq.map (fun entry -> { entry with RecipeId = recipeId })
        |> Seq.toArray

    [<Test>]
    let Meal_Plan_Can_Be_Added_And_Retrieved () =
        let recipeId = TestUtils.addRecipe

        let mealPlan = GetMealPlan recipeId
        match MealPlan.addOrUpdate (mealPlan) with
        | Result.Error err -> Assert.Fail(err.ToString())
        | Result.Ok _ -> ()

        let getMealPlanEntryResult = MealPlan.get { UserId = 0; StartDateInclusive = new DateTime(2020, 01, 01); EndDateInclusive = new DateTime(2020, 01, 01) }

        match getMealPlanEntryResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok mealPlan ->
            Assert.AreEqual (1, mealPlan.Length)
            Assert.AreEqual (recipeId, mealPlan.Single().RecipeId)

        MealPlan.deleteEntry { UserId = 0; Date = new DateTime(2020, 01, 01); MealNumber = 1; } |> ignore
    
    [<Test>]
    let Existing_Meal_Plan_Entries_Can_Be_Edited () =
        let recipe1Id = TestUtils.addRecipe
        let recipe2Id = TestUtils.addRecipe

        let mealPlan = GetMealPlan recipe1Id
        match MealPlan.addOrUpdate (mealPlan) with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok _ -> ()
        
        let newMealPlanEntry = { mealPlan.[0] with RecipeId = recipe2Id }
        match MealPlan.addOrUpdate ([|newMealPlanEntry|]) with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok _ -> ()
        
        let getMealPlanEntryResult = MealPlan.get { UserId = 0; StartDateInclusive = new DateTime(2020, 01, 01); EndDateInclusive = new DateTime(2020, 01, 01) }
        match getMealPlanEntryResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok mealPlan -> Assert.AreEqual (recipe2Id, mealPlan.Single().RecipeId)
        
        MealPlan.deleteEntry { UserId = 0; Date = new DateTime(2020, 01, 01); MealNumber = 1; } |> ignore
    
    [<Test>]
    let Meal_Plan_Entries_Can_Be_Deleted () =
        let recipeId = TestUtils.addRecipe

        let mealPlan = GetMealPlan recipeId
        match MealPlan.addOrUpdate (mealPlan) with
        | Result.Error err -> Assert.Fail(err.ToString())
        | Result.Ok _ -> ()

        match MealPlan.deleteEntry { UserId = 0; Date = new DateTime(2020, 01, 01); MealNumber = 1; } with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok _ -> ()
        
        let getMealPlanEntryResult = MealPlan.get { UserId = 0; StartDateInclusive = new DateTime(2020, 01, 01); EndDateInclusive = new DateTime(2020, 01, 01) }

        match getMealPlanEntryResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok mealPlan ->
            Assert.AreEqual (0, mealPlan.Length)