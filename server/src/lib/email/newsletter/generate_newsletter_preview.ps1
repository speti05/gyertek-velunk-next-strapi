$ErrorActionPreference = "Stop"

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
# 4 levels up from this folder reaches server/
$serverRoot = Resolve-Path (Join-Path $scriptDir "..\..\..\..")
$template   = Join-Path $scriptDir "newsletter-preview-template.ts"
$output     = Join-Path $scriptDir "newsletter-preview.html"

Write-Host "Server root : $serverRoot"
Write-Host "Template    : $template"
Write-Host "Output      : $output"

Push-Location $serverRoot
try {
    & npx ts-node --project tsconfig.json $template $output
    if ($LASTEXITCODE -ne 0) { throw "ts-node failed (exit $LASTEXITCODE)" }
} finally {
    Pop-Location
}
