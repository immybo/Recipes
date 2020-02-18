namespace Model

open System

type MealPlanEntry = {
    UserId: int
    Date: DateTime
    MealNumber: int
    RecipeId: int
}