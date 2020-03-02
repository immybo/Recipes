CREATE TABLE dbo.RecipesToIngredients (
	recipeId int NOT NULL,
	ingredientId int NOT NULL,
	quantity decimal(13, 4) NOT NULL,
	quantityUnit int NOT NULL,
);