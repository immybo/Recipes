import RecipeReducer from "./RecipeReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import CategoryReducer from "./CategoryReducer";
import thunk from 'redux-thunk';
import NetworkReducer from "./NetworkReducer";

const rootReducer = combineReducers({
    recipes: RecipeReducer,
    categories: CategoryReducer,
    network: NetworkReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(thunk));