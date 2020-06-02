export interface MacronutrientInformation {
    calories: number,
    proteinGrams: number,
    fatGrams: number,
    carbGrams: number
}

export function getDefaultMacronutrientInformation(): MacronutrientInformation {
    return {
        calories: 0,
        proteinGrams: 0,
        fatGrams: 0,
        carbGrams: 0
    }
}