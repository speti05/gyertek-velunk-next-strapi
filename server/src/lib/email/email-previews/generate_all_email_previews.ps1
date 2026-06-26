$ErrorActionPreference = "Stop"

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
# 4 levels up from this folder reaches server/
$serverRoot = Resolve-Path (Join-Path $scriptDir "..\..\..\..")
$outDir     = Join-Path $scriptDir "output"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Write-Host "Server root : $serverRoot"
Write-Host "Output dir  : $outDir"
Write-Host ""

function Run-Preview($label, $template, $output) {
    Write-Host "Generating: $label"
    Push-Location $serverRoot
    try {
        & npx ts-node --project tsconfig.json $template $output
        if ($LASTEXITCODE -ne 0) { throw "ts-node failed (exit $LASTEXITCODE)" }
    } finally {
        Pop-Location
    }
}

Run-Preview `
    "Newsletter signup - felhasználói email" `
    (Join-Path $scriptDir "newsletter-signup-user-preview.ts") `
    (Join-Path $outDir "newsletter-signup-user.html")

Run-Preview `
    "Newsletter signup - admin email" `
    (Join-Path $scriptDir "newsletter-signup-admin-preview.ts") `
    (Join-Path $outDir "newsletter-signup-admin.html")

Run-Preview `
    "Visszahívás / megkeresés - admin email (3 variáns)" `
    (Join-Path $scriptDir "contact-request-admin-preview.ts") `
    (Join-Path $outDir "contact-request")

Run-Preview `
    "Túrajelentkezés - felhasználói email" `
    (Join-Path $scriptDir "event-signup-user-preview.ts") `
    (Join-Path $outDir "event-signup-user.html")

Run-Preview `
    "Túrajelentkezés - admin email (2 variáns)" `
    (Join-Path $scriptDir "event-signup-admin-preview.ts") `
    (Join-Path $outDir "event-signup-admin")

Write-Host ""
Write-Host "Kesz! Az osszes HTML fajl itt talalhato: $outDir"
