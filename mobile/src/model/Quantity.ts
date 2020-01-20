import { QuantityUnit } from "./QuantityUnit";

export interface Quantity {
    unit: QuantityUnit
    amount: number
}