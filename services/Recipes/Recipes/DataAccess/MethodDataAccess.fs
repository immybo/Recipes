namespace DataAccess

open FSharp.Data
open Model
open System.Linq

module MethodDataAccess =
    type GetMethodStepsByIdQuery = SqlCommandProvider<"
        SELECT *
        FROM dbo.MethodSteps
        WHERE MethodId = @methodId
        ", Database.compileTimeConnectionString>

    type AddBaseMethodCommand = SqlCommandProvider<"
        INSERT INTO dbo.Methods
        OUTPUT INSERTED.methodId
        DEFAULT VALUES
        ", Database.compileTimeConnectionString>

    type AddMethodStepCommand = SqlCommandProvider<"
        INSERT INTO dbo.MethodSteps (MethodId, StepNumber, Description)
        VALUES (@methodId, @stepNumber, @description)
        ", Database.compileTimeConnectionString>

    type DeleteStepsForMethodCommand = SqlCommandProvider<"
        DELETE FROM dbo.MethodSteps
        WHERE MethodId = @methodId
        ", Database.compileTimeConnectionString>

    type DeleteMethodCommand = SqlCommandProvider<"
        DELETE FROM dbo.Methods
        WHERE MethodId = @methodId
        ", Database.compileTimeConnectionString>

    let mapToMethod methodId methodSteps : Method = 
        {
            Id = methodId;
            Steps = Array.map(fun (step: GetMethodStepsByIdQuery.Record) -> step.description) methodSteps;
        }

    let getMethodById (methodId: int) : Method = 
        let query = new GetMethodStepsByIdQuery(Database.realConnectionString)
        query.Execute methodId
        |> Seq.toArray
        |> mapToMethod methodId

    let addBaseMethod (method: Method) : int =
        let command = new AddBaseMethodCommand(Database.realConnectionString)
        command.Execute ()
        |> fun x -> x.Single()

    let addMethodStep (methodId: int, index: int, methodStep: string) =
        let command = new AddMethodStepCommand(Database.realConnectionString)
        command.Execute (methodId, index, methodStep) |> ignore

    let addMethodSteps methodSteps methodId : int =
        methodSteps
        |> Array.iteri (fun index methodStep -> addMethodStep (methodId, index, methodStep))
        |> fun () -> methodId

    let addMethod (method: Method) =
        addBaseMethod method
        |> addMethodSteps method.Steps

    let deleteStepsForMethod (methodId: int) =
        let command = new DeleteStepsForMethodCommand(Database.realConnectionString)
        command.Execute methodId |> ignore

    let updateMethod (method: Method) =
        deleteStepsForMethod method.Id
        addMethodSteps method.Steps method.Id
        |> ignore

    let deleteMethod (methodIdToDelete: int) =
        deleteStepsForMethod methodIdToDelete

        let command = new DeleteMethodCommand(Database.realConnectionString)
        command.Execute methodIdToDelete |> ignore