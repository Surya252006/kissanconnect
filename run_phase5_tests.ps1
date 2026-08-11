$ErrorActionPreference = 'Continue'
$authUrl = 'http://localhost:5000/api/auth'
$productUrl = 'http://localhost:5000/api/products'
$priceInsightUrl = 'http://localhost:5000/api/price-insights'
$verificationUrl = 'http://localhost:5000/api/verifications'
$passed = 0
$total = 14

function Invoke-ApiRequest {
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
    Write-Host "PASS: $Name (Status $($Result.StatusCode))" -ForegroundColor Green
    return $true
  }

  Write-Host "FAIL: $Name (Expected $Expected, got $($Result.StatusCode))" -ForegroundColor Red
  if ($Result.Content) { Write-Host "Content: $($Result.Content)" }
  if ($Result.Error) { Write-Host "Error: $($Result.Error)" }
  return $false
}

Write-Host "=== STARTING PHASE 5: PRICE INSIGHTS & VERIFICATION TESTS ===" -ForegroundColor Cyan

# 1. Setup Test Users (Admin, Farmer, Consumer)
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$adminEmail = "admin_$timestamp@example.com"
$farmerEmail = "farmer5_$timestamp@example.com"
$consumerEmail = "buyer5_$timestamp@example.com"

$rAdmin = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Admin User`",`"email`":`"$adminEmail`",`"password`":`"Password123!`",`"role`":`"ADMIN`",`"location`":`"Chennai`"}"
$adminToken = ($rAdmin.Content | ConvertFrom-Json).data.token

$rFarmer = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Farmer Kumar`",`"email`":`"$farmerEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`",`"location`":`"Pollachi`"}"
$farmerToken = ($rFarmer.Content | ConvertFrom-Json).data.token

$rConsumer = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Buyer Priya`",`"email`":`"$consumerEmail`",`"password`":`"Password123!`",`"role`":`"CONSUMER`",`"location`":`"Coimbatore`"}"
$consumerToken = ($rConsumer.Content | ConvertFrom-Json).data.token

# Test 1: Consumer creating price insight (403)
$t1 = Invoke-ApiRequest -Method POST -Uri "$priceInsightUrl" -Headers @{ Authorization = "Bearer $consumerToken" } -Body '{"productName":"Tomato","marketPrice":50,"platformPrice":40}'
if (Assert-Status 'Test 1 - Consumer creating price insight (403)' 403 $t1) { $passed++ }

# Test 2: Admin creating price insight (201)
$t2 = Invoke-ApiRequest -Method POST -Uri "$priceInsightUrl" -Headers @{ Authorization = "Bearer $adminToken" } -Body '{"productName":"Organic Tomatoes","category":"Vegetables","marketPrice":48,"platformPrice":40,"unit":"kg","location":"Coimbatore","trend":"DOWN"}'
if (Assert-Status 'Test 2 - Admin creating price insight (201)' 201 $t2) { $passed++ }
$insightId = ($t2.Content | ConvertFrom-Json).data.insight._id

# Test 3: Public / Buyer fetching price insights (200)
$t3 = Invoke-ApiRequest -Method GET -Uri "$priceInsightUrl"
if (Assert-Status 'Test 3 - GET /api/price-insights (200)' 200 $t3) { $passed++ }

# Test 4: Filtering price insights by category and search (200)
$t4 = Invoke-ApiRequest -Method GET -Uri "http://localhost:5000/api/price-insights?category=Vegetables&search=Tomato"
if (Assert-Status 'Test 4 - Filter price insights (200)' 200 $t4) { $passed++ }

# Test 5: Admin updating price insight (200)
$t5 = Invoke-ApiRequest -Method PUT -Uri "$priceInsightUrl/$insightId" -Headers @{ Authorization = "Bearer $adminToken" } -Body '{"marketPrice":52,"trend":"UP"}'
if (Assert-Status 'Test 5 - Admin update price insight (200)' 200 $t5) { $passed++ }

# Test 6: Farmer creates a product (Unverified initially)
$pRes = Invoke-ApiRequest -Method POST -Uri "$productUrl" -Headers @{ Authorization = "Bearer $farmerToken" } -Body '{"name":"Fresh Carrots","category":"Vegetables","description":"Ooty carrots","price":35,"quantity":200,"unit":"kg","location":"Ooty"}'
if (Assert-Status 'Test 6 - Farmer creates unverified product (201)' 201 $pRes) { $passed++ }
$product = ($pRes.Content | ConvertFrom-Json).data.product
$productId = $product._id
$initiallyUnverified = ($product.isVerified -eq $false)
Write-Host "Product Initially Unverified (false): $initiallyUnverified" -ForegroundColor Yellow

# Test 7: Farmer attempts to self-verify product via PUT /api/products/:id (isVerified must remain false)
$t7 = Invoke-ApiRequest -Method PUT -Uri "$productUrl/$productId" -Headers @{ Authorization = "Bearer $farmerToken" } -Body '{"isVerified":true,"price":36}'
$pCheck = (Invoke-ApiRequest -Method GET -Uri "$productUrl/$productId").Content | ConvertFrom-Json
$stillUnverified = ($pCheck.data.product.isVerified -eq $false)
if ($stillUnverified) {
  Write-Host "PASS: Test 7 - Farmer direct self-verification blocked" -ForegroundColor Green
  $passed++
} else {
  Write-Host "FAIL: Test 7 - Farmer successfully self-verified!" -ForegroundColor Red
}

# Test 8: Farmer submits verification request for product (201)
$t8 = Invoke-ApiRequest -Method POST -Uri "$verificationUrl" -Headers @{ Authorization = "Bearer $farmerToken" } -Body "{`"type`":`"PRODUCT`",`"productId`":`"$productId`",`"remarks`":`"Organic certification ready`"}"
if (Assert-Status 'Test 8 - Farmer submits product verification request (201)' 201 $t8) { $passed++ }
$verId = ($t8.Content | ConvertFrom-Json).data.verification._id

# Test 9: Farmer attempts to approve verification (403)
$t9 = Invoke-ApiRequest -Method PUT -Uri "$verificationUrl/$verId/approve" -Headers @{ Authorization = "Bearer $farmerToken" }
if (Assert-Status 'Test 9 - Farmer approving verification (403)' 403 $t9) { $passed++ }

# Test 10: Admin approves verification (200)
$t10 = Invoke-ApiRequest -Method PUT -Uri "$verificationUrl/$verId/approve" -Headers @{ Authorization = "Bearer $adminToken" } -Body '{"remarks":"Approved - Grade A organic produce"}'
if (Assert-Status 'Test 10 - Admin approves product verification (200)' 200 $t10) { $passed++ }

# Test 11: Verify Product.isVerified became true in database
$pCheckVerified = (Invoke-ApiRequest -Method GET -Uri "$productUrl/$productId").Content | ConvertFrom-Json
$isNowVerified = ($pCheckVerified.data.product.isVerified -eq $true)
if ($isNowVerified) {
  Write-Host "PASS: Test 11 - Product isVerified successfully synced to true" -ForegroundColor Green
  $passed++
} else {
  Write-Host "FAIL: Test 11 - Product isVerified was not synced!" -ForegroundColor Red
}

# Test 12: Admin rejects verification request for user (200)
$uVerRes = Invoke-ApiRequest -Method POST -Uri "$verificationUrl" -Headers @{ Authorization = "Bearer $farmerToken" } -Body '{"type":"USER","remarks":"Identity proof verification"}'
$uVerId = ($uVerRes.Content | ConvertFrom-Json).data.verification._id

$t12 = Invoke-ApiRequest -Method PUT -Uri "$verificationUrl/$uVerId/reject" -Headers @{ Authorization = "Bearer $adminToken" } -Body '{"remarks":"Document blurred"}'
if (Assert-Status 'Test 12 - Admin rejects verification (200)' 200 $t12) { $passed++ }

# Test 13: GET /api/verifications as Admin (200)
$t13 = Invoke-ApiRequest -Method GET -Uri "$verificationUrl" -Headers @{ Authorization = "Bearer $adminToken" }
if (Assert-Status 'Test 13 - Admin GET /api/verifications (200)' 200 $t13) { $passed++ }

# Test 14: Admin deletes price insight (200)
$t14 = Invoke-ApiRequest -Method DELETE -Uri "$priceInsightUrl/$insightId" -Headers @{ Authorization = "Bearer $adminToken" }
if (Assert-Status 'Test 14 - Admin deletes price insight (200)' 200 $t14) { $passed++ }

Write-Host ""
Write-Host "=== PHASE 5 TEST SUMMARY ===" -ForegroundColor Yellow
Write-Host "PASSED: $passed / $total"
if ($passed -eq $total) {
  Write-Host "ALL PHASE 5 TESTS PASSED!" -ForegroundColor Green
} else {
  Write-Host "SOME TESTS FAILED!" -ForegroundColor Red
}
