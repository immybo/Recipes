export const HAS_CONNECTION_TO_SERVER = "HAS_CONNECTION_TO_SERVER";

interface HasConnectionToServerAction {
    type: typeof HAS_CONNECTION_TO_SERVER,
    payload: boolean
}

export type NetworkActionTypes = HasConnectionToServerAction;

export function hasConnectionToServer(hasConnection: boolean): NetworkActionTypes  {
    return {
        type: HAS_CONNECTION_TO_SERVER,
        payload: hasConnection
    }
}