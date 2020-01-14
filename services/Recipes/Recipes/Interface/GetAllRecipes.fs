module GetAllRecipes

open Model

let getAllRecipes () : Result<Recipe[], Error> =
    RecipeDomain.getAllRecipes ()