namespace Model

type Recipe = {
    Name: string
    Description: string
    Ingredients: Ingredient[]
    Categories: Category[]
    Method: Method
}