import { NetworkActionTypes, HAS_CONNECTION_TO_SERVER, hasConnectionToServer } from "../actions/NetworkActions";

export interface NetworkState {
    hasConnectionToServer: boolean
}

const initialState: NetworkState = {
    hasConnectionToServer: true
}

export default function(state = initialState, action: NetworkActionTypes): NetworkState {
    switch (action.type) {
        case HAS_CONNECTION_TO_SERVER:
            return {
                ...state,
                hasConnectionToServer: action.payload
            }
        default:
            return state;
    }
}