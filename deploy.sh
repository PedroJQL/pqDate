#!/bin/bash
# deploy.sh - Script de despliegue para Linux/macOS
# Uso: ./deploy.sh [--skip-tests] [--dry-run] [--version patch|minor|major]

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SKIP_TESTS=false
DRY_RUN=false
VERSION=""

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --version)
            VERSION="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Opción desconocida: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}🚀 Iniciando despliegue de pqDate...${NC}"
echo ""

# 1. Verificar autenticación
echo -e "${YELLOW}📋 Verificando autenticación npm...${NC}"
if ! npm whoami &> /dev/null; then
    echo -e "${RED}❌ No estás autenticado en npm. Ejecuta: npm login${NC}"
    exit 1
fi
USER=$(npm whoami)
echo -e "${GREEN}✅ Autenticado como: $USER${NC}"
echo ""

# 2. Ejecutar pruebas
if [ "$SKIP_TESTS" = false ]; then
    echo -e "${YELLOW}🧪 Ejecutando pruebas...${NC}"
    npm test
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Las pruebas fallaron${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Pruebas pasadas${NC}"
    echo ""
else
    echo -e "${YELLOW}⏭️  Omitiendo pruebas (--skip-tests)${NC}"
    echo ""
fi

# 3. Verificar tamaño
echo -e "${YELLOW}📦 Verificando tamaño del bundle...${NC}"
npm run size
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ El tamaño del bundle excede el límite${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Tamaño OK${NC}"
echo ""

# 4. Actualizar versión (si se especifica)
if [ -n "$VERSION" ]; then
    echo -e "${YELLOW}📌 Actualizando versión ($VERSION)...${NC}"
    npm version $VERSION --no-git-tag-version
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error actualizando versión${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Versión actualizada${NC}"
    echo ""
fi

# 5. Build
echo -e "${YELLOW}🔨 Construyendo proyecto...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build falló${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build completado${NC}"
echo ""

# 6. Verificar qué se publicará
echo -e "${YELLOW}🔍 Verificando archivos a publicar...${NC}"
npm pack --dry-run
echo ""

# 7. Dry-run de publicación
echo -e "${YELLOW}🔍 Verificando publicación (dry-run)...${NC}"
npm publish --dry-run
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en dry-run${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dry-run OK${NC}"
echo ""

# 8. Confirmar y publicar
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}🔍 Modo dry-run: no se publicará${NC}"
    echo -e "${GREEN}✅ Verificación completa. Listo para publicar.${NC}"
else
    read -p "¿Publicar en npm? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}📤 Publicando en npm...${NC}"
        npm publish
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Publicación exitosa!${NC}"
            echo -e "${CYAN}📦 Paquete disponible en: https://www.npmjs.com/package/pqdate${NC}"
            echo ""
            
            # Mostrar información del paquete publicado
            echo -e "${CYAN}📊 Información del paquete:${NC}"
            npm view pqdate version
            npm view pqdate dist.tarball
        else
            echo -e "${RED}❌ Error en la publicación${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}❌ Publicación cancelada${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✨ Proceso completado${NC}"



