$server = $env:DATABASEURL
$dbUsername = $env:DATABASEUSERNAME
$dbPassword = $env:DATABASEPASSWORD

(Get-Content Recipes/DataAccess/Database.fs).replace("Server=(LocalDb)\MSSQLLocalDB;Database=Recipes;Trusted_Connection=True;", "Server=$server;Database=Recipes;User ID=$dbUsername;Password=$dbPassword") | Set-Content Recipes/DataAccess/Database.fs