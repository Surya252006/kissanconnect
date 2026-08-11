$ErrorActionPreference = 'Continue'
$baseUrl = 'http://localhost:5000/api/auth'
$passed = 0
$total = 12

function Invoke-AuthRequest {
  param(
    [string]$Method = 'GET',
    [string]$Uri,
    [hashtable]$Headers = @{},
    [string]$Body = $null
  )

  try {
    $params = @{
      Uri = $Uri
      Method = $Method
      Headers = $Headers
      UseBasicParsing = $true
      TimeoutSec = 15
    }
    if ($Body) {
      $params.Body = $Body
      $params.ContentType = 'application/json'
    }
    $response = Invoke-WebRequest @params
    return @{
      StatusCode = [int]$response.StatusCode
      Content = $response.Content
      Error = $null
    }
  } catch {
    $resp = $_.Exception.Response
    if ($resp) {
      $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
      $content = $reader.ReadToEnd()
      return @{
        StatusCode = [int]$resp.StatusCode
        Content = $content
        Error = $null
      }
    }
    return @{
      StatusCode = 0
      Content = $null
      Error = $_.Exception.Message
    }
  }
}

function Assert-Status {
  param(
    [string]$Name,
    [int]$Expected,
    [hashtable]$Result
  )

  if ($Result.StatusCode -eq $Expected) {
    Write-Host "PASS: $Name ($($Result.StatusCode))"
    return $true
  }

  Write-Host "FAIL: $Name (expected $Expected, got $($Result.StatusCode))"
  if ($Result.Content) { Write-Host $Result.Content }
  if ($Result.Error) { Write-Host $Result.Error }
  return $false
}

# Test 1: Register Farmer
$r1 = Invoke-AuthRequest -Method POST -Uri "$baseUrl/register" -Body '{"name":"Demo Farmer","email":"farmer@example.com","password":"Password123!","phone":"9876543210","role":"FARMER","location":"Coimbatore"}'
if (Assert-Status 'Test 1 - Register Farmer' 201 $r1) { $passed++ }
$farmerJson = $r1.Content | ConvertFrom-Json
$farmerToken = $farmerJson.data.token
$passwordHashed = ($r1.Content -notmatch '"password"')

# Test 2: Register Buyer
$r2 = Invoke-AuthRequest -Method POST -Uri "$baseUrl/register" -Body '{"name":"Demo Buyer","email":"buyer@example.com","password":"Password123!","phone":"9123456780","role":"CONSUMER","location":"Chennai"}'
if (Assert-Status 'Test 2 - Register Buyer' 201 $r2) { $passed++ }
$buyerToken = ($r2.Content | ConvertFrom-Json).data.token

# Test 3: Duplicate Email
$r3 = Invoke-AuthRequest -Method POST -Uri "$baseUrl/register" -Body '{"name":"Another Farmer","email":"farmer@example.com","password":"Password123!","role":"FARMER"}'
if (Assert-Status 'Test 3 - Duplicate Email' 400 $r3) { $passed++ }

# Test 4: Login Farmer
$r4 = Invoke-AuthRequest -Method POST -Uri "$baseUrl/login" -Body '{"email":"farmer@example.com","password":"Password123!"}'
if (Assert-Status 'Test 4 - Login Farmer' 200 $r4) { $passed++ }
$loginJson = $r4.Content | ConvertFrom-Json
$farmerToken = $loginJson.data.token
$farmerRoleOk = ($loginJson.data.user.role -eq 'FARMER')

# Test 5: Wrong Password
$r5 = Invoke-AuthRequest -Method POST -Uri "$baseUrl/login" -Body '{"email":"farmer@example.com","password":"WrongPassword!"}'
if (Assert-Status 'Test 5 - Wrong Password' 401 $r5) { $passed++ }

# Test 6: /me without token
$r6 = Invoke-AuthRequest -Method GET -Uri "$baseUrl/me"
if (Assert-Status 'Test 6 - /me without token' 401 $r6) { $passed++ }

# Test 7: /me with token
$r7 = Invoke-AuthRequest -Method GET -Uri "$baseUrl/me" -Headers @{ Authorization = "Bearer $farmerToken" }
if (Assert-Status 'Test 7 - /me with token' 200 $r7) { $passed++ }
$meHasNoPassword = ($r7.Content -notmatch '"password"')

# Test 8: protected-test with farmer token
$r8 = Invoke-AuthRequest -Method GET -Uri "$baseUrl/protected-test" -Headers @{ Authorization = "Bearer $farmerToken" }
if (Assert-Status 'Test 8 - protected-test' 200 $r8) { $passed++ }

# Test 9: farmer-test with farmer token
$r9 = Invoke-AuthRequest -Method GET -Uri "$baseUrl/farmer-test" -Headers @{ Authorization = "Bearer $farmerToken" }
if (Assert-Status 'Test 9 - farmer-test' 200 $r9) { $passed++ }

# Test 10: admin-test with farmer token (403)
$r10 = Invoke-AuthRequest -Method GET -Uri "$baseUrl/admin-test" -Headers @{ Authorization = "Bearer $farmerToken" }
if (Assert-Status 'Test 10 - admin-test with farmer token' 403 $r10) { $passed++ }

# Test 11: buyer-test with consumer token
$r11 = Invoke-AuthRequest -Method GET -Uri "$baseUrl/buyer-test" -Headers @{ Authorization = "Bearer $buyerToken" }
if (Assert-Status 'Test 11 - buyer-test with consumer token' 200 $r11) { $passed++ }

# Test 12: invalid token
$r12 = Invoke-AuthRequest -Method GET -Uri "$baseUrl/me" -Headers @{ Authorization = 'Bearer invalid.token.here' }
if (Assert-Status 'Test 12 - invalid token' 401 $r12) { $passed++ }

Write-Host ""
Write-Host "TESTS_PASSED: $passed/$total"
Write-Host "PASSWORD_NOT_IN_REGISTER: $passwordHashed"
Write-Host "PASSWORD_NOT_IN_ME: $meHasNoPassword"
Write-Host "LOGIN_ROLE_FARMER: $farmerRoleOk"
