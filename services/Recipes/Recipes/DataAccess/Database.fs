namespace DataAccess

open Model.Recipe
open FSharp.Data.Sql

module Database =
    type sql = SqlDataProvider<
                Common.DatabaseProviderTypes.MSSQLSERVER,
                "Server=(LocalDb)\MSSQLLocalDB;Database=Recipes;Trusted_Connection=True;">

    let context = sql.GetDataContext()