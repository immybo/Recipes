const SERVER_IP = "http://10.0.2.2:52354"

export enum HttpMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE"
}

export function callApi<PayloadType, ReturnType>(endpoint: string, method: HttpMethod, parse: (json: any) => ReturnType, payload?: PayloadType): Promise<ReturnType> {
    return callApiRaw(endpoint, method, payload)
        .then(
            response => response.json(),
            error => Promise.reject(error)
        )
        .then(
            json => parse(json),
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
