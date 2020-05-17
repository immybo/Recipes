CREATE TABLE dbo.IngredientNutrition (
	ingredientId int NOT NULL UNIQUE,
	gramsPerCup decimal(13, 4) NOT NULL,
	macronutrientsId int NOT NULL,
	servingSizeQuantity decimal(13, 4) NOT NULL,
	servingSizeUnit int NOT NULL
);