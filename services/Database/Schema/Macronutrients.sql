CREATE TABLE dbo.Macronutrients (
	ingredientId int NOT NULL UNIQUE,
	caloriesPerServing decimal(10, 4) NOT NULL,
	proteinGramsPerServing decimal(7, 4) NOT NULL,
	carbGramsPerServing decimal(7, 4) NOT NULL,
	fatGramsPerServing decimal(7, 4) NOT NULL,
	quantity decimal(13, 4) NOT NULL,
	quantityUnit int NOT NULL,
);