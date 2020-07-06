import { MealPlannerActionTypes, SET_MEAL_PLAN, DELETE_MEAL_PLAN } from "../actions/MealPlannerActions";
import { MealPlanEntry } from "../model/MealPlanEntry";
import { datesEqual } from "../util/DateUtils";

export interface MealPlannerState {
    mealPlan: MealPlanEntry[]
}

const initialState: MealPlannerState = {
    mealPlan: []
}

export default function(state = initialState, action: MealPlannerActionTypes): MealPlannerState {
    switch (action.type) {
        case SET_MEAL_PLAN:
            let newPlan: MealPlanEntry[] = [...state.mealPlan];

            newPlan = newPlan.filter(entry => !action.payload.some(newEntry => datesEqual(entry.date, newEntry.date) && entry.mealNumber === newEntry.mealNumber));
            action.payload.forEach(newEntry => newPlan.push(newEntry));

            return {
                ...state,
                mealPlan: newPlan
            }
        case DELETE_MEAL_PLAN:
            let planWithDeletedEntry: MealPlanEntry[] = state.mealPlan.filter(entry => !datesEqual(entry.date, action.date) || entry.mealNumber !== action.mealNumber);
            return {
                ...state,
                mealPlan: planWithDeletedEntry
            }
        default:
            return state;
    }
}