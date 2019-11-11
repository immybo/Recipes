export interface Category {
    id: number,
    name: string
}

export interface CategoryState {
    allCategories: Category[]
}

export function getBlankCategory(): Category {
    return {
        id: getUniqueCategoryId(),
        name: "",
    };
}

var nextUniqueId: number = 0;

export function getUniqueCategoryId(): number{
    return nextUniqueId++;
}