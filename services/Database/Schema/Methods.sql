CREATE TABLE Recipes.dbo.Methods (
	methodId INT NOT NULL,
	stepNumber INT NOT NULL,
	description VARCHAR(500) NOT NULL,

	PRIMARY KEY (methodId, stepNumber)
);