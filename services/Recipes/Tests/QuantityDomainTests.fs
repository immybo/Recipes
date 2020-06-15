namespace Tests

open NUnit.Framework
open Model
open QuantityDomain

module QuantityDomainTests =
    let VolumeQuantity: Quantity = {
        Amount = 30m
        Unit = QuantityUnit.Cups
    }

    let WeightQuantity: Quantity = {
        Amount = 6m
        Unit = QuantityUnit.Grams
    }

    let TablespoonQuantity: Quantity = {
        Amount = 1m
        Unit = QuantityUnit.Tablespoons
    }

    let Density: Density = {
        EquivalentByVolume = {
            Amount = 10m
            Unit = QuantityUnit.Cups
        }
        EquivalentByWeight = {
            Amount = 1m
            Unit = QuantityUnit.Grams
        }
    }

    [<Test>]
    let Density_Is_Correctly_Converted_To_Grams_Per_Cup () =
        let conversionResult = toGramsPerCup Density
        match conversionResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok gramsPerCup -> Assert.AreEqual (0.1m, gramsPerCup)
    
    [<Test>]
    let Density_With_Incorrect_Type_Of_Quantities_Is_Rejected () =
        let invalidDensity: Density = {
            EquivalentByVolume = {
                Amount = 10m
                Unit = QuantityUnit.Grams
            }
            EquivalentByWeight = {
                Amount = 1m
                Unit = QuantityUnit.Cups
            }
        }

        let conversionResult = toGramsPerCup invalidDensity
        match conversionResult with
        | Result.Error Error.IncompatibleUnits -> ()
        | _ -> Assert.Fail ("Attempting to use a density with invalid units should have failed with IncompatibleUnits error.")

    [<Test>]
    let Quantity_With_Density_Is_Converted_Correctly_From_Weight_To_Volume () =
        let ratioResult = getRatioBetweenQuantities (VolumeQuantity, Density, WeightQuantity)
        match ratioResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok ratio -> Assert.AreEqual (0.5m, ratio)

    [<Test>]
    let Quantity_With_Density_Is_Converted_Correctly_From_Volume_To_Weight () =
        let ratioResult = getRatioBetweenQuantities (WeightQuantity, Density, VolumeQuantity)
        match ratioResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok ratio -> Assert.AreEqual (2m, ratio)
    
    [<Test>]
    let Quantity_In_Tablespoons_With_Density_Is_Converted_Correctly_From_Weight_To_Volume () =
        let ratioResult = getRatioBetweenQuantities (TablespoonQuantity, Density, WeightQuantity)
        match ratioResult with
        | Result.Error err -> Assert.Fail (err.ToString())
        | Result.Ok ratio -> Assert.AreEqual (0.001m, ratio)