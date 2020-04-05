import { MealPlannerActionTypes, SET_MEAL_PLAN, DELETE_MEAL_PLAN } from "../actions/MealPlannerActions";
import { MealPlanEntry } from "../model/MealPlanEntry";

export interface MealPlannerState {
    mealPlan: MealPlanEntry[]
}

const initialState: MealPlannerState = {
    mealPlan: []
}

export default function(state = initialState, action: MealPlannerActionTypes): MealPlannerState {
    switch (action.type) {
        case SET_MEAL_PLAN:
            let newPlan: MealPlanEntry[] = state.mealPlan;
            let newPlanDict: { [date: string] : MealPlanEntry } = {};

            newPlan.forEach(entry => {
                newPlanDict[entry.date.toString()] = entry;
            });

            action.payload.forEach(entry => {
                newPlanDict[entry.date.toString()] = entry;
            });

            newPlan = Object.entries(newPlanDict).map(([_, value]) => value);

            return {
                ...state,
                mealPlan: newPlan
            }
        case DELETE_MEAL_PLAN:
            let planWithDeletedEntry: MealPlanEntry[] = state.mealPlan.filter(entry => +entry.date != +action.payload);
            return {
                ...state,
                mealPlan: planWithDeletedEntry
            }
        default:
            return state;
    }
}