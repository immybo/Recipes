module GetRecipe

open Model.Recipe

let getRecipe id : Recipe =
    GetRecipeImpl.getRecipe(id)