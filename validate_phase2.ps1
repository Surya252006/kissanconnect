$env:Path = 'C:\Program Files\nodejs;' + $env:Path

$files = @(
  'server/controllers/authController.js',
  'server/middleware/authMiddleware.js',
  'server/middleware/roleMiddleware.js',
  'server/routes/authRoutes.js',
  'server/server.js'
)

$allPass = $true
foreach ($f in $files) {
  node --check $f 2>&1 | Out-File -FilePath syntax_check.tmp -Encoding utf8
  if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: $f"
  } else {
    Write-Host "FAIL: $f"
    Get-Content syntax_check.tmp
    $allPass = $false
  }
}

if ($allPass) {
  Write-Host 'ALL_SYNTAX_OK'
} else {
  Write-Host 'SYNTAX_ERRORS_FOUND'
}
Remove-Item -Force syntax_check.tmp -ErrorAction SilentlyContinue