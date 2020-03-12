namespace DataAccess

open FSharp.Data

module Database =
    [<Literal>]
    let compileTimeConnectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=" + __SOURCE_DIRECTORY__ + @"\..\..\..\Database\Recipes.mdf;Integrated Security=True;database=Recipes_Metadata";
    let realConnectionString = "Data Source=(LocalDB)\MSSQLLocalDB;Integrated Security=True;database=Recipes"