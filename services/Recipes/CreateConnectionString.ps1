$server = $env:DATABASEURL
$dbUsername = $env:DATABASEUSERNAME
$dbPassword = $env:DATABASEPASSWORD

(Get-Content Recipes/DataAccess/Database.fs).replace("Data Source=(LocalDB)\MSSQLLocalDB;Integrated Security=True;database=Recipes", "Server=$server;Database=Recipes;User ID=$dbUsername;Password=$dbPassword") | Set-Content Recipes/DataAccess/Database.fs