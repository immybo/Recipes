$server = $env:DATABASEURL
$scriptDir = ".\"
$logFile = "$scriptDir\ResetLog.txt"

$teardownScripts = Get-ChildItem $scriptDir\Teardown\*.sql
$databaseSchemaScripts = Get-ChildItem $scriptDir\Schema\Database\*.sql
$schemaScripts = Get-ChildItem $scriptDir\Schema\*.sql

$dbUsername = $env:DATABASEUSERNAME
$dbPassword = $env:DATABASEPASSWORD

$database = "Recipes"

Clear-Content $logFile

ForEach ($script in $teardownScripts)
{
	"Running teardown script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server -username $dbUsername -password $dbPassword -database $database
}

ForEach ($script in $databaseSchemaScripts)
{
	"Running database schema script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server -username $dbUsername -password $dbPassword -database $database
}

ForEach ($script in $schemaScripts)
{
	"Running schema script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server -username $dbUsername -password $dbPassword -database $database
}

"Running foreign keys script." | out-file $logFile -Append
Invoke-SqlCmd -inputfile "ForeignKeys.sql" -serverinstance $server -username $dbUsername -password $dbPassword -database $database