CREATE TABLE dbo.Macronutrients (
	id int NOT NULL PRIMARY KEY IDENTITY(1,1),
	calories decimal(14, 4) NOT NULL,
	proteinGrams decimal(14, 4) NOT NULL,
	carbGrams decimal(14, 4) NOT NULL,
	fatGrams decimal(14, 4) NOT NULL
);