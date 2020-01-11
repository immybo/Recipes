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

    // TODO not good functional style
    let addMethodStep (methodId: int, index: int, methodStep: string) =
        let methodRow = Database.context.Dbo.MethodSteps.Create();
        methodRow.MethodId <- methodId;
        methodRow.StepNumber <- index;
        methodRow.Description <- methodStep;
        ()

    let addMethodSteps methodSteps methodId : int =
        methodSteps
        |> Array.iteri (fun index methodStep -> addMethodStep (methodId, index, methodStep))
        |> Database.context.SubmitUpdates
        |> fun () -> methodId

    let addMethod (method: Method) =
        addBaseMethod method
        |> addMethodSteps method.Steps

    let deleteStepsForMethod (method: Method) =
        query {
            for methodStep in Database.context.Dbo.MethodSteps do
            where (methodStep.MethodId = method.Id)
            select methodStep
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        |> ignore
        Database.context.SubmitUpdates();

    let updateMethod (method: Method) =
        deleteStepsForMethod method
        addMethodSteps method.Steps method.Id
        |> ignore

    let deleteMethod (methodIdToDelete: int) =
        query {
            for methodStep in Database.context.Dbo.MethodSteps do
            where (methodStep.MethodId = methodIdToDelete)
            select methodStep
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        |> ignore
        Database.context.SubmitUpdates();

        query {
            for method in Database.context.Dbo.Methods do
            where (method.MethodId = methodIdToDelete)
            select method
        }
        |> Seq.``delete all items from single table``
        |> Async.RunSynchronously
        |> ignore
        Database.context.SubmitUpdates();