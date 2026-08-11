$env:Path = 'C:\Program Files\nodejs;' + $env:Path

# Start server
Write-Host 'Starting server...'
$proc = Start-Process -FilePath 'node' -ArgumentList 'server.js' -WorkingDirectory 'C:\Users\USER\Downloads\kissanconnect\server' -RedirectStandardOutput 'C:\Users\USER\Downloads\kissanconnect\auth_out.log' -RedirectStandardError 'C:\Users\USER\Downloads\kissanconnect\auth_err.log' -PassThru -NoNewWindow
Write-Host "PID: $($proc.Id)"
Start-Sleep -Seconds 12

# Helper to make JSON requests
$baseUrl = 'http://localhost:5000/api'

# Test 1: Register Farmer
Write-Host '=== TEST 1: Register Farmer ==='
try {
  $body = '{"name":"Demo Farmer","email":"farmer@example.com","password":"Password123!","phone":"9876543210","role":"FARMER","location":"Coimbatore"}'
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
  # Extract token
  $json = $resp.Content | ConvertFrom-Json
  if ($json.data.token) {
    $farmerToken = $json.data.token
    $farmerToken | Out-File token_farmer.txt -Encoding utf8
  }
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 2: Register Buyer (CONSUMER)
Write-Host '=== TEST 2: Register Buyer (CONSUMER) ==='
try {
  $body = '{"name":"Demo Buyer","email":"buyer@example.com","password":"Password123!","phone":"9123456780","role":"CONSUMER","location":"Chennai"}'
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  $json = $resp.Content | ConvertFrom-Json
  if ($json.data.token) {
    $json.data.token | Out-File token_buyer.txt -Encoding utf8
  }
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 3: Duplicate Email
Write-Host '=== TEST 3: Duplicate Email ==='
try {
  $body = '{"name":"Another Farmer","email":"farmer@example.com","password":"Password123!","role":"FARMER"}'
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 4: Login Farmer
Write-Host '=== TEST 4: Login Farmer ==='
try {
  $body = '{"email":"farmer@example.com","password":"Password123!"}'
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  $json = $resp.Content | ConvertFrom-Json
  if ($json.data.token) {
    $json.data.token | Out-File token_farmer2.txt -Encoding utf8
  }
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 5: Wrong Password
Write-Host '=== TEST 5: Wrong Password ==='
try {
  $body = '{"email":"farmer@example.com","password":"WrongPassword!"}'
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 6: /me without token
Write-Host '=== TEST 6: /me without token ==='
try {
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/me" -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 7: /me with token
Write-Host '=== TEST 7: /me with token ==='
$farmerToken = (Get-Content token_farmer2.txt -Raw).Trim()
try {
  $headers = @{ Authorization = "Bearer $farmerToken" }
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Headers $headers -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 8: Farmer protected route
Write-Host '=== TEST 8: protected-test with farmer token ==='
try {
  $headers = @{ Authorization = "Bearer $farmerToken" }
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/protected-test" -Headers $headers -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 9: Farmer route with farmer token
Write-Host '=== TEST 9: farmer-test with farmer token ==='
try {
  $headers = @{ Authorization = "Bearer $farmerToken" }
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/farmer-test" -Headers $headers -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 10: Admin route with farmer token (should be 403)
Write-Host '=== TEST 10: admin-test with farmer token (expect 403) ==='
try {
  $headers = @{ Authorization = "Bearer $farmerToken" }
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/admin-test" -Headers $headers -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 11: Buyer route with consumer token
Write-Host '=== TEST 11: buyer-test with consumer token ==='
$buyerToken = (Get-Content token_buyer.txt -Raw).Trim()
try {
  $headers = @{ Authorization = "Bearer $buyerToken" }
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/buyer-test" -Headers $headers -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Test 12: Invalid token
Write-Host '=== TEST 12: invalid token ==='
try {
  $headers = @{ Authorization = 'Bearer invalid.token.here' }
  $resp = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Headers $headers -UseBasicParsing -TimeoutSec 10 -SkipHttpErrorCheck
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "FAILED: $($_.Exception.Message)"
}

# Stop server
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Write-Host 'Server stopped.'