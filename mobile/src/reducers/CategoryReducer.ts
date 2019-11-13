import { CategoryState } from "../model/Category";
import { SET_ALL_CATEGORIES } from "../actions/CategoryActions";

const initialState: CategoryState = {
    allCategories: []
}

export default function(state = initialState, action: any) {
    switch (action.type) {
        case SET_ALL_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        default:
            return state;
    }
}