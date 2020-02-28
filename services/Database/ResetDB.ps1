$server = $args[0]
$scriptDir = ".\"
$logFile = "$scriptDir\ResetLog.txt"

$teardownScripts = Get-ChildItem $scriptDir\Teardown\*.sql
$databaseSchemaScripts = Get-ChildItem $scriptDir\Schema\Database\*.sql
$schemaScripts = Get-ChildItem $scriptDir\Schema\*.sql

$dbUsername = $args[1]
$dbPassword = $args[2]

Clear-Content $logFile

ForEach ($script in $teardownScripts)
{
	"Running teardown script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server -username $dbUSername -password $dbPassword
}

ForEach ($script in $databaseSchemaScripts)
{
	"Running database schema script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server -username $dbUSername -password $dbPassword
}

ForEach ($script in $schemaScripts)
{
	"Running schema script: $script" | out-file $logFile -Append
	Invoke-SqlCmd -inputfile $script.FullName -serverinstance $server -username $dbUSername -password $dbPassword
}