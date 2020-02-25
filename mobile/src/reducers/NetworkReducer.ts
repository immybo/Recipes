import { NetworkActionTypes, HAS_CONNECTION_TO_SERVER, hasConnectionToServer, SET_API_ERROR_TO_DISPLAY } from "../actions/NetworkActions";

export interface NetworkState {
    hasConnectionToServer: boolean,
    currentError: string | null
}

const initialState: NetworkState = {
    hasConnectionToServer: true,
    currentError: null
}

export default function(state = initialState, action: NetworkActionTypes): NetworkState {
    switch (action.type) {
        case HAS_CONNECTION_TO_SERVER:
            return {
                ...state,
                hasConnectionToServer: action.payload
            }
        case SET_API_ERROR_TO_DISPLAY:
            return {
                ...state,
                currentError: action.payload
            }
        default:
            return state;
    }
}