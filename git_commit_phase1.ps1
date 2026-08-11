$env:Path = 'C:\Program Files\Git\cmd;' + $env:Path

# Remove the cleanup script itself
Remove-Item -Force cleanup_phase1.ps1 -ErrorAction SilentlyContinue

# Verify .env is ignored (must not be committed)
Write-Host '=== git check-ignore server/.env ==='
git check-ignore -v server/.env *> git_ignore_check.log 2>&1
Write-Host "Exit: $LASTEXITCODE"
Get-Content git_ignore_check.log

# Stage all changes
Write-Host '=== git add . ==='
git add . *> git_add.log 2>&1
Write-Host "Add exit: $LASTEXITCODE"

# Show what's staged (verify .env is NOT included)
Write-Host '=== git status --short ==='
git status --short *> git_status.log 2>&1
Get-Content git_status.log

# Commit
Write-Host '=== git commit ==='
git commit -m "feat: setup MongoDB and backend foundation" *> git_commit.log 2>&1
Write-Host "Commit exit: $LASTEXITCODE"
Get-Content git_commit.log

# Cleanup helper files
Remove-Item -Force $PSCommandPath, git_ignore_check.log, git_add.log, git_status.log, git_commit.log -ErrorAction SilentlyContinue