# deploy.ps1 - Script de despliegue para PowerShell
# Uso: .\deploy.ps1

param(
    [switch]$SkipTests = $false,
    [switch]$DryRun = $false,
    [string]$Version = ""
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando despliegue de pqDate..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar autenticación
Write-Host "📋 Verificando autenticación npm..." -ForegroundColor Yellow
try {
    $user = npm whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ No estás autenticado en npm. Ejecuta: npm login" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Autenticado como: $user" -ForegroundColor Green
} catch {
    Write-Host "❌ Error verificando autenticación" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Ejecutar pruebas (si no se omite)
if (-not $SkipTests) {
    Write-Host "🧪 Ejecutando pruebas..." -ForegroundColor Yellow
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Las pruebas fallaron" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Pruebas pasadas" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⏭️  Omitiendo pruebas (--SkipTests)" -ForegroundColor Yellow
    Write-Host ""
}

# 3. Verificar tamaño
Write-Host "📦 Verificando tamaño del bundle..." -ForegroundColor Yellow
npm run size
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ El tamaño del bundle excede el límite" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tamaño OK" -ForegroundColor Green
Write-Host ""

# 4. Actualizar versión (si se especifica)
if ($Version) {
    Write-Host "📌 Actualizando versión a $Version..." -ForegroundColor Yellow
    npm version $Version --no-git-tag-version
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error actualizando versión" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Versión actualizada" -ForegroundColor Green
    Write-Host ""
}

# 5. Build
Write-Host "🔨 Construyendo proyecto..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falló" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completado" -ForegroundColor Green
Write-Host ""

# 6. Verificar qué se publicará
Write-Host "🔍 Verificando archivos a publicar..." -ForegroundColor Yellow
npm pack --dry-run
Write-Host ""

# 7. Dry-run de publicación
Write-Host "🔍 Verificando publicación (dry-run)..." -ForegroundColor Yellow
npm publish --dry-run
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en dry-run" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dry-run OK" -ForegroundColor Green
Write-Host ""

# 8. Confirmar y publicar (si no es dry-run)
if ($DryRun) {
    Write-Host "🔍 Modo dry-run: no se publicará" -ForegroundColor Yellow
    Write-Host "✅ Verificación completa. Listo para publicar." -ForegroundColor Green
} else {
    $confirm = Read-Host "¿Publicar en npm? (y/n)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Host "📤 Publicando en npm..." -ForegroundColor Yellow
        npm publish
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Publicación exitosa!" -ForegroundColor Green
            Write-Host "📦 Paquete disponible en: https://www.npmjs.com/package/pqdate" -ForegroundColor Cyan
            Write-Host ""
            
            # Mostrar información del paquete publicado
            Write-Host "📊 Información del paquete:" -ForegroundColor Cyan
            npm view pqdate version
            npm view pqdate dist.tarball
        } else {
            Write-Host "❌ Error en la publicación" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Publicación cancelada" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Proceso completado" -ForegroundColor Green



