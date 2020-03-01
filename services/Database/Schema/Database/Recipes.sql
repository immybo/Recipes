IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE Name = 'MealPlanner')
BEGIN
	EXEC('CREATE SCHEMA MealPlanner')
END