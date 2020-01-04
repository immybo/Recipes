open Suave
open Suave.Web
open Suave.Filters
open Suave.Logging
open Suave.Operators
open Suave.Successful
open System.Threading
open System
open Newtonsoft.Json
open Model

let logRequest request =
    printf "REQUEST || %s\n" (request.ToString())
    request

let logResponse response =
    printf "RESPONSE || %s\n" (response.ToString())
    response

let callWithJson func argv : WebPart =
    logRequest argv
    |> func
    |> JsonConvert.SerializeObject
    |> logResponse
    |> OK

let callWithJsonParameterless func : WebPart =
    func
    |> JsonConvert.SerializeObject
    |> logResponse
    |> OK

let getJsonFromRequest (req: HttpRequest) =
    req.rawForm
    |> System.Text.Encoding.UTF8.GetString

let getRecipe id =
    GetRecipe.getRecipe id

let addRecipe (recipeJson: string) =
    // TODO manage this better + add validation
    // TODO validate that there are no primary keys in this recipe as the objects haven't been created in the DB yet
    JsonConvert.DeserializeObject<Recipe> recipeJson
    |> AddRecipe.addRecipe 
    |> function result ->
        match result with
        | Result.Error err -> ServerErrors.INTERNAL_ERROR (err.ToString()) // Might not actually be a 500 but will leave this for now. Also shouldn't expose actual error contents over internet
        | Result.Ok recipeId -> OK (recipeId.ToString())

let updateRecipe id =
    0

let deleteRecipe id =
    0

let getAllRecipes =
    GetAllRecipes.getAllRecipes

let app =
    choose
        [ 
          GET >=> choose
            [ path "/recipes" >=> request(fun context -> callWithJsonParameterless getAllRecipes)
              pathScan "/recipes/%d" (fun id -> callWithJson getRecipe id) ]
          POST >=> choose
            [ path "/recipes" >=> request(getJsonFromRequest >> addRecipe)]
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