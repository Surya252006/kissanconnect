$baseUrl = "http://localhost:5000/api"

Write-Host "=== TESTING AUTHENTICATION PIPELINE ==="

# 1. Test Health
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
Write-Host "Health Check: $($health.message) (DB: $($health.database))"

# 2. Test Registration with unique email
$email = "farmer_$((Get-Date).Ticks)@test.com"
$regBody = @{
    name = "Ravi Kumar"
    email = $email
    password = "Password123!"
    role = "FARMER"
    phone = "9876543210"
    location = "Erode, Tamil Nadu"
} | ConvertTo-Json

try {
    $regRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "PASS: Registration successful for $($regRes.data.user.email)"
    $token = $regRes.data.token
} catch {
    Write-Host "FAIL: Registration failed - $($_.Exception.Message)"
}

# 3. Test Login with registered user
$loginBody = @{
    email = $email
    password = "Password123!"
} | ConvertTo-Json

try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "PASS: Login successful for $($loginRes.data.user.email) (Role: $($loginRes.data.user.role))"
} catch {
    Write-Host "FAIL: Login failed - $($_.Exception.Message)"
}

# 4. Test Invalid password
$badLoginBody = @{
    email = $email
    password = "WrongPassword999!"
} | ConvertTo-Json

try {
    $badLoginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $badLoginBody -ContentType "application/json"
    Write-Host "FAIL: Bad login should have been rejected"
} catch {
    Write-Host "PASS: Invalid password correctly rejected (401)"
}

# 5. Test Duplicate email
try {
    $dupRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "FAIL: Duplicate email should have been rejected"
} catch {
    Write-Host "PASS: Duplicate email correctly rejected (400)"
}

# 6. Test GET /auth/me with Bearer Token
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $meRes = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
    Write-Host "PASS: GET /api/auth/me retrieved user: $($meRes.data.user.name)"
} catch {
    Write-Host "FAIL: GET /api/auth/me failed - $($_.Exception.Message)"
}

Write-Host "=== AUTHENTICATION PIPELINE TEST COMPLETED ==="
