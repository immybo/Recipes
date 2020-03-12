$scriptDir = ".\"
$logFile = "$scriptDir\ResetLog.txt"

$teardownScripts = Get-ChildItem $scriptDir\Teardown\*.sql
$databaseSchemaScripts = Get-ChildItem $scriptDir\Schema\Database\*.sql
$schemaScripts = Get-ChildItem $scriptDir\Schema\*.sql

$database = "Recipes"
$resetScript = "ResetLocalDB.ps1"

$detach_db_sql = @"
IF (SELECT COUNT(*) FROM sys.databases WHERE name = '$database') > 0
BEGIN
  ALTER DATABASE $database SET SINGLE_USER WITH ROLLBACK IMMEDIATE
  EXEC sp_detach_db @dbname = N'$database'
END
"@

$detach_db_sql | Out-File "detachdb.sql"
sqlcmd -S "(LocalDB)\MSSQLLocalDB" -i "detachdb.sql"
Remove-Item "detachdb.sql"

if (Test-Path "$PSScriptRoot\$database.mdf") { Remove-Item "$PSScriptRoot\$database.mdf" }
if (Test-Path "$PSScriptRoot\$database.ldf") { Remove-Item "$PSScriptRoot\$database.ldf" }

$create_db_sql = @"
CREATE DATABASE $database
ON (
  NAME = ${database},
  FILENAME = '$PSScriptRoot\$database.mdf'
)
LOG ON (
  NAME = ${database}_log,
  FILENAME = '$PSScriptRoot\$database.ldf'
)
"@

$downgrade_db_sql = @"
ALTER DATABASE $database
SET COMPATIBILITY_LEVEL = 130
"@


$create_db_sql | Out-File "createdb.sql"
sqlcmd -S "(LocalDB)\MSSQLLocalDB" -i "createdb.sql"
Remove-Item "createdb.sql"

Invoke-Expression -Command "$PSScriptRoot\$resetScript"

$detach_db_sql | Out-File "detachdb.sql"
sqlcmd -S "(LocalDB)\MSSQLLocalDB" -i "detachdb.sql"
Remove-Item "detachdb.sql"