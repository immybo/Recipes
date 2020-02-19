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

let getJsonFromRequest (req: HttpRequest) =
    req.rawForm
    |> System.Text.Encoding.UTF8.GetString

let logRequest (request: HttpRequest) =
    printf "REQUEST || %s %s %s\n" (request.method.ToString()) (request.url.ToString()) request.rawQuery
    printf "BODY || %s\n" (getJsonFromRequest(request))
    request

let logResponse response =
    printf "RESPONSE || %s\n" (response.ToString())
    response

let callWithJson func argv : WebPart =
    func argv
    |> JsonConvert.SerializeObject
    |> logResponse
    |> OK

let callWithJsonParameterless func : WebPart =
    func
    |> JsonConvert.SerializeObject
    |> logResponse
    |> OK

let getRecipe id =
    GetRecipe.getRecipe id

let deleteRecipe id =
    DeleteRecipe.deleteRecipe id

let getAllRecipes () =
    GetAllRecipes.getAllRecipes ()

let getAllIngredients () =
    GetAllIngredients.getAllIngredients ()

let handle<'ParamType, 'ResponseType> (request: HttpRequest, underlyingFunction: 'ParamType -> Result<'ResponseType, Error>) : WebPart =
    logRequest request
    |> getJsonFromRequest
    |> JsonConvert.DeserializeObject<'ParamType>
    |> underlyingFunction
    |> logResponse
    |> function result -> match result with
        | Result.Ok response ->
            JsonConvert.SerializeObject response
            |> OK
        | Result.Error err ->
            // TODO switch between validation errors vs internal server errors here.
            ServerErrors.INTERNAL_ERROR (err.ToString())

let app =
    choose
        [ 
          GET >=> choose
            [ path "/recipes" >=> request(fun context -> callWithJsonParameterless (getAllRecipes ()))
              pathScan "/recipes/%d" (fun id -> callWithJson getRecipe id)
              path "/ingredients" >=> request(fun context -> callWithJsonParameterless (getAllIngredients ()))
              path "/nutrition/ingredients" >=> request(fun context -> handle (context, GetNutritionalInformationForIngredients.getNutritionalInformationForIngredients))]
          POST >=> choose
            [ path "/recipes" >=> request(fun context -> handle (context, AddRecipe.addRecipe))
              path "/ingredients" >=> request(fun context -> handle (context, AddIngredient.addIngredient))
              path "/mealplanner/mealplans" >=> request(fun context -> handle (context, AddOrUpdateMealPlan.addOrUpdateMealPlan))]
          PUT >=> choose
            [ path "/recipes" >=> request(fun context -> handle (context, UpdateRecipe.updateRecipe))
              // Can't send a body in get requests... we could just use multiple query string params?
              path "/mealplanner/mealplans" >=> request(fun context -> handle (context, GetMealPlan.getMealPlan))]
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