CREATE TABLE dbo.Recipes (
	id int IDENTITY PRIMARY KEY,
	name varchar(64) NOT NULL,
	description varchar(1024) NOT NULL,
	methodId INT NOT NULL,
	numberOfServings INT NOT NULL DEFAULT(1)
);