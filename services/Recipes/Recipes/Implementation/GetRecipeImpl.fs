module GetRecipeImpl

open Model.Recipe

let getRecipe id : Recipe =
    DataAccess.RecipeDataAccess.getRecipeById(id)