module QuantityDomain

open Model

let areCompatibleUnits unit1 unit2 : bool =
    // TODO how do we reconcile the difference between a weight and a volume?
    // we could use density to convert in between.
    // Hmm maybe have volume/weight be two separate objects joined in a discriminated union so we can easily separate
    let volumeUnits = [ QuantityUnit.Cups; QuantityUnit.Litres; QuantityUnit.Millilitres; QuantityUnit.Teaspoons; QuantityUnit.Tablespoons ]
    
    if (List.contains unit1 volumeUnits <> List.contains unit2 volumeUnits) then
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

let getRatioBetweenQuantities quantity1 quantity2 : Result<decimal, Error> =
    match quantity2.Amount with
    | 0m -> Result.Error Error.ZeroValueProvided
    | _ ->
        match areCompatibleUnits quantity1.Unit quantity2.Unit with
        | false -> Result.Error Error.IncompatibleUnits
        | true -> Result.Ok (((getUnitConstant quantity1.Unit) * quantity1.Amount) / ((getUnitConstant quantity2.Unit) * quantity2.Amount))