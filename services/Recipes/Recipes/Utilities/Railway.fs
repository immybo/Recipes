module Railway

let (>=>) currentValue nextFunc =
    match currentValue with
    | Result.Ok result -> nextFunc result
    | Result.Error error -> Result.Error error

let coalesceResults results =
    let folder = fun state next ->
        match (state, next) with
        | (Result.Ok x, Result.Ok y) -> x |> List.append [ y ] |> Result.Ok
        | (Result.Error err, _) -> Result.Error err
        | (_, Result.Error err) -> Result.Error err
    Seq.fold folder (Result.Ok []) results