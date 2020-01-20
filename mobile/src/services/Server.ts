const SERVER_IP = "http://localhost:52354"

export enum HttpMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE"
}

export function callApi(endpoint: string, method: HttpMethod, payload?: any): Promise<Response> {

    // TODO make this function typed, maybe have an API interface
    // TODO make this function take a parser
    // TODO make errors typed

    return fetch(SERVER_IP+"/"+endpoint, { method: method, body: payload });
}