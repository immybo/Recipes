import { MacronutrientInformation } from "./MacronutrientInformation";

export interface MacronutrientPercentages {
    percentProtein: number,
    percentFat: number,
    percentCarbs: number
}

export function fromMacronutrientInformation(info: MacronutrientInformation): MacronutrientPercentages {
    return {
        percentCarbs: (info.carbGrams * 4) / info.calories * 100,
        percentFat: (info.fatGrams * 9) / info.calories * 100,
        percentProtein: (info.proteinGrams * 4) / info.calories * 100
    }
}