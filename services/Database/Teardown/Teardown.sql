IF EXISTS (SELECT TOP 1 1 FROM master.dbo.sysdatabases WHERE name = 'Recipes')
BEGIN
	ALTER DATABASE Recipes SET SINGLE_USER WITH ROLLBACK IMMEDIATE
	DROP DATABASE Recipes
END
