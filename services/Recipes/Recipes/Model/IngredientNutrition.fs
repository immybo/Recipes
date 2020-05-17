namespace Model

type IngredientNutrition = {
    IngredientId: int
    Density: Density
    ServingSize: Quantity
    MacronutrientsPerServing: MacronutrientInformation
}