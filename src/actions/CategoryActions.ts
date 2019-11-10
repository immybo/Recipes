import { Category } from "../model/Category";

export const SET_ALL_CATEGORIES = "SET_ALL_CATEGORIES";

interface SetAllCategoriesAction {
    type: typeof SET_ALL_CATEGORIES,
    payload: Category[]
}

export type CategoryActionTypes = SetAllCategoriesAction;

export function setAllCategories(allCategories: Category[]): CategoryActionTypes {
    return {
        type: SET_ALL_CATEGORIES,
        payload: allCategories
    }
}