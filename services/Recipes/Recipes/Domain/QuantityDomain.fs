module QuantityDomain

open Model
open Railway

let isVolume (unit: QuantityUnit) : bool =
    let volumeUnits = [ QuantityUnit.Cups; QuantityUnit.Litres; QuantityUnit.Millilitres; QuantityUnit.Teaspoons; QuantityUnit.Tablespoons ]
    List.contains unit volumeUnits

let isWeight (unit: QuantityUnit): bool = not (isVolume unit)

let areCompatibleUnits unit1 unit2 : bool =
    if (isVolume unit1 <> isVolume unit2) then
        false
    else if (unit1.Equals(QuantityUnit.None) && unit2.Equals(QuantityUnit.None)) then
        false
    else
        true

let getUnitConstant unit : decimal =
    // Where should we actually define this?
    match unit with 
    | QuantityUnit.Millilitres -> 1m
    | QuantityUnit.Teaspoons -> 5m
    | QuantityUnit.Tablespoons -> 15m // 20 in Australia
    | QuantityUnit.Cups -> 250m // 284.1 in the UK
    | QuantityUnit.Litres -> 1000m

    // Weight measures... really these should be 2 separate paths
    | QuantityUnit.Grams -> 1m;
    | QuantityUnit.Kilograms -> 1000m;

    // Should never be called but should be enforced by typing
    | QuantityUnit.None -> -1m;

let convertToUnit newUnit quantity : Result<Quantity, Error> =
    match areCompatibleUnits quantity.Unit newUnit with
    | false -> Result.Error Error.IncompatibleUnits
    | true ->
        let unitRatio = (getUnitConstant newUnit) / (getUnitConstant quantity.Unit)
        Result.Ok {
            Amount = unitRatio * quantity.Amount
            Unit = newUnit
        }

let multiplyQuantity quantity factor : Result<Quantity, Error> =
    Result.Ok { quantity with Amount = quantity.Amount * factor }

let getRatioBetweenQuantitiesOfSameType quantity1 quantity2 : Result<decimal, Error> =
    match quantity2.Amount with
    | 0m -> Result.Error Error.ZeroValueProvided
    | _ ->
        match areCompatibleUnits quantity1.Unit quantity2.Unit with
        | false -> Result.Error Error.IncompatibleUnits
        | true -> Result.Ok (((getUnitConstant quantity1.Unit) * quantity1.Amount) / ((getUnitConstant quantity2.Unit) * quantity2.Amount))
    
let toGramsPerCup (density: Density) : Result<decimal, Error> =
    let oneCup = { Amount = 1m; Unit = QuantityUnit.Cups }
        
    getRatioBetweenQuantitiesOfSameType oneCup density.EquivalentByVolume
    >=> multiplyQuantity density.EquivalentByWeight
    >=> convertToUnit QuantityUnit.Grams
    >=> fun quantity -> Result.Ok quantity.Amount
    
let convertToVolumeQuantity (quantity: Quantity, density: Density) : Result<Quantity, Error> =
    if isVolume quantity.Unit then
        Result.Ok quantity
    else
        toGramsPerCup density
        >=> fun ratio -> Result.Ok { Amount = quantity.Amount / ratio; Unit = QuantityUnit.Cups }

let convertToWeightQuantity (quantity: Quantity, density: Density) : Result<Quantity, Error> =
    if not (isVolume quantity.Unit) then
        Result.Ok quantity
    else
        toGramsPerCup density
        >=> fun ratio -> Result.Ok { Amount = quantity.Amount * ratio; Unit = QuantityUnit.Grams }

let getRatioBetweenQuantities (quantity1: Quantity, quantity1Density: Density, quantity2: Quantity): Result<decimal, Error> =
    if isVolume quantity1.Unit && isWeight quantity2.Unit then
        convertToWeightQuantity (quantity1, quantity1Density)
        >=> fun q1 -> getRatioBetweenQuantitiesOfSameType q1 quantity2
    elif isWeight quantity1.Unit && isVolume quantity2.Unit then
        convertToVolumeQuantity (quantity1, quantity1Density)
        >=> fun q1 -> getRatioBetweenQuantitiesOfSameType q1 quantity2
    else
        getRatioBetweenQuantitiesOfSameType quantity1 quantity2