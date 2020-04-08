module AddNutritionalInformationForIngredient

open Model

let addNutritionalInformationForIngredient nutritionalInformation : Result<int, Error> =
    NutritionalInformationDomain.setNutritionalInformationForIngredient nutritionalInformation
    