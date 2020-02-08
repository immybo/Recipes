import { DayOfWeek } from "../style/DayOfWeek";

export const SET_MEAL = "SET_MEAL";
export const REMOVE_MEAL = "REMOVE_MEAL";

interface SetMealAction {
    type: typeof SET_MEAL,
    payload: [DayOfWeek, number]
}

interface RemoveMealAction {
    type: typeof REMOVE_MEAL,
    payload: [DayOfWeek, number]
}

export type MealPlannerActionTypes = SetMealAction | RemoveMealAction;

export function setMeal(day: DayOfWeek, recipeId: number): MealPlannerActionTypes  {
    // TODO make this call something serverside
    return {
        type: SET_MEAL,
        payload: [day, recipeId]
    }
}

export function removeMeal(day: DayOfWeek, recipeId: number): MealPlannerActionTypes {
    return {
        type: REMOVE_MEAL,
        payload: [day, recipeId]
    }
}