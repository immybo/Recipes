module GetRecipeImpl

open Model.Recipe

let getRecipe id : Option<Recipe> =
    DataAccess.RecipeDataAccess.getRecipeById(id)