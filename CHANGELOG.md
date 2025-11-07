# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Casos de uso documentados
- Diagramas UML (actividades, secuencia, estados)
- Plan de despliegue profesional
- Funciones en `@pqdate/core`:
  - `differenceInDays(a, b)` diferencia de días (UTC, por inicio de día)
  - `isSame(a, b, unit)` igualdad por unidad (day/month/year) en UTC

## [0.1.0] - 2025-01-31

### Added
- Librería de fechas UTC-first e inmutable
- Módulo `@pqdate/core` con funciones base:
  - `parseISO`: Parseo estricto de ISO 8601
  - `formatISO`: Formato ISO 8601
  - `add`/`sub`: Operaciones aritméticas en UTC
  - `startOf`/`endOf`: Truncado por unidad (day/month/year)
  - `isBefore`/`isAfter`/`isWithinInterval`: Comparaciones
  - `toLocal`: Conversión a hora local
- Módulo `@pqdate/intl` con formato localizado:
  - `formatLocal`: Formato usando Intl.DateTimeFormat
  - Soporte para locales: `en-US`, `es-ES`
- Módulo `@pqdate/rules` con reglas de negocio:
  - `lastBusinessDayOfMonth`: Último día hábil del mes
- Sistema de errores `PqDateError` con códigos:
  - `E_PARSE_INVALID`: Error de parseo
  - `E_ARG_INVALID`: Argumento inválido
  - `E_RANGE`: Rango/intervalo inválido
- Builds para ESM, CJS y UMD
- TypeScript definitions
- Tests unitarios con Vitest
- Documentación completa en README.md

### Technical
- TypeScript estricto
- Tree-shakeable
- Sin dependencias pesadas
- Compatible con Node.js y navegadores
- Tamaño del bundle < 20KB gzip

[Unreleased]: https://github.com/tu-usuario/pqdate/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tu-usuario/pqdate/releases/tag/v0.1.0



