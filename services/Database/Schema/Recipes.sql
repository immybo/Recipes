CREATE TABLE Recipes.dbo.Recipes (
	id int IDENTITY PRIMARY KEY,
	name varchar(64) NOT NULL,
	description varchar(1024) NOT NULL,
	methodId INT NOT NULL,

	CONSTRAINT FK_Recipes_methodId_Methods_methodId FOREIGN KEY (methodId) REFERENCES Recipes.dbo.Methods (methodId),
);