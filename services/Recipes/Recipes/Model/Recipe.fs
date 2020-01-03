namespace Model

type Recipe = {
    Name: string
    Description: string
    Ingredients: IngredientWithQuantity[]
    Categories: Category[]
    Method: Method
}