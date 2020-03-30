import { ServerError } from "./api/ServerError";

//const SERVER_IP = "http://10.0.2.2:8080"
const SERVER_IP = "http://13.77.60.116:8080"

export enum HttpMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE"
}

export enum HttpStatus {
    SERVER_ERROR = 500,
    OK = 200
}

export function callApi<PayloadType, ReturnType>(endpoint: string, method: HttpMethod, parse: (json: any) => ReturnType, payload?: PayloadType): Promise<ReturnType> {
    return callApiRaw(endpoint, method, payload)
        .then(
            response => handleResponse(response, parse),
            error => Promise.reject(error)
        );
}

function handleResponse<ReturnType>(response: Response, parse: (json: any) => ReturnType): Promise<ReturnType> {
    switch (response.status) {
        case HttpStatus.OK:
            return handleOkResponse(response, parse);
        case HttpStatus.SERVER_ERROR:
            return handleErrorResponse(response);
        default:
            return Promise.reject("Unrecognised response code " + response.status.toString());
    }
}

function handleOkResponse<ReturnType>(response: Response, parse: (json: any) => ReturnType): Promise<ReturnType> {
    return response.json()
        .then(
            json => parse(json),
            error => Promise.reject(error)
        );
}

function handleErrorResponse<ReturnType>(response: Response): Promise<ReturnType> {
    // The server always returns an int response code, which should correspond to our Error enum
    return response.json()
        .then(
            json => Promise.reject((parseInt(json) as ServerError)),
            // Ironic
            error => Promise.reject(error)
        );
}

export function callApiRaw(endpoint: string, method: HttpMethod, payload?: any): Promise<Response> {
    if (payload == null) {
        return fetch(SERVER_IP+"/"+endpoint, { method: method });
    } else {
        return fetch(SERVER_IP+"/"+endpoint, { method: method, body: payload });
    }
}
