export const HAS_CONNECTION_TO_SERVER = "HAS_CONNECTION_TO_SERVER";
export const SET_API_ERROR_TO_DISPLAY = "SET_API_ERROR_TO_DISPLAY";
export const REMOVE_DISPLAYED_ERROR = "REMOVE_DISPLAYED_ERROR";

interface HasConnectionToServerAction {
    type: typeof HAS_CONNECTION_TO_SERVER,
    payload: boolean
}

interface SetApiErrorToDisplayAction {
    type: typeof SET_API_ERROR_TO_DISPLAY,
    payload: string
}

interface RemoveDisplayedErrorAction {
    type: typeof REMOVE_DISPLAYED_ERROR
}

export type NetworkActionTypes = HasConnectionToServerAction | SetApiErrorToDisplayAction | RemoveDisplayedErrorAction;

export function hasConnectionToServer(hasConnection: boolean): NetworkActionTypes  {
    return {
        type: HAS_CONNECTION_TO_SERVER,
        payload: hasConnection
    }
}

export function setApiErrorToDisplay(error: string): NetworkActionTypes {
    return {
        type: SET_API_ERROR_TO_DISPLAY,
        payload: error
    }
}

export function removeDisplayedError(): NetworkActionTypes {
    return {
        type: REMOVE_DISPLAYED_ERROR
    }
}