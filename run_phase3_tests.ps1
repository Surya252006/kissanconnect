$ErrorActionPreference = 'Continue'
$authUrl = 'http://localhost:5000/api/auth'
$productUrl = 'http://localhost:5000/api/products'
$passed = 0
$total = 15

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

Write-Host "=== STARTING PHASE 3 PRODUCT MARKETPLACE TESTS ===" -ForegroundColor Cyan

# Setup Test Users (Farmer A, Farmer B, Consumer)
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$farmerAEmail = "farmerA_$timestamp@example.com"
$farmerBEmail = "farmerB_$timestamp@example.com"
$consumerEmail = "buyer_$timestamp@example.com"

$rRegFarmerA = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Farmer A`",`"email`":`"$farmerAEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`",`"location`":`"Coimbatore`"}"
$farmerAToken = ($rRegFarmerA.Content | ConvertFrom-Json).data.token

$rRegFarmerB = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Farmer B`",`"email`":`"$farmerBEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`",`"location`":`"Madurai`"}"
$farmerBToken = ($rRegFarmerB.Content | ConvertFrom-Json).data.token

$rRegConsumer = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Buyer User`",`"email`":`"$consumerEmail`",`"password`":`"Password123!`",`"role`":`"CONSUMER`",`"location`":`"Chennai`"}"
$consumerToken = ($rRegConsumer.Content | ConvertFrom-Json).data.token

# Test 1: GET /api/products (Public)
$t1 = Invoke-ApiRequest -Method GET -Uri "$productUrl"
if (Assert-Status 'Test 1 - GET /api/products public' 200 $t1) { $passed++ }

# Test 2: POST /api/products without token (401)
$t2 = Invoke-ApiRequest -Method POST -Uri "$productUrl" -Body '{"name":"Tomato","category":"Vegetables","price":40,"quantity":100,"unit":"kg"}'
if (Assert-Status 'Test 2 - POST /api/products unauth (401)' 401 $t2) { $passed++ }

# Test 3: POST /api/products with Consumer token (403)
$t3 = Invoke-ApiRequest -Method POST -Uri "$productUrl" -Headers @{ Authorization = "Bearer $consumerToken" } -Body '{"name":"Tomato","category":"Vegetables","price":40,"quantity":100,"unit":"kg"}'
if (Assert-Status 'Test 3 - POST /api/products consumer (403)' 403 $t3) { $passed++ }

# Test 4: POST /api/products with Farmer A token (201)
$t4 = Invoke-ApiRequest -Method POST -Uri "$productUrl" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"name":"Fresh Organic Tomatoes","category":"Vegetables","description":"Juicy red farm tomatoes","price":45,"quantity":150,"unit":"kg","location":"Pollachi","image":"tomato.jpg"}'
if (Assert-Status 'Test 4 - POST /api/products Farmer A (201)' 201 $t4) { $passed++ }
$p4Json = $t4.Content | ConvertFrom-Json
$productAId = $p4Json.data.product._id

# Test 5: GET /api/products/my with Farmer A token (200)
$t5 = Invoke-ApiRequest -Method GET -Uri "$productUrl/my" -Headers @{ Authorization = "Bearer $farmerAToken" }
if (Assert-Status 'Test 5 - GET /api/products/my Farmer A (200)' 200 $t5) { $passed++ }

# Test 6: GET /api/products/:id (200)
$t6 = Invoke-ApiRequest -Method GET -Uri "$productUrl/$productAId"
if (Assert-Status 'Test 6 - GET /api/products/:id (200)' 200 $t6) { $passed++ }

# Test 7: PUT /api/products/:id Farmer B editing Farmer A product (403)
$t7 = Invoke-ApiRequest -Method PUT -Uri "$productUrl/$productAId" -Headers @{ Authorization = "Bearer $farmerBToken" } -Body '{"price":10}'
if (Assert-Status 'Test 7 - PUT Farmer B edit Farmer A product (403)' 403 $t7) { $passed++ }

# Test 8: DELETE /api/products/:id Farmer B deleting Farmer A product (403)
$t8 = Invoke-ApiRequest -Method DELETE -Uri "$productUrl/$productAId" -Headers @{ Authorization = "Bearer $farmerBToken" }
if (Assert-Status 'Test 8 - DELETE Farmer B delete Farmer A product (403)' 403 $t8) { $passed++ }

# Test 9: PUT /api/products/:id Farmer A editing own product (200)
$t9 = Invoke-ApiRequest -Method PUT -Uri "$productUrl/$productAId" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"price":50,"quantity":120}'
if (Assert-Status 'Test 9 - PUT Farmer A edit own product (200)' 200 $t9) { $passed++ }

# Test 10: GET /api/products?search=tomato (200)
$t10 = Invoke-ApiRequest -Method GET -Uri "http://localhost:5000/api/products?search=tomato"
if (Assert-Status 'Test 10 - Search query (200)' 200 $t10) { $passed++ }

# Test 11: GET /api/products?category=Vegetables&minPrice=10&maxPrice=100 (200)
$t11 = Invoke-ApiRequest -Method GET -Uri "http://localhost:5000/api/products?category=Vegetables&minPrice=10&maxPrice=100"
if (Assert-Status 'Test 11 - Filter category and price (200)' 200 $t11) { $passed++ }

# Test 12: GET /api/products?sort=price_asc (200)
$t12 = Invoke-ApiRequest -Method GET -Uri "http://localhost:5000/api/products?sort=price_asc"
if (Assert-Status 'Test 12 - Sort price_asc (200)' 200 $t12) { $passed++ }

# Test 13: GET /api/products?page=1&limit=5 (200)
$t13 = Invoke-ApiRequest -Method GET -Uri "http://localhost:5000/api/products?page=1&limit=5"
if (Assert-Status 'Test 13 - Pagination page and limit (200)' 200 $t13) { $passed++ }

# Test 14: GET /api/products/invalid_id (404)
$t14 = Invoke-ApiRequest -Method GET -Uri "$productUrl/invalid_id_12345"
if (Assert-Status 'Test 14 - Invalid product ID (404)' 404 $t14) { $passed++ }

# Test 15: DELETE /api/products/:id Farmer A deleting own product (200)
$t15 = Invoke-ApiRequest -Method DELETE -Uri "$productUrl/$productAId" -Headers @{ Authorization = "Bearer $farmerAToken" }
if (Assert-Status 'Test 15 - DELETE Farmer A delete own product (200)' 200 $t15) { $passed++ }

Write-Host ""
Write-Host "=== PHASE 3 TEST SUMMARY ===" -ForegroundColor Yellow
Write-Host "PASSED: $passed / $total"
if ($passed -eq $total) {
  Write-Host "ALL PHASE 3 BACKEND API TESTS PASSED!" -ForegroundColor Green
} else {
  Write-Host "SOME TESTS FAILED!" -ForegroundColor Red
}
