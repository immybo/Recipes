module GetNutritionalInformationForIngredients

open Model

let getNutritionalInformationForIngredients (ingredientIds: int[]) : Result<NutritionalInformation[], Error> =
    NutritionalInformationDomain.getNutritionalInformationForIngredients ingredientIds