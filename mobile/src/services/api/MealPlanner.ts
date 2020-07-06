import { HttpMethod, callApi } from "../Server";
import { parseMealPlan } from "../MealPlanParser";
import { MealPlanEntry } from "../../model/MealPlanEntry";
import { parseNull } from "../NullParser";

export class MealPlannerApi {    
    public static getMealPlan(startDateInclusive: Date, endDateInclusive: Date): Promise<MealPlanEntry[]> {
        return callApi(
            "mealplanner/mealplans",
            HttpMethod.PUT,
            parseMealPlan,
            JSON.stringify({ UserId: 0, StartDateInclusive: formatDate(startDateInclusive), EndDateInclusive: formatDate(endDateInclusive)}));
    }

    public static setMealPlan(date: Date, recipeId: number, mealNumber: number) {
        return callApi(
            "mealplanner/mealplans",
            HttpMethod.POST,
            parseNull,
            JSON.stringify([{ UserId: 0, Date: formatDate(date), MealNumber: mealNumber, RecipeId: recipeId}]));
    }

    public static deleteMealPlanEntry(date: Date, mealNumber: number) {
        return callApi(
            "mealplanner/mealplans",
            HttpMethod.DELETE,
            parseNull,
            JSON.stringify({ UserId: 0, Date: formatDate(date), MealNumber: mealNumber}));
    }

    public static generateRandomMealPlan(startDate: Date, numDays: number) {
        return callApi(
            "mealplanner/generate",
            HttpMethod.POST,
            parseMealPlan,
            JSON.stringify({ StartDate: startDate, NumDays: numDays }));
    }
} 

function formatDate(date: Date): string {
    return date.toLocaleDateString();
}