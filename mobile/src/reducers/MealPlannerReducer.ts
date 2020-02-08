import { DayOfWeek } from "../style/DayOfWeek";
import { MealPlannerActionTypes, SET_MEAL, REMOVE_MEAL } from "../actions/MealPlannerActions";

export interface MealPlannerState {
    weeklyPlan: Record<DayOfWeek, number>
}

const initialState: MealPlannerState = {
    weeklyPlan: {} as Record<DayOfWeek, number>
}

export default function(state = initialState, action: MealPlannerActionTypes): MealPlannerState {
    switch (action.type) {
        case SET_MEAL:
            let newPlan: Record<DayOfWeek, number> = { ...state.weeklyPlan };
            newPlan[action.payload[0]] = action.payload[1];

            return {
                ...state,
                weeklyPlan: newPlan
            }
        case REMOVE_MEAL:
            let planWithMealRemoved: Record<DayOfWeek, number> = { ...state.weeklyPlan };
            delete planWithMealRemoved[action.payload[0]]
            
            return {
                ...state,
                weeklyPlan: planWithMealRemoved
            }
        default:
            return state;
    }
}