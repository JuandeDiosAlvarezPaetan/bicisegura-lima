# BiciSegura Lima
Proyecto de Computacion
Frontend web que muestra a los ciclistas de Lima las ciclovías según su estado, las zonas de riesgo reportadas por la comunidad y los estacionamientos seguros cercanos. Demo académica con datos simulados.

- **Solución desplegada:** https://JuandeDiosAlvarezPaetan.github.io/bicisegura-lima/
- **Tecnologías:** HTML, CSS y JavaScript, Leaflet + OpenStreetMap, Jest, ESLint, GitHub Actions y GitHub Pages.

## Estructura

```
src/            Frontend (index.html, styles.css, app.js, utils.js, data.js)
tests/          Pruebas unitarias con Jest
scripts/        Script de build (copia src/ a dist/)
.github/        Pipeline CI/CD y Dependabot
```

## Ejecutar en local

```bash
npm ci
npm run lint
npm test
npm run build
```

Después abre `dist/index.html` en el navegador.

## Estrategia de ramas

| Rama | Uso |
| --- | --- |
| main | Producción. Cada push despliega a GitHub Pages. Solo recibe PRs desde test. |
| test | Pruebas e integración. El pipeline corre las pruebas y la seguridad, pero no despliega. |
| feature/HUxx-... | Una rama por historia de usuario; se fusiona en test mediante PR. |

## Pipeline CI/CD (.github/workflows/ci-cd.yml)

| Etapa | Qué hace |
| --- | --- |
| Build y pruebas | `npm ci`, ESLint con reglas de seguridad, 17 pruebas Jest con cobertura y build a `dist/` |
| Seguridad | gitleaks (secretos), `npm audit` (dependencias) y CodeQL (SAST) |
| Despliegue | Publica `dist/` en GitHub Pages, solo en push a main y si las etapas anteriores pasaron |

## Seguridad implementada

- **SAST:** CodeQL analiza el JavaScript en cada push y PR. Los hallazgos aparecen en Security > Code scanning.
- **Dependencias:** `npm audit --audit-level=high` corta el pipeline si hay vulnerabilidades altas, y Dependabot abre PRs semanales con las actualizaciones.
- **Secretos:** gitleaks revisa todo el historial de commits.
- **Linter de seguridad:** eslint-plugin-security.
- **En la app:**
  - Política CSP que solo permite scripts propios y de unpkg.
  - Integridad SRI en Leaflet.
  - Escape de HTML en el texto que escribe el usuario, para evitar XSS.
  - Validación de los reportes: tipo permitido, ubicación dentro de Lima y máximo 280 caracteres.
