import RecipeReducer from "./RecipeReducer";
import { combineReducers, createStore } from "redux";
import CategoryReducer from "./CategoryReducer";

const rootReducer = combineReducers({
    recipes: RecipeReducer,
    categories: CategoryReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);