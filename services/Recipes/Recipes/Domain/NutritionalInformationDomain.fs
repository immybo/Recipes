module NutritionalInformationDomain

open Model
open Railway

let multiplyNutrition macronutrientInformation factor =
    Result.Ok {
        Calories = macronutrientInformation.Calories * factor;
        CarbGrams = macronutrientInformation.CarbGrams * factor;
        ProteinGrams = macronutrientInformation.ProteinGrams * factor;
        FatGrams = macronutrientInformation.FatGrams * factor;
    }

let sumNutrition nutritionList =
    // We don't sum the serving size here; we leave that out... indicating as above that serving size shouldn't be part of macronutrients; these shouldn't be per serving TODO
    // so it should be a nutritionalinformation = calories,carbs,protein,fat, and an extra object above to link that to a serving size for use in a recipe or an ingredient
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

let toGramsPerCup (density: Density) : Result<decimal, Error> =
    // TODO move all the util stuff here out of the domain, which should just orchestrate the dal
    let oneCup = { Amount = 1m; Unit = QuantityUnit.Cups }
    
    QuantityDomain.getRatioBetweenQuantities density.EquivalentByVolume oneCup
    >=> QuantityDomain.multiplyQuantity density.EquivalentByWeight
    >=> QuantityDomain.convertToUnit QuantityUnit.Grams
    >=> fun quantity -> Result.Ok quantity.Amount