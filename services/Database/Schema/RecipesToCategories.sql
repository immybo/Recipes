CREATE TABLE Recipes.dbo.RecipesToCategories (
	recipeId int NOT NULL,
	categoryId int NOT NULL,

	CONSTRAINT FK_RecipesToCategories_recipeId_Recipes_recipeId FOREIGN KEY (recipeId) REFERENCES Recipes.dbo.Recipes (id),
	CONSTRAINT FK_RecipesToCategories_categoryId_Categories_categoryId FOREIGN KEY (categoryId) REFERENCES Recipes.dbo.Categories (id),
);