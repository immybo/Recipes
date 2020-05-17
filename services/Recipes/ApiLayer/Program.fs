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
open System.Net
open Interface

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

let getRecipe id =
    Recipes.get id

let deleteRecipe id =
    Recipes.delete id

let handle<'ParamType, 'ResponseType> (request: HttpRequest, underlyingFunction: 'ParamType -> Result<'ResponseType, Error>) : WebPart =
    logRequest request
    |> getJsonFromRequest
    |> JsonConvert.DeserializeObject<'ParamType>
    |> underlyingFunction
    |> function result -> match result with
        | Result.Ok response ->
            JsonConvert.SerializeObject response
            |> logResponse
            |> OK
        | Result.Error err ->
            logResponse err
            |> int
            |> string
            // TODO switch between validation errors vs internal server errors here.
            |> ServerErrors.INTERNAL_ERROR

let handleParameterless<'ResponseType> (request: HttpRequest, underlyingFunction: unit -> Result<'ResponseType, Error>) : WebPart =
    logRequest request |> ignore
    underlyingFunction ()
    |> function result -> match result with
        | Result.Ok response ->
            JsonConvert.SerializeObject response
            |> logResponse
            |> OK
        | Result.Error err ->
            logResponse err
            |> int
            |> string
            // TODO switch between validation errors vs internal server errors here.
            |> ServerErrors.INTERNAL_ERROR

let app =
    choose
        [ 
          GET >=> choose
            [ path "/recipes" >=> request(fun context -> handleParameterless (context, Recipes.getAll))
              pathScan "/recipes/%d" (fun id -> callWithJson getRecipe id)
              pathScan "/recipes/%d/nutrition" (fun id -> callWithJson Nutrition.getForRecipe id)
              path "/ingredients" >=> request(fun context -> handleParameterless (context, Ingredients.getAll))
              path "/nutrition/ingredients" >=> request(fun context -> handle (context, Nutrition.getForIngredients))]
          POST >=> choose
            [ path "/recipes" >=> request(fun context -> handle (context, Recipes.add))
              path "/ingredients" >=> request(fun context -> handle (context, Ingredients.add))
              path "/mealplanner/mealplans" >=> request(fun context -> handle (context, MealPlan.addOrUpdate))
              path "/nutrition/ingredients" >=> request(fun context -> handle (context, Nutrition.addForIngredient))]
          PUT >=> choose
            [ path "/recipes" >=> request(fun context -> handle (context, Recipes.update))
              // Can't send a body in get requests... we could just use multiple query string params?
              path "/mealplanner/mealplans" >=> request(fun context -> handle (context, MealPlan.get))]
          DELETE >=> choose
            [ pathScan "/recipes/%d" (fun id -> callWithJson deleteRecipe id)
              path "/mealplanner/mealplans" >=> request(fun context -> handle (context, MealPlan.deleteEntry))]
        ]

let getIpAddress argv =
    match Array.length argv with
    | 0 -> IPAddress.Loopback
    | _ -> argv.[0] |> string |> IPAddress.Parse

[<EntryPoint>]
let main argv =
    let conf = { defaultConfig with bindings = [ HttpBinding.create HTTP (getIpAddress argv) 8080us ]}
    startWebServer conf app
    0