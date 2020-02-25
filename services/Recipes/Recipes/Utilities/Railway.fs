module Railway

[AutoOpenAttribute] |> ignore
let (>=>) currentValue nextFunc =
    match currentValue with
    | Result.Ok result -> nextFunc result
    | Result.Error error -> Result.Error error