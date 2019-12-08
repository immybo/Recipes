namespace DataAccess

open FSharp.Data.Sql
open Model

module MethodDataAccess =
    let mapToMethod (methodSteps: Database.sql.dataContext.``dbo.MethodsEntity``[]) : Method = 
        {
            MethodId = methodSteps.[0].MethodId;
            Steps = Array.map(fun (step: Database.sql.dataContext.``dbo.MethodsEntity``) -> step.Description) methodSteps;
        }

    let getMethodById (methodId: int) : Method = 
        query {
            for method in Database.context.Dbo.Methods do
            where (method.MethodId = methodId)
            sortBy method.StepNumber
            select method
        }
        |> Seq.toArray
        |> mapToMethod

    
    // TODO not good functional style
    let addMethodStep (methodId: int, index: int, methodStep: string) =
        let methodRow = Database.context.Dbo.Methods.Create();
        methodRow.MethodId <- methodId;
        methodRow.StepNumber <- index;
        methodRow.Description <- methodStep;
        ()

    let addMethod (method: Method) =
        method.Steps
        |> Array.iteri(fun index methodStep -> addMethodStep (method.MethodId, index, methodStep))
        |> Database.context.SubmitUpdates