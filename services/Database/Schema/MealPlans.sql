CREATE TABLE MealPlanner.MealPlans (
	userId int NOT NULL,
	[date] date NOT NULL,
	mealNumber int NOT NULL,
	recipeId int NOT NULL,

	CONSTRAINT UNIQUE_userID_date_mealNumber UNIQUE CLUSTERED (userId, [date], mealNumber)
);