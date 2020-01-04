namespace Model

open System

type Error =
    | RecipeDoesNotExist
    | CategoryDoesNotExist
    | IngredientDoesNotExist
    | MethodDoesNotExist
    | ExpectedExactlyOne