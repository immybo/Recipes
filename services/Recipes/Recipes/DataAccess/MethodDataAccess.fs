namespace DataAccess

open FSharp.Data.Sql
open Model

module MethodDataAccess =
    let mapToMethod (methodSteps: Database.sql.dataContext.``dbo.MethodStepsEntity``[]) : Method = 
        {
            Steps = Array.map(fun (step: Database.sql.dataContext.``dbo.MethodStepsEntity``) -> step.Description) methodSteps;
        }

    let getMethodById (methodId: int) : Method = 
        query {
            for method in Database.context.Dbo.MethodSteps do
            where (method.MethodId = methodId)
            sortBy method.StepNumber
            select method
        }
        |> Seq.toArray
        |> mapToMethod

    let addBaseMethod (method: Method) : int =
        let methodRow = Database.context.Dbo.Methods.Create();
        Database.context.SubmitUpdates();
        methodRow.MethodId;

    // TODO not good functional style
    let addMethodStep (methodId: int, index: int, methodStep: string) =
        let methodRow = Database.context.Dbo.MethodSteps.Create();
        methodRow.MethodId <- methodId;
        methodRow.StepNumber <- index;
        methodRow.Description <- methodStep;
        ()

    let addMethodSteps (methodSteps: string[], methodId: int) : int =
        methodSteps
        |> Array.iteri(fun index methodStep -> addMethodStep (methodId, index, methodStep))
        |> Database.context.SubmitUpdates
        |> fun () -> methodId

    let addMethod (method: Method) =
        addBaseMethod method
        |> fun methodId -> addMethodSteps (method.Steps, methodId)