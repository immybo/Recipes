CREATE TABLE MealPlanner.MealPlans (
	userId int,
	[date] date,
	mealNumber int,
	recipeId int,

	CONSTRAINT UNIQUE_userID_date_mealNumber UNIQUE CLUSTERED (userId, [date], mealNumber)
);