import { LoadingType, LoadingActionTypes, BEGIN_LOADING, END_LOADING } from "../actions/LoadingActions";

export class LoadingState {
    currentlyLoading?: Set<LoadingType>
}

const initialState: LoadingState = {
    currentlyLoading: new Set<LoadingType>()
}

export default function(state = initialState, action: LoadingActionTypes): LoadingState {
    if (state.currentlyLoading == null) return state;

    switch (action.type) {
        case BEGIN_LOADING:
            return {
                ...state,
                currentlyLoading: state.currentlyLoading.has(action.loadingType) ? state.currentlyLoading : state.currentlyLoading.add(action.loadingType)
            }
        case END_LOADING:
            if (state.currentlyLoading.has(action.loadingType)) {
                state.currentlyLoading.delete(action.loadingType);
            }

            return state;
        default:
            return state;
    }
}