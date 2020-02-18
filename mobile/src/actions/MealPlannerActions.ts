import { HttpMethod, callApi } from "../services/Server";
import { Dispatch } from "redux";
import { parseMealPlan } from "../services/MealPlanParser";
import { MealPlanEntry } from "../model/MealPlanEntry";

export const SET_MEAL_PLAN = "SET_MEAL_PLAN";

interface SetMealPlanAction {
    type: typeof SET_MEAL_PLAN,
    payload: MealPlanEntry[]
}

export type MealPlannerActionTypes = SetMealPlanAction;

export function getMealPlan(startDateInclusive: Date, endDateInclusive: Date) {
    return function(dispatch: Dispatch<MealPlannerActionTypes>) {
        return callApi("mealplanner/mealplans", HttpMethod.PUT, JSON.stringify({ UserId: 0, StartDateInclusive: formatDate(startDateInclusive), EndDateInclusive: formatDate(endDateInclusive)})).then(
            response => response.json().then(json => dispatch(updateMealPlanLocal(parseMealPlan(json)))),
            error => console.error(error) // TODO error handling
        );
    }
}

export function setMealPlan(day: Date, recipeId: number) {
    return function(dispatch: Dispatch<MealPlannerActionTypes>) {
        return callApi("mealplanner/mealplans", HttpMethod.POST, JSON.stringify([{ UserId: 0, Date: formatDate(day), MealNumber: 1, RecipeId: recipeId}])).then(
            response => response.json().then(json => getMealPlan(day, day)(dispatch)),
            error => console.error(error) // TODO error handling
        );
    }
}

export function updateMealPlanLocal(mealPlan: MealPlanEntry[]): MealPlannerActionTypes {
    return {
        type: SET_MEAL_PLAN,
        payload: mealPlan
    }
}

function formatDate(date: Date): string {
    return date.toLocaleDateString();
}