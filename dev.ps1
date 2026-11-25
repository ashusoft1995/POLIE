# ============================================================
# POLIE Dev Launcher — runs backend + frontend together
# Usage: Right-click → "Run with PowerShell"  OR  .\dev.ps1
# ============================================================

$ROOT     = $PSScriptRoot
$BACKEND  = "$ROOT\backend"
$FRONTEND = "$ROOT\hcops"
$JAR      = "$BACKEND\target\hossana-police-backend-1.0.0.jar"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  POLIE — Hossana Police System" -ForegroundColor Cyan
Write-Host "  Starting backend + frontend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Check Java ────────────────────────────────────────────
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Java not found on PATH." -ForegroundColor Red
    Write-Host "Install Java 21 from https://adoptium.net/" -ForegroundColor Yellow
    pause; exit 1
}

# ── 2. Check JAR ─────────────────────────────────────────────
if (-not (Test-Path $JAR)) {
    Write-Host "ERROR: JAR not found at:" -ForegroundColor Red
    Write-Host "  $JAR" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Build it first by running build-backend.ps1" -ForegroundColor Yellow
    pause; exit 1
}

# ── 3. Check Node ────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js not found on PATH." -ForegroundColor Red
    Write-Host "Install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    pause; exit 1
}

# ── 4. Start BACKEND in a new window ─────────────────────────
Write-Host "▶ Starting backend on http://localhost:8080 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$BACKEND'; Write-Host '── Backend ──────────────────' -ForegroundColor Cyan; java -jar '$JAR'"
) -WindowStyle Normal

Start-Sleep -Seconds 3

# ── 5. Start FRONTEND in a new window ───────────────────────
Write-Host "▶ Starting frontend on http://localhost:3000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$FRONTEND'; Write-Host '── Frontend ─────────────────' -ForegroundColor Cyan; npm run dev"
) -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Both servers starting in new windows." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend:  http://localhost:8080" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "  Close the terminal windows to stop." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
