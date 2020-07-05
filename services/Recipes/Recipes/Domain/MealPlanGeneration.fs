module MealPlanGeneration

open System.Collections.Generic
open Model
open System

let getRandomRecipesNoDuplicates (allRecipes: IList<Recipe>, numEntries: int) : seq<Recipe> =
    let rand = new System.Random()
    let sequence = Seq.initInfinite (fun _ -> rand.Next (0, allRecipes.Count))
    sequence
    |> Seq.distinct
    |> Seq.take (numEntries)
    |> Seq.map (fun x -> allRecipes.[x])
    
let generateRandomMealPlanNoDuplicates (allRecipes: IList<Recipe>, numEntries: int, startDate: DateTime) : MealPlanEntry[] =
   getRandomRecipesNoDuplicates (allRecipes, numEntries)
   |> Seq.mapi (fun i recipe -> { UserId = 0; Date = startDate.AddDays(float(i)); MealNumber = 1; RecipeId = recipe.Id })
   |> Seq.toArray

let getRandomRecipes (allRecipes: IList<Recipe>, numEntries: int) : seq<Recipe> =
    let rand = new System.Random()
    let sequence = Seq.initInfinite (fun _ -> rand.Next (0, allRecipes.Count))
    sequence
    |> Seq.take (numEntries)
    |> Seq.map (fun x -> allRecipes.[x])

let generateRandomMealPlan (allRecipes: IList<Recipe>, numEntries: int, startDate: DateTime) : MealPlanEntry[] =
   getRandomRecipes (allRecipes, numEntries)
   |> Seq.mapi (fun i recipe -> { UserId = 0; Date = startDate.AddDays(float(i)); MealNumber = 1; RecipeId = recipe.Id })
   |> Seq.toArray