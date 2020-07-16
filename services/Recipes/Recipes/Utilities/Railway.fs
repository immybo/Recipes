module Railway

// Core railway function - pass in a Result and a function to pass the result
// to, and it'll either:
// - Call the next function with the Result if it was successful, or
// - Skip the next function and return the existing error if it was unsuccessful
// This allows us to do something like a >=> b >=> c, even if all 3 functions
// can return an error.
let (>=>) currentValue nextFunc: Result<'b, 'ErrorType> =
    match currentValue with
    | Result.Ok result -> (nextFunc result)
    | Result.Error error -> Result.Error error

// Very similiar to the core railway function, except the next function is
// one that can't fail, and so just returns a non-Result type.
let (>>>) currentValue nextFunc: Result<'b, 'ErrorType> =
    match currentValue with
    | Result.Ok result -> nextFunc result |> Result.Ok
    | Result.Error error -> Result.Error error

// Very similar to the core railway function, except the next function doesn't
// return anything so we pass through the current value.
let (>^>) currentValue nextFunc: Result<'b, 'ErrorType> =
    match currentValue with
    | Result.Ok result -> 
        nextFunc result |> ignore
        Result.Ok result
    | Result.Error error -> Result.Error error

let coalesceResults results =
    let folder = fun state next ->
        match (state, next) with
        | (Result.Ok x, Result.Ok y) -> x |> List.append [ y ] |> Result.Ok
        | (Result.Error err, _) -> Result.Error err
        | (_, Result.Error err) -> Result.Error err
    Seq.fold folder (Result.Ok []) results