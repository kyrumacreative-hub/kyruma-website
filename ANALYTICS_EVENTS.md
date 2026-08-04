# Analytics events

Todos los eventos se envían al `dataLayer` con el prefijo `kyruma_`. En GTM, crear una etiqueta GA4 Event que tome el nombre de evento de la variable `Event` y mapear los parámetros necesarios.

| Evento de aplicación | Evento en dataLayer | Destino recomendado | Disparador |
| --- | --- | --- | --- |
| `hero_cta` | `kyruma_hero_cta` | GA4 | CTA principal o de navegación |
| `view_content` | `kyruma_view_content` | GA4 + Meta ViewContent | Vista de página |
| `contact` | `kyruma_contact` | GA4 + Meta Contact | Contacto enviado o email iniciado |
| `contact_submitted` | `kyruma_contact_submitted` | GA4 | Contacto validado por la API |
| `lead` | `kyruma_lead` | GA4 + Meta Lead + CAPI | Contacto validado por la API |
| `meeting_scheduled` | `kyruma_meeting_scheduled` | GA4 + Meta ScheduleMeeting | Reserva confirmada por Cal.com |
| `start_discovery` | `kyruma_start_discovery` | GA4 + Meta StartDiscovery | Discovery listo para usar |
| `discovery_opened` | `kyruma_discovery_opened` | GA4 | Apertura de `/workspace` |
| `conversation_started` | `kyruma_conversation_started` | GA4 | Primera conversación continuada |
| `conversation_completed` | `kyruma_conversation_completed` | GA4 | Conversación validada |
| `resume_discovery` | `kyruma_resume_discovery` | GA4 | Discovery restaurado |
| `exit_before_finish` | `kyruma_exit_before_finish` | GA4 | Salida antes de enviar |
| `complete_discovery` | `kyruma_complete_discovery` | GA4 + Meta CompleteDiscovery + CAPI | Discovery entregado |
| `scroll_50` / `scroll_90` | `kyruma_scroll_50` / `kyruma_scroll_90` | GA4 | Profundidad de página |

Cada evento incorpora, cuando existe consentimiento, `utm_source`, `utm_medium`, `utm_campaign`, `referrer` y `landing_page`.
