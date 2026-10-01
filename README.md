# Limón Studios - Venta Online

Actualización del sitio original: se conservaron las páginas originales y se añadieron autenticación real de backend, panel cliente, panel administrador conectado a API, solicitudes personalizadas, políticas/cookies y estructura MySQL.

## Qué incluye

- Frontend original HTML/CSS/JS con carrito persistente en el navegador y estimador del configurador.
- API Node.js + Express + MySQL.
- Esquema de base de datos en `database/schema.sql`.
- Registro con contraseña Argon2, código de verificación por email, login/logout y recuperación por código.
- OAuth de Google preparado; necesita credenciales y URLs autorizadas.
- Cookies de sesión HttpOnly, Helmet, CORS, rate limiting y límites de tamaño de petición.
- Pedidos, seguimiento de proyectos, solicitudes personalizadas y panel admin basado en permisos de servidor.
- Asistente de soporte conectado a API compatible con OpenAI cuando se configura `AI_API_KEY`.
- Generador local de borradores de políticas; requiere revisión antes de publicar.
- Consentimiento local de cookies y enlace a políticas.

## Importante: integraciones pendientes

**Flow no cobra todavía:** la ruta devuelve un error claro hasta implementar y validar las firmas, callback y confirmación según la documentación vigente de Flow y añadir credenciales. No se debe anunciar pago automatizado hasta probar el flujo en sandbox y producción.

**Transferencia:** el pedido se crea y queda pendiente de revisión manual. El endpoint de comprobante acepta una URL HTTPS; antes de producción, implementar subida real a almacenamiento privado (S3/R2 u otro), escaneo y control de acceso. No aceptar enlaces públicos arbitrarios como evidencia final.

**WhatsApp:** se generan enlaces wa.me. Las notificaciones proactivas automáticas requieren WhatsApp Business Platform/proveedor autorizado y credenciales. El sitio no envía mensajes automáticamente a tu número todavía.

**Correo:** verificación y recuperación necesitan SMTP válido. Si SMTP no está configurado, la API falla de forma explícita; no se expone el código de verificación al cliente.

**Anti-DDoS:** rate limiting de aplicación no reemplaza protección de red. En producción, publicar detrás de Cloudflare u otro proveedor y ajustar límites según tráfico real.

## Requisitos

- Node.js 18+ (recomendado 20 LTS o 22 LTS).
- MySQL 8+.
- Credenciales SMTP para verificación y recuperación.
- Opcional: Google OAuth, Flow y proveedor IA.

## Instalación local

1. Crear la base de datos e importar `database/schema.sql` con MySQL Workbench o consola:

```bash
mysql -u root -p < database/schema.sql
```

2. Entrar al backend e instalar dependencias:

```bash
cd backend
npm install
cp .env.example .env
```

3. Editar `backend/.env`: MySQL, un `SESSION_SECRET` largo aleatorio, `FRONTEND_URL=http://localhost:8080`, email y credenciales opcionales.

4. Crear administrador. Usa una contraseña de al menos 14 caracteres:

```bash
npm run seed:admin
```

5. Verificar sintaxis e iniciar API:

```bash
npm run check
npm run dev
```

6. En otra terminal, desde la carpeta raíz del proyecto, servir el frontend:

```bash
python -m http.server 8080
```

Abrir `http://localhost:8080`. Si el puerto o dominio cambian, actualizar `FRONTEND_URL` en el backend y `api-config.js` en el frontend.

## Google OAuth

En Google Cloud Console crea un OAuth Client ID de tipo aplicación web. Añade como redirect URI exacta `http://localhost:3001/api/auth/google/callback` en desarrollo. Copia el ID y secreto en `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`. Para producción usa HTTPS y el callback del dominio real.

## Flow

Añade claves de sandbox y revisa la documentación oficial de Flow. Implementa firma criptográfica oficial, idempotencia, comprobación servidor-a-servidor del pago, monto/orden, protección contra repetición y callback. Nunca marques un pedido pagado solo por la redirección del navegador. La ruta actual está deliberadamente deshabilitada para no simular cobros.

## Producción: antes de publicar

- Usar HTTPS y `COOKIE_SECURE=true`.
- Cambiar `SESSION_SECRET` por un secreto robusto.
- Configurar almacenamiento de sesiones MySQL/Redis; Express MemoryStore no es adecuado para producción. La sesión actual usa el store por defecto y se debe sustituir antes del despliegue.
- Limitar CORS al dominio real; no usar dominios comodín.
- Configurar proxy Cloudflare, WAF y protección DDoS.
- Configurar SMTP, Google OAuth, Flow y proveedor IA.
- Añadir recuperación de contraseña con límite de intentos y rate limit específico, pruebas de integración y política de retención.
- Implementar subida segura de comprobantes y gestión de imágenes en almacenamiento privado.
- Revisar política de privacidad, cookies, términos, devoluciones y datos de la empresa con asesoría adecuada.
- No subir `.env` al repositorio.

## API principal

- `GET /api/health`
- `GET /api/services`
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `GET /api/auth/google` y callback
- `POST /api/auth/forgot-password`, `/reset-password`, `/logout`
- `POST /api/orders`, `GET /api/orders/mine`
- `POST /api/custom-requests`
- `POST /api/support/ai`
- `GET /api/admin/overview`, `/admin/orders`, `/admin/users`, `/admin/custom-requests`
- `PATCH /api/admin/orders/:id`, `/admin/users/:id`

## Límites actuales

No se ha podido verificar integración con credenciales reales ni hacer pruebas de extremo a extremo con MySQL, Google, SMTP, Flow o el proveedor IA porque dependen de cuentas y secretos externos. Este ZIP es una base funcional para continuar, no una declaración de que todas las integraciones estén listas para producción.


## Mejoras visuales y avisos de pedidos por WhatsApp
- Todas las páginas comparten un footer ampliado con enlaces, redes/contacto y CTA a WhatsApp.
- Se añadieron animaciones suaves de aparición al desplazarse y microinteracciones; se respeta `prefers-reduced-motion`.
- El backend puede enviar una notificación automática al número administrador configurado cuando se crea un pedido, mediante WhatsApp Cloud API de Meta.

### Activar la notificación automática
1. En Meta for Developers, configura una app de WhatsApp Business y consigue un token de acceso y el **Phone Number ID** del número remitente habilitado.
2. Copia `backend/.env.example` a `backend/.env` y configura `WHATSAPP_NUMBER=56937014472`, `WHATSAPP_ACCESS_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID`. No pongas el token en archivos frontend ni lo publiques en Git.
3. Reinicia el backend y haz una compra de prueba. La cuenta/número de WhatsApp debe estar habilitado en Meta y cumplir sus políticas.
4. Sin esas credenciales el pedido sigue guardándose, pero no se enviará el aviso automático. La API oficial puede requerir plantillas aprobadas para mensajes iniciados fuera de la ventana de atención.
