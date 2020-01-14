CREATE TABLE Recipes.dbo.RecipesToIngredients (
	recipeId int NOT NULL,
	ingredientId int NOT NULL,
	quantity decimal(13, 4) NOT NULL,

	CONSTRAINT FK_RecipesToIngredients_recipeId_Recipes_recipeId FOREIGN KEY (recipeId) REFERENCES Recipes.dbo.Recipes (id),
	CONSTRAINT FK_RecipesToIngredients_ingredientId_Ingredients_ingredientId FOREIGN KEY (ingredientId) REFERENCES Recipes.dbo.Ingredients (id)
);