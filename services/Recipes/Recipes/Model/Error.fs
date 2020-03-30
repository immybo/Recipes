namespace Model

open System

type Error =
    | RecipeDoesNotExist = 1
    | CategoryDoesNotExist = 2
    | IngredientDoesNotExist = 3
    | MethodDoesNotExist = 4
    | ExpectedExactlyOne = 5
    | NoNutritionalInformationForIngredient = 6
    | RequiredParameter = 7
    | MethodMustNotBeEmpty = 8
    | RecipeMustHaveDescription = 9