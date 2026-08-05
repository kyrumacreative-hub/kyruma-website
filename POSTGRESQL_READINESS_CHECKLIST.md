# PostgreSQL Readiness Checklist

No ejecutar esta checklist como despliegue. Es la preparación necesaria antes de activar persistencia real de Lead Lifecycle.

- [ ] `DATABASE_URL` configurada como variable de entorno de servidor, sin prefijo público.
- [ ] Proveedor, región, acceso de red, backup y restauración aprobados.
- [ ] Base de datos aislada por entorno (development, preview, production).
- [ ] Usuario con privilegios mínimos para migraciones y aplicación.
- [ ] Prisma Client generado en el entorno de build.
- [ ] `prisma migrate deploy` revisado y aprobado para el entorno objetivo.
- [ ] Backup probado antes de aplicar la primera migración.
- [ ] Pruebas de integración ejecutadas contra una base no productiva.
- [ ] Restricciones de unicidad, rollback y concurrencia verificadas.
- [ ] Observabilidad de conexión, migración y errores configurada.

Sin una `DATABASE_URL` real no se aplicarán migraciones, no se crearán datos y no se ejecutarán pruebas de integración.
