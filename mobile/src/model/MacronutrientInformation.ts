import { Quantity } from "./Quantity";

export interface MacronutrientInformation {
    caloriesPerServing: number,
    servingSize: Quantity,
    proteinGramsPerServing: number,
    fatGramsPerServing: number,
    carbGramsPerServing: number
}