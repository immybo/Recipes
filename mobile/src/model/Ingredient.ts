export interface Ingredient {
    id: number,
    name: string
}

export function getBlankIngredient(): Ingredient {
    return {
        id: -1,
        name: ""
    };
}