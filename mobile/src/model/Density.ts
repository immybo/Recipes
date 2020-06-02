import { Quantity } from "./Quantity";
import { QuantityUnit } from "./QuantityUnit";

export interface Density {
    equivalentByWeight: Quantity,
    equivalentByVolume: Quantity
}

export function getDefaultDensity(): Density {
    return {
        equivalentByVolume: {
            amount: 1,
            unit: QuantityUnit.Cups
        },
        equivalentByWeight: {
            amount: 100,
            unit: QuantityUnit.Grams
        }
    };
}