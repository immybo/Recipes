export interface Method {
    steps: string[]
}

export function getEmptyMethod(): Method {
    return {
        steps: []
    };
}