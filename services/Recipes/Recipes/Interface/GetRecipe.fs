module GetRecipe

open Model.Recipe

let getRecipe id : Option<Recipe> =
    GetRecipeImpl.getRecipe(id)