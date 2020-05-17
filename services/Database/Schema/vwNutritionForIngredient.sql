CREATE VIEW dbo.vwNutritionForIngredient AS

SELECT ingredientId, gramsPerCup, macronutrientsId, servingSizeQuantity, servingSizeUnit, calories, proteinGrams, carbGrams, fatGrams
FROM dbo.IngredientNutrition
	INNER JOIN dbo.Macronutrients ON IngredientNutrition.MacronutrientsId = Macronutrients.Id