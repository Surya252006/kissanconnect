$ErrorActionPreference = 'Continue'
$authUrl = 'http://localhost:5000/api/auth'
$analyticsUrl = 'http://localhost:5000/api/analytics/overview'
$passed = 0
$total = 4

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

Write-Host "=== STARTING PHASE 6: ANALYTICS & ADMIN DASHBOARD TESTS ===" -ForegroundColor Cyan

# 1. Setup Test Users
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$adminEmail = "admin6_$timestamp@example.com"
$farmerEmail = "farmer6_$timestamp@example.com"
$consumerEmail = "buyer6_$timestamp@example.com"

$rAdmin = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Admin Master`",`"email`":`"$adminEmail`",`"password`":`"Password123!`",`"role`":`"ADMIN`",`"location`":`"Chennai`"}"
$adminToken = ($rAdmin.Content | ConvertFrom-Json).data.token

$rFarmer = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Farmer Raman`",`"email`":`"$farmerEmail`",`"password`":`"Password123!`",`"role`":`"FARMER`",`"location`":`"Erode`"}"
$farmerToken = ($rFarmer.Content | ConvertFrom-Json).data.token

$rConsumer = Invoke-ApiRequest -Method POST -Uri "$authUrl/register" -Body "{`"name`":`"Buyer Anita`",`"email`":`"$consumerEmail`",`"password`":`"Password123!`",`"role`":`"CONSUMER`",`"location`":`"Salem`"}"
$consumerToken = ($rConsumer.Content | ConvertFrom-Json).data.token

# Test 1: Unauthenticated GET /api/analytics/overview (401)
$t1 = Invoke-ApiRequest -Method GET -Uri $analyticsUrl
if (Assert-Status 'Test 1 - Unauthenticated analytics access (401)' 401 $t1) { $passed++ }

# Test 2: Consumer role GET /api/analytics/overview (403)
$t2 = Invoke-ApiRequest -Method GET -Uri $analyticsUrl -Headers @{ Authorization = "Bearer $consumerToken" }
if (Assert-Status 'Test 2 - Consumer role access to analytics (403)' 403 $t2) { $passed++ }

# Test 3: Farmer role GET /api/analytics/overview (403)
$t3 = Invoke-ApiRequest -Method GET -Uri $analyticsUrl -Headers @{ Authorization = "Bearer $farmerToken" }
if (Assert-Status 'Test 3 - Farmer role access to analytics (403)' 403 $t3) { $passed++ }

# Test 4: Admin role GET /api/analytics/overview (200)
$t4 = Invoke-ApiRequest -Method GET -Uri $analyticsUrl -Headers @{ Authorization = "Bearer $adminToken" }
if (Assert-Status 'Test 4 - Admin role access to analytics (200)' 200 $t4) { $passed++ }

$analyticsJson = $t4.Content | ConvertFrom-Json
$d = $analyticsJson.data
Write-Host "Analytics Metrics Verified:" -ForegroundColor Yellow
Write-Host "  Total Users: $($d.totalUsers)"
Write-Host "  Total Farmers: $($d.totalFarmers)"
Write-Host "  Total Products: $($d.totalProducts)"
Write-Host "  Verified Products: $($d.verifiedProducts)"
Write-Host "  Total Orders: $($d.totalOrders)"
Write-Host "  Total Marketplace GMV: ₹$($d.totalMarketplaceValue)"
Write-Host "  Recent Orders Count: $($d.recentOrders.Length)"

Write-Host ""
Write-Host "=== PHASE 6 TEST SUMMARY ===" -ForegroundColor Yellow
Write-Host "PASSED: $passed / $total"
if ($passed -eq $total) {
  Write-Host "ALL PHASE 6 ANALYTICS & ADMIN TESTS PASSED!" -ForegroundColor Green
} else {
  Write-Host "SOME TESTS FAILED!" -ForegroundColor Red
}
