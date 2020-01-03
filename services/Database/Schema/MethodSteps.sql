CREATE TABLE Recipes.dbo.MethodSteps (
	methodId INT NOT NULL,
	stepNumber INT NOT NULL,
	description VARCHAR(500) NOT NULL,

	PRIMARY KEY (methodId, stepNumber),
	CONSTRAINT FK_MethodSteps_methodId_Methods_methodId FOREIGN KEY (methodId) REFERENCES Recipes.dbo.Methods (methodId),
);