import RecipeReducer from "./RecipeReducer";
import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
    recipes: RecipeReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);