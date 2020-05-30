export const BEGIN_LOADING = "BEGIN_LOADING";
export const END_LOADING = "END_LOADING";

export enum LoadingType {
    Generic,
    InitialState,
    SubmitIngredient,
    SubmitRecipe
}

interface BeginLoadingAction {
    type: typeof BEGIN_LOADING,
    loadingType: LoadingType
}

interface EndLoadingAction {
    type: typeof END_LOADING,
    loadingType: LoadingType
}

export type LoadingActionTypes = BeginLoadingAction | EndLoadingAction;

export function beginLoading(type: LoadingType): LoadingActionTypes {
    return {
        type: BEGIN_LOADING,
        loadingType: type
    };
}

export function endLoading(type: LoadingType): LoadingActionTypes {
    return {
        type: END_LOADING,
        loadingType: type
    };
}