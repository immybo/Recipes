import RecipeReducer from "./RecipeReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import CategoryReducer from "./CategoryReducer";
import thunk from 'redux-thunk';
import NetworkReducer from "./NetworkReducer";
import IngredientReducer from "./IngredientReducer";
import MealPlannerReducer from "./MealPlannerReducer";
import LoadingReducer from "./LoadingReducer";

const rootReducer = combineReducers({
    recipes: RecipeReducer,
    categories: CategoryReducer,
    network: NetworkReducer,
    ingredients: IngredientReducer,
    mealPlanner: MealPlannerReducer,
    loadingState: LoadingReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(thunk));