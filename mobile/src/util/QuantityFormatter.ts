import { QuantityUnit } from '../model/QuantityUnit';
import { Quantity } from '../model/Quantity';

export class QuantityFormatter {
    public static formatShorthand(quantity: Quantity): string {
        return quantity.amount.toString() + this.formatUnitShorthand(quantity.unit)
    }

    public static format(quantity: Quantity): string {
        return quantity.amount.toString() + this.formatUnit(quantity.unit, quantity.amount !== 1)
    }

    public static formatUnitShorthand(unit: QuantityUnit): string {
        switch (unit) {
            case QuantityUnit.None:
                return ""
            case QuantityUnit.Cups:
                return "c"
            case QuantityUnit.Grams:
                return "g"
            case QuantityUnit.Kilograms:
                return "kg"
            case QuantityUnit.Teaspoons:
                return "tsp"
            case QuantityUnit.Litres:
                return "L"
            case QuantityUnit.Millilitres:
                return "mL"
            case QuantityUnit.Tablespoons:
                return "Tbsp"
        }
    }

    public static formatUnit(unit: QuantityUnit, isPlural: boolean): string {
        switch (unit) {
            case QuantityUnit.None:
                return "(no unit)"
            case QuantityUnit.Cups:
                return isPlural ? " cups" : " cup"
            case QuantityUnit.Grams:
                return isPlural ? " grams" : " gram"
            case QuantityUnit.Kilograms:
                return isPlural ? " kilograms" : " kilogram"
            case QuantityUnit.Teaspoons:
                return isPlural ? " teaspoons" : " teaspoon"
            case QuantityUnit.Litres:
                return isPlural ? " litres" : "litre"
            case QuantityUnit.Millilitres:
                return isPlural ? " millilitres" : " millilitre"
            case QuantityUnit.Tablespoons:
                return isPlural ? " tablespoons" : " tablespoon"
        }
    }
}