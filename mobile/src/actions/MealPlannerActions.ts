import { Dispatch } from "redux";
import { MealPlanEntry } from "../model/MealPlanEntry";
import { MealPlannerApi } from "../services/api/MealPlanner";
import { setApiErrorToDisplay } from "./NetworkActions";

export const SET_MEAL_PLAN = "SET_MEAL_PLAN";
export const DELETE_MEAL_PLAN = "DELETE_MEAL_PLAN";

interface SetMealPlanAction {
    type: typeof SET_MEAL_PLAN,
    payload: MealPlanEntry[]
}

interface DeleteMealPlanAction {
    type: typeof DELETE_MEAL_PLAN,
    date: Date,
    mealNumber: number
}

export type MealPlannerActionTypes = SetMealPlanAction | DeleteMealPlanAction;

export function getMealPlan(startDateInclusive: Date, endDateInclusive: Date) {
    return function(dispatch: Dispatch) {
        return MealPlannerApi.getMealPlan(startDateInclusive, endDateInclusive).then(
            mealPlan => dispatch(updateMealPlanLocal(mealPlan)),
            error => dispatch(setApiErrorToDisplay("Error retrieving meal plan. " + String(error)))
        );
    }
}

export function setMealPlan(day: Date, recipeId: number, mealNumber: number) {
    return function(dispatch: Dispatch) {
        return MealPlannerApi.setMealPlan(day, recipeId, mealNumber).then(
            _ => getMealPlan(day, day)(dispatch),
            error => dispatch(setApiErrorToDisplay("Error updating meal plan. " + String(error)))
        );
    }
}

export function deleteMealPlanEntry(day: Date, mealNumber: number) {
    return function(dispatch: Dispatch) {
        return MealPlannerApi.deleteMealPlanEntry(day, mealNumber).then(
            _ => dispatch(deleteMealPlanLocal(day, mealNumber)),
            error => dispatch(setApiErrorToDisplay("Error removing meal. " + String(error)))
        );
    }
}

export function generateRandomWeeklyMealPlan(startDate: Date) {
    return function(dispatch: Dispatch) {
        return MealPlannerApi.generateRandomMealPlan(startDate, 7).then(
            mealPlan => dispatch(updateMealPlanLocal(mealPlan)),
            error => dispatch(setApiErrorToDisplay("Error generating weekly meal plan. " + String(error)))
        );
    }
}

export function updateMealPlanLocal(mealPlan: MealPlanEntry[]): MealPlannerActionTypes {
    return {
        type: SET_MEAL_PLAN,
        payload: mealPlan
    }
}

export function deleteMealPlanLocal(date: Date, mealNumber): MealPlannerActionTypes {
    return {
        type: DELETE_MEAL_PLAN,
        date: date,
        mealNumber: mealNumber
    }
}