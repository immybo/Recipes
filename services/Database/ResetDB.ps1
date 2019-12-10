$server = "(LocalDb)\MSSQLLocalDB"
$database = "Recipes"
$scriptDir = ".\"
$logFile = "$scriptDir\ResetLog.txt"

$teardownScripts = Get-ChildItem $scriptDir\Teardown\*.sql
$databaseSchemaScripts = Get-ChildItem $scriptDir\Schema\Database\*.sql
$schemaScripts = Get-ChildItem $scriptDir\Schema\*.sql

Clear-Content $logFile

ForEach ($script in $teardownScripts)
{
	"Running teardown script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server
}

ForEach ($script in $databaseSchemaScripts)
{
	"Running database schema script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server
}

ForEach ($script in $schemaScripts)
{
	"Running schema script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server
}