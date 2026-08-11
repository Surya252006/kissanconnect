$ErrorActionPreference = 'Continue'
$authUrl = 'http://localhost:5000/api/auth'
$productUrl = 'http://localhost:5000/api/products'
$orderUrl = 'http://localhost:5000/api/orders'
$passed = 0
$total = 18

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

Write-Host "=== STARTING PHASE 4: ORDERS + INVENTORY + LOGISTICS TESTS ===" -ForegroundColor Cyan

# 1. Setup Test Users
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$farmerAEmail = "farmerA_$timestamp@example.com"
$farmerBEmail = "farmerB_$timestamp@example.com"
$buyerAEmail = "buyerA_$timestamp@example.com"
$buyerBEmail = "buyerB_$timestamp@example.com"

# Register Farmer A
$r1 = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Farmer Green`",`"email`":`"$farmerAEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`",`"location`":`"Coimbatore`"}"
$farmerAToken = ($r1.Content | ConvertFrom-Json).data.token

# Register Farmer B
$r2 = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Farmer Blue`",`"email`":`"$farmerBEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`",`"location`":`"Madurai`"}"
$farmerBToken = ($r2.Content | ConvertFrom-Json).data.token

# Register Buyer A
$r3 = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Buyer Alice`",`"email`":`"$buyerAEmail`",`"password`":`"Password123!`",`"role`":`"CONSUMER`",`"location`":`"Chennai`"}"
$buyerAToken = ($r3.Content | ConvertFrom-Json).data.token

# Register Buyer B
$r4 = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Buyer Bob`",`"email`":`"$buyerBEmail`",`"password`":`"Password123!`",`"role`":`"CONSUMER`",`"location`":`"Bangalore`"}"
$buyerBToken = ($r4.Content | ConvertFrom-Json).data.token

# 2. Farmer A creates a product (100kg Tomato @ ₹40/kg)
$prodRes = Invoke-ApiRequest -Method POST -Uri "$productUrl" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"name":"Fresh Organic Tomatoes","category":"Vegetables","description":"Fresh farm tomatoes","price":40,"quantity":100,"unit":"kg","location":"Coimbatore","image":"tomato.jpg"}'
$product = ($prodRes.Content | ConvertFrom-Json).data.product
$productId = $product._id

# Test 1: Unauthenticated POST /api/orders (401)
$t1 = Invoke-ApiRequest -Method POST -Uri "$orderUrl" -Body "{`"productId`":`"$productId`",`"quantity`":10,`"deliveryAddress`":`"Chennai`"}"
if (Assert-Status 'Test 1 - Unauthenticated order creation (401)' 401 $t1) { $passed++ }

# Test 2: Farmer attempting to create buyer order (403)
$t2 = Invoke-ApiRequest -Method POST -Uri "$orderUrl" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body "{`"productId`":`"$productId`",`"quantity`":10,`"deliveryAddress`":`"Chennai`"}"
if (Assert-Status 'Test 2 - Farmer placing buyer order (403)' 403 $t2) { $passed++ }

# Test 3: Invalid quantity <= 0 (400)
$t3 = Invoke-ApiRequest -Method POST -Uri "$orderUrl" -Headers @{ Authorization = "Bearer $buyerAToken" } -Body "{`"productId`":`"$productId`",`"quantity`":0,`"deliveryAddress`":`"Chennai`"}"
if (Assert-Status 'Test 3 - Invalid quantity 0 (400)' 400 $t3) { $passed++ }

# Test 4: Insufficient Inventory (Order 150kg when stock is 100kg) (400)
$t4 = Invoke-ApiRequest -Method POST -Uri "$orderUrl" -Headers @{ Authorization = "Bearer $buyerAToken" } -Body "{`"productId`":`"$productId`",`"quantity`":150,`"deliveryAddress`":`"Chennai`"}"
if (Assert-Status 'Test 4 - Insufficient inventory (400)' 400 $t4) { $passed++ }

# Verify product stock is still 100kg
$pCheck1 = (Invoke-ApiRequest -Method GET -Uri "$productUrl/$productId").Content | ConvertFrom-Json
$stockUnchanged = ($pCheck1.data.product.quantity -eq 100)
Write-Host "Stock Unchanged Check (100kg): $stockUnchanged" -ForegroundColor Yellow

# Test 5: Buyer A places valid order for 20kg (201)
# Total calculated on backend = 20 * 40 = ₹800
$t5 = Invoke-ApiRequest -Method POST -Uri "$orderUrl" -Headers @{ Authorization = "Bearer $buyerAToken" } -Body "{`"productId`":`"$productId`",`"quantity`":20,`"deliveryAddress`":{`"street`":`"123 Farm Road`",`"city`":`"Chennai`",`"state`":`"TN`",`"pincode`":`"600001`"}}"
if (Assert-Status 'Test 5 - Buyer A creates valid order (201)' 201 $t5) { $passed++ }
$orderA = ($t5.Content | ConvertFrom-Json).data.order
$orderAId = $orderA._id
$totalCalculatedCorrectly = ($orderA.totalAmount -eq 800)
Write-Host "Backend Total Calculation Correct (₹800): $totalCalculatedCorrectly" -ForegroundColor Yellow

# Test 6: Verify Atomic Inventory Reduction (Stock must now be 80kg)
$pCheck2 = (Invoke-ApiRequest -Method GET -Uri "$productUrl/$productId").Content | ConvertFrom-Json
$stockReduced = ($pCheck2.data.product.quantity -eq 80)
if ($stockReduced) {
  Write-Host "PASS: Test 6 - Atomic Inventory Reduction (100 -> 80kg)" -ForegroundColor Green
  $passed++
} else {
  Write-Host "FAIL: Test 6 - Expected 80kg stock, got $($pCheck2.data.product.quantity)" -ForegroundColor Red
}

# Test 7: GET /api/orders/my (Buyer A orders) (200)
$t7 = Invoke-ApiRequest -Method GET -Uri "$orderUrl/my" -Headers @{ Authorization = "Bearer $buyerAToken" }
if (Assert-Status 'Test 7 - GET /api/orders/my Buyer A (200)' 200 $t7) { $passed++ }

# Test 8: GET /api/orders/farmer (Farmer A orders) (200)
$t8 = Invoke-ApiRequest -Method GET -Uri "$orderUrl/farmer" -Headers @{ Authorization = "Bearer $farmerAToken" }
if (Assert-Status 'Test 8 - GET /api/orders/farmer Farmer A (200)' 200 $t8) { $passed++ }

# Test 9: GET /api/orders/:id by Buyer A (200)
$t9 = Invoke-ApiRequest -Method GET -Uri "$orderUrl/$orderAId" -Headers @{ Authorization = "Bearer $buyerAToken" }
if (Assert-Status 'Test 9 - GET /api/orders/:id Buyer A (200)' 200 $t9) { $passed++ }

# Test 10: Buyer B accessing Buyer A order (403)
$t10 = Invoke-ApiRequest -Method GET -Uri "$orderUrl/$orderAId" -Headers @{ Authorization = "Bearer $buyerBToken" }
if (Assert-Status 'Test 10 - Buyer B viewing Buyer A order (403)' 403 $t10) { $passed++ }

# Test 11: Farmer B updating Farmer A order status (403)
$t11 = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$orderAId/status" -Headers @{ Authorization = "Bearer $farmerBToken" } -Body '{"status":"CONFIRMED"}'
if (Assert-Status 'Test 11 - Farmer B updating Farmer A order status (403)' 403 $t11) { $passed++ }

# Test 12: Farmer A updates order status through lifecycle (CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED) (200)
$t12a = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$orderAId/status" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"status":"CONFIRMED"}'
$t12b = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$orderAId/status" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"status":"PROCESSING"}'
$t12c = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$orderAId/status" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"status":"SHIPPED"}'
$t12d = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$orderAId/status" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"status":"DELIVERED"}'
if (Assert-Status 'Test 12 - Farmer A updates order lifecycle to DELIVERED (200)' 200 $t12d) { $passed++ }

# Test 13: Farmer A updates logistics status (PACKED -> PICKED_UP -> IN_TRANSIT -> OUT_FOR_DELIVERY -> DELIVERED) (200)
$t13 = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$orderAId/logistics" -Headers @{ Authorization = "Bearer $farmerAToken" } -Body '{"logisticsStatus":"DELIVERED"}'
if (Assert-Status 'Test 13 - Farmer A updates logistics status (200)' 200 $t13) { $passed++ }

# 3. Test Cancellation Flow:
# Create Order 2 for 30kg (Stock goes from 80 -> 50kg)
$tOrder2 = Invoke-ApiRequest -Method POST -Uri "$orderUrl" -Headers @{ Authorization = "Bearer $buyerAToken" } -Body "{`"productId`":`"$productId`",`"quantity`":30,`"deliveryAddress`":`"Chennai`"}"
$order2 = ($tOrder2.Content | ConvertFrom-Json).data.order
$order2Id = $order2._id

# Verify stock became 50kg
$pCheck3 = (Invoke-ApiRequest -Method GET -Uri "$productUrl/$productId").Content | ConvertFrom-Json
$stock50 = ($pCheck3.data.product.quantity -eq 50)
Write-Host "Stock after second order (50kg): $stock50" -ForegroundColor Yellow

# Test 14: Buyer A cancels pending order 2 (200)
$t14 = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$order2Id/cancel" -Headers @{ Authorization = "Bearer $buyerAToken" }
if (Assert-Status 'Test 14 - Buyer A cancels pending order (200)' 200 $t14) { $passed++ }

# Test 15: Verify Product Stock Restored back to 80kg
$pCheck4 = (Invoke-ApiRequest -Method GET -Uri "$productUrl/$productId").Content | ConvertFrom-Json
$stockRestored = ($pCheck4.data.product.quantity -eq 80)
if ($stockRestored) {
  Write-Host "PASS: Test 15 - Product Stock Restored to 80kg on Cancellation" -ForegroundColor Green
  $passed++
} else {
  Write-Host "FAIL: Test 15 - Expected 80kg stock, got $($pCheck4.data.product.quantity)" -ForegroundColor Red
}

# Test 16: Verify Cancellation cannot be called again (double restoration prevented) (400)
$t16 = Invoke-ApiRequest -Method PUT -Uri "$orderUrl/$order2Id/cancel" -Headers @{ Authorization = "Bearer $buyerAToken" }
if (Assert-Status 'Test 16 - Double cancellation prevented (400)' 400 $t16) { $passed++ }

# Test 17: Invalid Order ID format (400)
$t17 = Invoke-ApiRequest -Method GET -Uri "$orderUrl/invalid_order_id" -Headers @{ Authorization = "Bearer $buyerAToken" }
if (Assert-Status 'Test 17 - Invalid Order ID (400)' 400 $t17) { $passed++ }

# Test 18: Non-existent Order ID (404)
$t18 = Invoke-ApiRequest -Method GET -Uri "$orderUrl/65f000000000000000000000" -Headers @{ Authorization = "Bearer $buyerAToken" }
if (Assert-Status 'Test 18 - Non-existent Order ID (404)' 404 $t18) { $passed++ }

Write-Host ""
Write-Host "=== PHASE 4 TEST SUMMARY ===" -ForegroundColor Yellow
Write-Host "PASSED: $passed / $total"
if ($passed -eq $total) {
  Write-Host "ALL PHASE 4 BACKEND API & INVENTORY TESTS PASSED!" -ForegroundColor Green
} else {
  Write-Host "SOME TESTS FAILED!" -ForegroundColor Red
}
