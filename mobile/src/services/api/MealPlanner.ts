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

    public static setMealPlan(date: Date, recipeId: number) {
        return callApi(
                "mealplanner/mealplans",
                HttpMethod.POST,
                parseNull,
                JSON.stringify([{ UserId: 0, Date: formatDate(date), MealNumber: 1, RecipeId: recipeId}]));
    }
} 

function formatDate(date: Date): string {
    return date.toLocaleDateString();
}