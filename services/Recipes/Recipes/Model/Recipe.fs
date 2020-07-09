namespace Model

type Recipe = {
    Id: int
    Name: string
    Description: string
    Ingredients: IngredientWithQuantity[]
    Categories: Category[]
    Method: Method
    NumberOfServings: int
}