# Reglas del proyecto Proyectofm

Tienda de muebles artesanales "Ingenio Arte & Madera" (proyecto académico SENA / prácticas).
Java 17 + Spring Boot 3.2.4 + MySQL 8, con front estático en `web/`. Detalle en `doc/arquitectura.md`.

## Principios no negociables
Cada principio se cumple en toda spec, plan y cambio. Si una spec necesita violar uno, se justifica en un ADR.

1. **DEBE** usar `PreparedStatement` con `?` en todo SQL; **NO DEBE** concatenar entradas en el SQL. Evita inyección SQL.
2. **NO DEBE** poner credenciales en el código ni versionar `application.properties` con claves reales. Usar variables de entorno o un archivo local ignorado por git.
3. **DEBE** respetar las capas `controllers → repositories → models`; el controller no llama a `dao` ni a `database`. Así cada capa tiene una sola responsabilidad.
4. **DEBE** usar JPA (`repositories`) en todo código nuevo. El camino `dao`/`database` es legado y no se extiende.
5. **DEBE** validar las entradas de cada endpoint y cerrar las conexiones (try-with-resources). Evita datos corruptos y fugas de conexión.
6. **NO DEBE** ejecutar `UPDATE`/`DELETE` sin `WHERE` ni borrar datos sin confirmación.

## Reglas de aprendizaje (Mafe es dev junior)
- La lógica de negocio y las consultas SQL las escribe Mafe sobre esqueletos `// TODO`. Los agentes entregan esqueleto + concepto a estudiar, y solo escriben lógica si Mafe lo pide.
- Antes de modificar cualquier archivo se muestra `archivo:línea` y el porqué.
- Spec antes de código: Entradas, Salidas, Reglas y Criterios de Aceptación, aprobadas antes de implementar (skill `enrich-user-story`).
- Si algo funciona pero Mafe no puede explicarlo en 3 frases, la tarea no está terminada.

## Reglas estrictas de comportamiento
1. No crear archivos innecesarios. Solo los que expresamente se soliciten.
2. No modificar lógica que ya funciona, a menos que se indique.
3. No ejecutar scripts ni comandos irreversibles sin aprobación.
4. No asumir nada si falta información: preguntar antes de continuar.
5. No agregar funciones o mejoras no solicitadas.
6. Mantener el código modular, claro, comentado y breve.
7. No actuar proactivamente: ejecutar únicamente lo que se pide.

Las mejoras o refactorizaciones se proponen por separado y no se aplican sin confirmación.

## Git
- Rama de trabajo base: `mafe`. Una rama por tarea: `feature/<nombre>`.
- **Nunca** ejecutar `git commit`, `git push` ni comandos git irreversibles sin aprobación explícita. El mensaje del commit lo escribe Mafe, en español, formato libre.
- **Nunca** incluir atribución de IA en los commits.
- **Nunca** mostrar ni commitear `application.properties` con claves reales.

## Convenciones de código
- Nombres de clases, métodos y variables: español (`Producto`, `crear`, `leerTodo`).
- Comentarios y mensajes de log: español.

## Archivos desechables: `.scratch/`
Lo que una sesión produzca solo para investigar o diagnosticar (scripts de prueba, reproducciones, salidas intermedias) va en `.scratch/` en la raíz, que debe estar en `.gitignore`. Nunca junto al código del proyecto.

## Contexto y sesiones
- Una sesión, una historia (`HU-XXX`). Al cerrar la historia (commit hecho), la siguiente arranca con `/clear`; el handoff es "Contexto para siguiente fase" del ai-changelog.
- La exploración amplia del código se delega a subagentes: devuelven un resumen y no llenan el contexto principal.
- Al compactar (`/compact`), conservar: historia y rama en curso, CA pendientes, archivos modificados y decisiones tomadas con su porqué.

## Equipo de agentes
Los agentes viven en `.claude/agents/` (orquestador, funcional, arquitecto, auditor, logger, seguridad, backend, frontend, dba, tester). Estado de alineación: `doc/agent-alignment/REGISTRO.md`. Specs en `doc/specs/`, trazabilidad en `doc/ai-changelog/`.

## Mejora continua
Skill `continuous-learning`: detecta drift entre agentes/docs y el código real.
