namespace Model

type Recipe = {
    Id: int
    Name: string
    Description: string
    Ingredients: Ingredient[]
    Categories: Category[]
}