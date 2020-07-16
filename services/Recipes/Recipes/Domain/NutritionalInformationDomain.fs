module NutritionalInformationDomain

open Model

let multiplyNutrition macronutrientInformation factor =
    Result.Ok {
        Calories = macronutrientInformation.Calories * factor;
        CarbGrams = macronutrientInformation.CarbGrams * factor;
        ProteinGrams = macronutrientInformation.ProteinGrams * factor;
        FatGrams = macronutrientInformation.FatGrams * factor;
    }

let sumNutrition nutritionList =
    let folder = fun nutrition next ->
        {
            Calories = nutrition.Calories + next.Calories;
            CarbGrams = nutrition.CarbGrams + next.CarbGrams;
            FatGrams = nutrition.FatGrams + next.FatGrams;
            ProteinGrams = nutrition.ProteinGrams + next.ProteinGrams;
        }

    Seq.fold folder ({
        Calories = 0m;
        CarbGrams = 0m;
        FatGrams = 0m;
        ProteinGrams = 0m;
    }) nutritionList
    |> Result.Ok
