export interface Method {
    id: number
    steps: string[]
}

export function getEmptyMethod(): Method {
    return {
        id: -1,
        steps: []
    };
}