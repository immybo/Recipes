import RecipeReducer from "./RecipeReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import CategoryReducer from "./CategoryReducer";
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    recipes: RecipeReducer,
    categories: CategoryReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(thunk));