namespace DataAccess

open Model
open FSharp.Data.Sql
open FSharp.Data.Sql.Transactions
open System

module Database =
    type sql = SqlDataProvider<
                Common.DatabaseProviderTypes.MSSQLSERVER,
                "Server=(LocalDb)\MSSQLLocalDB;Database=Recipes;Trusted_Connection=True;">

    let realConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings.["DB"].ConnectionString;

    let context = sql.GetDataContext(realConnectionString, {
        Timeout = TimeSpan.MaxValue;
        IsolationLevel = Transactions.IsolationLevel.DontCreateTransaction;
    })