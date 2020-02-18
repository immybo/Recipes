import { MealPlanEntry } from "../model/MealPlanEntry";

export function parseMealPlan(mealPlanJson: any): Array<MealPlanEntry> {
    return mealPlanJson.map((mealPlanEntryJson: any) => parseMealPlanEntry(mealPlanEntryJson));
}

export function parseMealPlanEntry(mealPlanEntryJson: any): MealPlanEntry {
    return {
        userId: mealPlanEntryJson.UserId,
        date: new Date(Date.parse(mealPlanEntryJson.Date)),
        mealNumber: mealPlanEntryJson.MealNumber,
        recipeId: mealPlanEntryJson.RecipeId
    };
}