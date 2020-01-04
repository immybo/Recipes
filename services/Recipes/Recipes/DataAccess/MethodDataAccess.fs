namespace DataAccess

open FSharp.Data.Sql
open Model

module MethodDataAccess =
    let mapToMethod methodId methodSteps : Method = 
        {
            Id = methodId;
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
        |> mapToMethod methodId

    let addBaseMethod (method: Method) : int =
        let methodRow = Database.context.Dbo.Methods.Create();
        Database.context.SubmitUpdates();
        methodRow.MethodId;

    let updateBaseMethod (method: Method) : int =
        let methodRow = Database.context.Dbo.Methods.Create();
        methodRow.MethodId = method.Id;
        Database.context.SubmitUpdates();
        methodRow.MethodId;

    // TODO not good functional style
    let addMethodStep (methodId: int, index: int, methodStep: string) =
        let methodRow = Database.context.Dbo.MethodSteps.Create();
        methodRow.MethodId <- methodId;
        methodRow.StepNumber <- index;
        methodRow.Description <- methodStep;
        ()

    let addMethodSteps methodSteps methodId : int =
        methodSteps
        |> Array.iteri(fun index methodStep -> addMethodStep (methodId, index, methodStep))
        |> Database.context.SubmitUpdates
        |> fun () -> methodId

    let addMethod (method: Method) =
        addBaseMethod method
        |> addMethodSteps method.Steps

    let updateMethod (method: Method) =
        updateBaseMethod method
        |> addMethodSteps method.Steps
        |> ignore