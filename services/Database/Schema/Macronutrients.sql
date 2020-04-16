CREATE TABLE dbo.Macronutrients (
	ingredientId int NOT NULL UNIQUE,
	caloriesPerServing decimal(14, 4) NOT NULL,
	proteinGramsPerServing decimal(14, 4) NOT NULL,
	carbGramsPerServing decimal(14, 4) NOT NULL,
	fatGramsPerServing decimal(14, 4) NOT NULL,
	quantity decimal(14, 4) NOT NULL,
	quantityUnit int NOT NULL,
);