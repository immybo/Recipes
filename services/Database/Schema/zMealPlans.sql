CREATE TABLE Recipes.MealPlanner.MealPlans (
	userId int,
	[date] date,
	mealNumber int,
	recipeId int,

	CONSTRAINT UNIQUE_userID_date_mealNumber UNIQUE CLUSTERED (userId, [date], mealNumber),
	CONSTRAINT FK_MealPlans_recipeId_Recipes_recipeId FOREIGN KEY (recipeId) REFERENCES Recipes.dbo.Recipes (id),
);