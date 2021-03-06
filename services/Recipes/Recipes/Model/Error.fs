﻿namespace Model
    
type Error =
    | RecipeDoesNotExist = 1
    | CategoryDoesNotExist = 2
    | IngredientDoesNotExist = 3
    | ExpectedExactlyOne = 5
    | NoNutritionalInformationForIngredient = 6
    | RequiredParameter = 7
    | IncompatibleUnits = 10
    | ZeroValueProvided = 11
    | IngredientIsUsedByARecipe = 12