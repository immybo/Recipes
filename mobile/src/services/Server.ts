import { Dispatch } from "redux";
import { hasConnectionToServer } from "../actions/NetworkActions";

const SERVER_IP = "http://10.0.2.2:52354"
const MAX_RETRIES = 1

export enum HttpMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE"
}

export async function callApiAsync(endpoint: string, method: HttpMethod, dispatch: Dispatch, payload?: any): Promise<Response> {
    let numRetries: number = 0;

    // Not sure if we actually need to retry here. Presumably fetch already does something like this.
    while (numRetries < MAX_RETRIES) {
        try {
            let response: Response = await fetch(SERVER_IP+"/"+endpoint, { method: method, body: payload });
            dispatch(hasConnectionToServer(true));
            return response;
        } catch (networkException) {
        }

        numRetries++;
    }

    dispatch(hasConnectionToServer(false));

    return Promise.reject("Unable to establish network connection.");
}

export function callApi(endpoint: string, method: HttpMethod, payload?: any): Promise<Response> {

    // TODO make this function typed, maybe have an API interface
    // TODO make this function take a parser
    // TODO make errors typed

    return fetch(SERVER_IP+"/"+endpoint, { method: method, body: payload });
}