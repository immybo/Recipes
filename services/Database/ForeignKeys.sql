ALTER TABLE dbo.RecipesToIngredients
ADD CONSTRAINT FK_RecipesToIngredients_recipeId_Recipes_recipeId FOREIGN KEY (recipeId) REFERENCES dbo.Recipes (id)

ALTER TABLE dbo.RecipesToIngredients
ADD CONSTRAINT FK_RecipesToIngredients_ingredientId_Ingredients_ingredientId FOREIGN KEY (ingredientId) REFERENCES dbo.Ingredients (id)

ALTER TABLE dbo.RecipesToCategories
ADD	CONSTRAINT FK_RecipesToCategories_recipeId_Recipes_recipeId FOREIGN KEY (recipeId) REFERENCES dbo.Recipes (id)

ALTER TABLE dbo.RecipesToCategories
ADD	CONSTRAINT FK_RecipesToCategories_categoryId_Categories_categoryId FOREIGN KEY (categoryId) REFERENCES dbo.Categories (id)

ALTER TABLE dbo.Recipes
ADD CONSTRAINT FK_Recipes_methodId_Methods_methodId FOREIGN KEY (methodId) REFERENCES dbo.Methods (methodId)

ALTER TABLE dbo.MethodSteps
ADD	CONSTRAINT FK_MethodSteps_methodId_Methods_methodId FOREIGN KEY (methodId) REFERENCES dbo.Methods (methodId)

ALTER TABLE MealPlanner.MealPlans
ADD CONSTRAINT FK_MealPlans_recipeId_Recipes_recipeId FOREIGN KEY (recipeId) REFERENCES dbo.Recipes (id)

ALTER TABLE dbo.IngredientNutrition
ADD CONSTRAINT FK_IngredientNutrition_ingredientId_Ingredients_id FOREIGN KEY (ingredientId) REFERENCES Recipes.dbo.Ingredients (id)

ALTER TABLE dbo.IngredientNutrition
ADD CONSTRAINT FK_IngredientNutrition_macronutrientsId_Macronutrients_id FOREIGN KEY (macronutrientsId) REFERENCES Recipes.dbo.Macronutrients (id)