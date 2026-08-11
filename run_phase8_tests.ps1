$ErrorActionPreference = 'Continue'
$baseUrl = 'http://localhost:5000/api'
$passed = 0
$total = 16

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

Write-Host "=== STARTING PHASE 8: COMPREHENSIVE QA & END-TO-END DEMO TESTS ===" -ForegroundColor Cyan

# Test 1: Health check endpoint (200)
$t1 = Invoke-ApiRequest -Method GET -Uri "$baseUrl/health"
if (Assert-Status 'Test 1 - GET /api/health (200)' 200 $t1) { $passed++ }

# Test 2: Unknown route 404 JSON (404)
$t2 = Invoke-ApiRequest -Method GET -Uri "$baseUrl/unknown-route-check"
if (Assert-Status 'Test 2 - GET /api/unknown-route-check (404 JSON)' 404 $t2) { $passed++ }

# Setup Test Users
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$farmerEmail = "farmer8_$timestamp@example.com"
$buyerEmail = "buyer8_$timestamp@example.com"
$adminEmail = "admin8_$timestamp@example.com"

# Register Farmer
$rFarmer = Invoke-ApiRequest -Method POST -Uri "$baseUrl/auth/register" -Body "{`"name`":`"Ramesh Farmer`",`"email`":`"$farmerEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`",`"location`":`"Nashik`"}"
$farmerToken = ($rFarmer.Content | ConvertFrom-Json).data.token

# Register Buyer
$rBuyer = Invoke-ApiRequest -Method POST -Uri "$baseUrl/auth/register" -Body "{`"name`":`"Sunita Buyer`",`"email`":`"$buyerEmail`",`"password`":`"Password123!`",`"role`":`"CONSUMER`",`"location`":`"Mumbai`"}"
$buyerToken = ($rBuyer.Content | ConvertFrom-Json).data.token

# Register Admin
$rAdmin = Invoke-ApiRequest -Method POST -Uri "$baseUrl/auth/register" -Body "{`"name`":`"Admin Auditor`",`"email`":`"$adminEmail`",`"password`":`"Password123!`",`"role`":`"ADMIN`",`"location`":`"Delhi`"}"
$adminToken = ($rAdmin.Content | ConvertFrom-Json).data.token

# Test 3: Duplicate registration rejected (400)
$t3 = Invoke-ApiRequest -Method POST -Uri "$baseUrl/auth/register" -Body "{`"name`":`"Duplicate`",`"email`":`"$farmerEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`"}"
if (Assert-Status 'Test 3 - Duplicate registration rejected (400)' 400 $t3) { $passed++ }

# Test 4: Invalid login credentials rejected (401)
$t4 = Invoke-ApiRequest -Method POST -Uri "$baseUrl/auth/login" -Body "{`"email`":`"$farmerEmail`",`"password`":`"WrongPass123`"}"
if (Assert-Status 'Test 4 - Invalid password rejected (401)' 401 $t4) { $passed++ }

# Test 5: Farmer creates produce listing (201)
$t5 = Invoke-ApiRequest -Method POST -Uri "$baseUrl/products" -Headers @{ Authorization = "Bearer $farmerToken" } -Body '{"name":"Alphonso Mangoes","category":"Fruits","description":"Ratnagiri mangoes","price":120,"quantity":100,"unit":"kg","location":"Ratnagiri"}'
if (Assert-Status 'Test 5 - Farmer creates produce listing (201)' 201 $t5) { $passed++ }
$productId = ($t5.Content | ConvertFrom-Json).data.product._id

# Test 6: Farmer requests produce verification (201)
$t6 = Invoke-ApiRequest -Method POST -Uri "$baseUrl/verifications" -Headers @{ Authorization = "Bearer $farmerToken" } -Body "{`"type`":`"PRODUCT`",`"productId`":`"$productId`",`"remarks`":`"GI tagged organic Alphonso`"}"
if (Assert-Status 'Test 6 - Farmer submits verification request (201)' 201 $t6) { $passed++ }
$verId = ($t6.Content | ConvertFrom-Json).data.verification._id

# Test 7: Admin verifies produce (200)
$t7 = Invoke-ApiRequest -Method PUT -Uri "$baseUrl/verifications/$verId/approve" -Headers @{ Authorization = "Bearer $adminToken" } -Body '{"remarks":"GI Tag Verified Grade 1"}'
if (Assert-Status 'Test 7 - Admin approves produce verification (200)' 200 $t7) { $passed++ }

# Test 8: Admin creates price insight benchmark (201)
$t8 = Invoke-ApiRequest -Method POST -Uri "$baseUrl/price-insights" -Headers @{ Authorization = "Bearer $adminToken" } -Body '{"productName":"Alphonso Mangoes","category":"Fruits","marketPrice":150,"platformPrice":120,"unit":"kg","location":"Mumbai APMC","trend":"STABLE"}'
if (Assert-Status 'Test 8 - Admin creates price benchmark (201)' 201 $t8) { $passed++ }

# Test 9: Buyer attempts to order quantity greater than stock (400)
$t9 = Invoke-ApiRequest -Method POST -Uri "$baseUrl/orders" -Headers @{ Authorization = "Bearer $buyerToken" } -Body "{`"productId`":`"$productId`",`"quantity`":150,`"deliveryAddress`":{`"street`":`"12 MG Road`",`"city`":`"Mumbai`"}}"
if (Assert-Status 'Test 9 - Over-quantity order rejected (400)' 400 $t9) { $passed++ }

# Test 10: Buyer places valid order for 10kg (201)
$t10 = Invoke-ApiRequest -Method POST -Uri "$baseUrl/orders" -Headers @{ Authorization = "Bearer $buyerToken" } -Body "{`"productId`":`"$productId`",`"quantity`":10,`"deliveryAddress`":{`"street`":`"12 MG Road`",`"city`":`"Mumbai`",`"pincode`":`"400001`"}}"
if (Assert-Status 'Test 10 - Buyer places valid 10kg order (201)' 201 $t10) { $passed++ }
$order = ($t10.Content | ConvertFrom-Json).data.order
$orderId = $order._id
$totalAmount = $order.totalAmount
Write-Host "Calculated Total Amount (Expected 1200): $totalAmount" -ForegroundColor Yellow

# Test 11: Inventory reduced atomically from 100kg to 90kg (200)
$pCheck = (Invoke-ApiRequest -Method GET -Uri "$baseUrl/products/$productId").Content | ConvertFrom-Json
$remainingStock = $pCheck.data.product.quantity
if ($remainingStock -eq 90) {
  Write-Host "PASS: Test 11 - Atomic stock reduced correctly to 90kg" -ForegroundColor Green
  $passed++
} else {
  Write-Host "FAIL: Test 11 - Stock is $remainingStock, expected 90" -ForegroundColor Red
}

# Test 12: Farmer confirms and processes order (200)
$t12 = Invoke-ApiRequest -Method PUT -Uri "$baseUrl/orders/$orderId/status" -Headers @{ Authorization = "Bearer $farmerToken" } -Body '{"status":"CONFIRMED"}'
if (Assert-Status 'Test 12 - Farmer confirms order (200)' 200 $t12) { $passed++ }

# Test 13: Farmer updates logistics state to IN_TRANSIT (200)
$t13 = Invoke-ApiRequest -Method PUT -Uri "$baseUrl/orders/$orderId/logistics" -Headers @{ Authorization = "Bearer $farmerToken" } -Body '{"logisticsStatus":"IN_TRANSIT"}'
if (Assert-Status 'Test 13 - Farmer updates logistics to IN_TRANSIT (200)' 200 $t13) { $passed++ }

# Test 14: Farmer marks order as DELIVERED (200)
$t14 = Invoke-ApiRequest -Method PUT -Uri "$baseUrl/orders/$orderId/status" -Headers @{ Authorization = "Bearer $farmerToken" } -Body '{"status":"DELIVERED"}'
if (Assert-Status 'Test 14 - Farmer completes order to DELIVERED (200)' 200 $t14) { $passed++ }

# Test 15: Buyer views order details showing DELIVERED (200)
$t15 = Invoke-ApiRequest -Method GET -Uri "$baseUrl/orders/$orderId" -Headers @{ Authorization = "Bearer $buyerToken" }
$ordDetails = ($t15.Content | ConvertFrom-Json).data.order
if ($ordDetails.status -eq 'DELIVERED' -and $ordDetails.logisticsStatus -eq 'DELIVERED') {
  Write-Host "PASS: Test 15 - Buyer order status synced as DELIVERED" -ForegroundColor Green
  $passed++
} else {
  Write-Host "FAIL: Test 15 - Order status is $($ordDetails.status)" -ForegroundColor Red
}

# Test 16: Admin analytics reflects active platform GMV (200)
$t16 = Invoke-ApiRequest -Method GET -Uri "$baseUrl/analytics/overview" -Headers @{ Authorization = "Bearer $adminToken" }
if (Assert-Status 'Test 16 - Admin analytics overview (200)' 200 $t16) { $passed++ }

Write-Host ""
Write-Host "=== PHASE 8 QA SUMMARY ===" -ForegroundColor Yellow
Write-Host "PASSED: $passed / $total"
if ($passed -eq $total) {
  Write-Host "ALL PHASE 8 TESTS PASSED!" -ForegroundColor Green
} else {
  Write-Host "SOME TESTS FAILED!" -ForegroundColor Red
}
