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
            ServerErrors.INTERNAL_ERROR (string (int err))

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

let getPort argv =
    match Array.length argv with
    | 0 -> 8080us
    | _ -> argv.[0] |> uint16

[<EntryPoint>]
let main argv =
    let conf = { defaultConfig with bindings = [ HttpBinding.create HTTP IPAddress.Loopback <| getPort argv ]}
    startWebServer conf app
    0