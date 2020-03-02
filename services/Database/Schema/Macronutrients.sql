CREATE TABLE dbo.Macronutrients (
	ingredientId int NOT NULL UNIQUE,
	caloriesPerKilo decimal(10, 4) NOT NULL,
	proteinMassPercentage decimal(7, 4) NOT NULL,
	carbMassPercentage decimal(7, 4) NOT NULL,
	fatMassPercentage decimal(7, 4) NOT NULL
);