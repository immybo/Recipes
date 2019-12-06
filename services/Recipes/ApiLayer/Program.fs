open Suave
open Suave.Web
open Suave.Filters
open Suave.Logging
open Suave.Operators
open Suave.Successful
open System.Threading
open System

let logRequest request =
    printf "REQUEST || %s\n" (request.ToString())

let logResponse response =
    printf "RESPONSE || %s\n" (response.ToString())

let callWithJson func argv =
    logRequest argv
    let responseValue = 
        func(argv)
        |> Json.toJson
        |> System.Text.Encoding.UTF8.GetString
    logResponse responseValue
    OK responseValue

let getRecipe id =
    GetRecipe.getRecipe id

let updateRecipe id =
    0

let deleteRecipe id =
    0

let app =
    choose
        [ 
          GET >=> choose
            [ pathScan "/recipes/%d" (fun id -> callWithJson getRecipe id) ]
          PUT >=> choose
            [ pathScan "/recipes/%d" (fun id -> callWithJson updateRecipe id) ]
          DELETE >=> choose
            [ pathScan "/recipes/%d" (fun id -> callWithJson deleteRecipe id) ]
        ]

[<EntryPoint>]
let main argv =
    let cts = new CancellationTokenSource()
    let conf = { defaultConfig with
                    cancellationToken = cts.Token;
                    bindings = [ HttpBinding.createSimple HTTP "127.0.0.1" 52354 ];
    }
    let listening, server = startWebServerAsync conf app
    
    Async.Start(server, cts.Token)
    printfn "Make requests now"
    Console.ReadKey true |> ignore

    cts.Cancel()

    0