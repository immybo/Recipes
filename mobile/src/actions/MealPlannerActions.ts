import { Dispatch } from "redux";
import { MealPlanEntry } from "../model/MealPlanEntry";
import { MealPlannerApi } from "../services/api/MealPlanner";

export const SET_MEAL_PLAN = "SET_MEAL_PLAN";
export const DELETE_MEAL_PLAN = "DELETE_MEAL_PLAN";

interface SetMealPlanAction {
    type: typeof SET_MEAL_PLAN,
    payload: MealPlanEntry[]
}

interface DeleteMealPlanAction {
    type: typeof DELETE_MEAL_PLAN,
    payload: Date
}

export type MealPlannerActionTypes = SetMealPlanAction | DeleteMealPlanAction;

export function getMealPlan(startDateInclusive: Date, endDateInclusive: Date) {
    return function(dispatch: Dispatch<MealPlannerActionTypes>) {
        return MealPlannerApi.getMealPlan(startDateInclusive, endDateInclusive).then(
            mealPlan => dispatch(updateMealPlanLocal(mealPlan)),
            error => console.error(error) // TODO error handling
        );
    }
}

export function setMealPlan(day: Date, recipeId: number) {
    return function(dispatch: Dispatch<MealPlannerActionTypes>) {
        return MealPlannerApi.setMealPlan(day, recipeId).then(
            _ => getMealPlan(day, day)(dispatch),
            error => console.error(error) // TODO error handling
        );
    }
}

export function deleteMealPlanEntry(day: Date) {
    return function(dispatch: Dispatch<MealPlannerActionTypes>) {
        return MealPlannerApi.deleteMealPlanEntry(day).then(
            _ => dispatch(deleteMealPlanLocal(day)),
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

export function deleteMealPlanLocal(date: Date): MealPlannerActionTypes {
    return {
        type: DELETE_MEAL_PLAN,
        payload: date
    }
}