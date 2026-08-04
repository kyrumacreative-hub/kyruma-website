# RELEASE_CHECKLIST

## KYRUMA Discovery™ v1.0 — Release Candidate (RC1)

### Producto y contenido

- [x] Bienvenida consultiva y claim de KYRUMA Discovery™.
- [x] Ocho conversaciones visibles y coherentes.
- [x] Sin referencias visibles a Website Brief ni a productos técnicos.
- [x] Tono, ortografía y consistencia revisados.
- [x] Resumen editable previo al envío.
- [x] Pantalla final orientada a la reunión de Discovery.

### Flujo funcional

- [x] Navegación adelante, atrás y entre conversaciones.
- [x] Validación de campos obligatorios.
- [x] Barra de progreso de 1 a 8.
- [x] Guardado automático y reanudación verificados tras recarga.
- [x] Estados de carga y error de envío implementados.
- [x] API valida los datos y genera un correo legible y escapado.
- [ ] Prueba controlada de recepción de correo en el entorno de producción.

### Experiencia y accesibilidad

- [x] Revisión responsive a 390 px y 1440 px.
- [x] Espaciado, jerarquía, contraste y estados interactivos revisados.
- [x] Foco visible global.
- [x] Campos agrupados semánticamente con `fieldset` y `legend`.
- [x] Opciones de radio agrupadas para navegación por teclado.
- [x] Errores comunicados mediante alertas y descripciones asociadas.

### Calidad técnica

- [x] `npm run lint` sin errores ni avisos.
- [x] TypeScript sin errores.
- [x] Build de producción correcto.
- [x] Consola limpia en una sesión nueva del Discovery.
- [x] Código y dependencias obsoletos retirados.
- [x] Imagen editorial optimizada mediante Next.js.

## Estado de entrega

**KYRUMA Discovery™ v1.0 — Release Candidate (RC1)**

El candidato está listo para la prueba de correo controlada. Una vez confirmada esa única recepción en producción, estará listo para enviarse al primer cliente real.
