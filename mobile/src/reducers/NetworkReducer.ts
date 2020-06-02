import { NetworkActionTypes, HAS_CONNECTION_TO_SERVER, hasConnectionToServer, SET_API_ERROR_TO_DISPLAY, REMOVE_DISPLAYED_ERROR } from "../actions/NetworkActions";

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
        case REMOVE_DISPLAYED_ERROR:
            return {
                ...state,
                currentError: null
            }
        default:
            return state;
    }
}