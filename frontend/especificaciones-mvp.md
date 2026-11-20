# BA Protege+
**Entregable integrado de investigación y diseño**
*Innova Lab · 12 de octubre de 2026*

Integración de aportes de UX/UI, Front/Mobile, Backend, Data y QA. Etapa de investigación e ideación: cierre de Sprint 2 y preparación del desarrollo.

---

## 1. Problemática
Las familias necesitan herramientas que acompañen la protección de niños, niñas y adolescentes frente al acceso a sitios de apuestas online. El proyecto aborda la dificultad de aplicar restricciones en los dispositivos y ofrecer al adulto información comprensible sobre su funcionamiento.

La protección requiere combinar facilidad de configuración, reglas actualizadas y un mecanismo técnico que funcione en Android. También debe evitar recopilar información innecesaria sobre las personas menores y comunicar con claridad los límites del sistema.

UX/UI elaboró perfiles preliminares del adulto responsable y del adolescente, e investigó aplicaciones similares. Estos perfiles orientan el diseño, pero sus afirmaciones sobre hábitos, montos y frecuencia de uso se consideran hipótesis mientras no exista investigación que las respalde.

**Necesidades prioritarias:**
- Vincular dispositivos de forma sencilla.
- Conocer el estado de protección.
- Restringir sitios incluidos en las listas.
- Consultar acontecimientos relevantes.
- Comprender qué datos se registran.

### Comparación de aplicaciones similares
UX/UI comparó tres aplicaciones de bloqueo de apuestas (basado en el informe UX/UI):

| Aplicación | Enfoque | Vinculación y bloqueo | Limitación señalada |
| :--- | :--- | :--- | :--- |
| **StopApuestas** | Control parental para proteger a menores; foco en apuestas ilegales. | Dos apps (adulto y menor) vinculadas; VPN local con lista blanca oficial; avisos en tiempo real y registro de solicitudes. | Lista blanca rígida: el adulto debe autorizar apps cotidianas; requiere mantener dos apps. |
| **BetBlocker** | Autoexclusión del juego; control parental opcional. | Se configura en el propio dispositivo, sin registro de cuenta; bloqueo por duración. | Enfoque de nicho; sin gestión remota centralizada para padres. |
| **NoVa+ (Lotería de Córdoba)** | Control parental y bloqueo de apuestas ilegales. | Enlace directo entre el dispositivo del tutor y el del menor; registra intentos de ingreso. | Requiere actualizaciones constantes por la rapidez con que cambian los dominios. |

**Lecciones para BA Protege+:**
- StopApuestas usa VPN local como mecanismo de bloqueo. Eso respalda la propuesta del equipo, pero no demuestra que funcione en nuestro caso: sigue por validar en Android.
- Las apps de referencia apuntan a una configuración guiada y simple para el adulto.

---

## 2. Solución planteada originalmente
La propuesta de control parental recibida contempla un entorno para el adulto responsable y otro para el dispositivo protegido, vinculación entre ambos, reglas de bloqueo basadas en una lista oficial y sitios personalizados, registro de actividad relevante y alertas. También plantea investigar continuidad de la protección y mecanismos frente a modificaciones o evasión.

Esta propuesta funciona como marco de trabajo. El cronograma es una ruta sugerida y puede ajustarse al avance real del equipo. Las capacidades técnicas deben comprobarse; su inclusión en el planteo no demuestra que ya estén implementadas. Se admiten pruebas de código anticipadas, sin exigir que todos los servicios estén terminados en esta etapa.

---

## 3. Solución que desarrollará el equipo

### 3.1. Alcance del MVP
- **Stack base:** Aplicación Android desarrollada en **React Native con Expo**, con dos modos: **Responsable** y **Dispositivo protegido**. Backend en **Node.js/Express** y **PostgreSQL** para los servicios y la persistencia.
- **Componentes del MVP:** Registro e ingreso del adulto, panel de dispositivos, vinculación por código temporal, autorización y comprobación de servicios de protección, bloqueo según reglas, eventos e historial de alertas.
- **Entidad administrada:** La unidad administrada es el **dispositivo protegido**, identificado mediante un alias elegido por el adulto; **no se crea una entidad Hijo**.
- **Capacidad:** Admitir al menos 4 dispositivos y hasta 15 por cuenta (pendiente de ratificación). Se estudia configuración individual por dispositivo.
- **Fuera de alcance:** Supervisión de transferencias de dinero, ubicación y tableros institucionales.

#### Funcionalidades del MVP y su prioridad (todas de prioridad alta)

| N.º | Funcionalidad | Para qué sirve | Estado |
| :--- | :--- | :--- | :--- |
| 1 | Registro e inicio de sesión | Identificar al responsable y darle acceso a su cuenta. | Autenticación por definir (Firebase o JWT propio). |
| 2 | Selección de modo de uso | Define si el dispositivo es Responsable o Protegido. | Diseñado. |
| 3 | Panel del responsable | Administrar dispositivos, consultar eventos y alertas. | Diseñado. |
| 4 | Vinculación | Relacionar el dispositivo del menor con el responsable. | El equipo trabaja con código; el MVP menciona código o QR: decidir. |
| 5 | Configuración de protección | Definir qué sitios se bloquean. | Alcance global o por dispositivo pendiente. |
| 6 | Autorización de permisos | Habilitar servicios especiales del sistema. | Por validar en Android. |
| 7 | Verificación de permisos | Comprobar los servicios antes de considerar protegido el dispositivo. | Por validar en Android. |
| 8 | Activación de la protección | Aplicar la configuración. | Depende de las funciones 6 y 7. |
| 9 | Bloqueo de sitios | Impedir el acceso a sitios incluidos en las reglas. | Por validar con prueba técnica. |
| 10 | Registro de eventos | Guardar intentos de acceso y de modificación de la protección. | Catálogo por acordar. |
| 11 | Alertas al responsable | Avisar cuando ocurre algo relevante. | Agrupación y envío por definir. |
| 12 | Protección contra desactivación | Dificultar que se quite o modifique la protección. | Objetivo por validar; no es una garantía. |

**Decisión pendiente (unidad de configuración):** El MVP plantea configuración «por hijo/dispositivo» y sugiere reglas distintas según la edad. El diseño de Backend administra dispositivos y no crea una entidad Hijo. Si hiciera falta la edad, Backend propone preguntarla al adulto responsable y no al menor.

---

### 3.2. Recorrido principal y pantallas
1. El adulto elige modo **Responsable**, se registra o inicia sesión y accede al panel.
2. Solicita al backend un **código temporal de vinculación** y lo ve en su pantalla.
3. En el teléfono protegido se selecciona ese modo y se ingresa el código.
4. Backend verifica vigencia y uso, vincula el dispositivo y entrega su credencial técnica. El código queda consumido.
5. Mobile guía la autorización de los servicios Android, descarga reglas y comprueba el estado de protección.
6. El mecanismo local intenta impedir conexiones incluidas en las reglas. Mobile envía los eventos pertinentes al backend; sin conexión conserva una cola mínima para reintentar.
7. Backend guarda eventos, evita duplicados y aplica la política de alertas. El adulto consulta sus dispositivos, historial y alertas.

**Pantallas previstas:** Selección de modo, registro/ingreso, panel y detalle de dispositivos, código e ingreso de vinculación, configuración de permisos, estado de protección, listas, historial y alertas.
**Estados visuales requeridos:** Vacío, carga, error, código vencido, desconexión y actualización pendiente.

---

### 3.3. Aportes por rol y coordinación
- **UX/UI:** Perfiles preliminares, comparación de aplicaciones y flujos. Coordina navegación, textos, accesibilidad y wireframes con Front; acciones que requieren servicios con Backend.
- **Front/Mobile:** Arquitectura de pantallas, almacenamiento seguro, reglas locales, cola de eventos e integración Android.
- **Backend:** Arquitectura, revisión de seis diagramas, modelo de entidades, códigos, listas, eventos y alertas. Jian aportó ejemplos de API e informó pruebas iniciales del código de vinculación (vencimiento y consumo, con límite de intentos pendiente).
- **Data:** Propuesta relacional, campos, catálogo de eventos y métricas. Normalización de dominios y eventos detectables.
- **QA:** Plan de pruebas funcionales, API, seguridad, conectividad, compatibilidad y accesibilidad (Android 11 a 14; quedan fuera iOS y el control remoto de la protección).

#### Casos de prueba QA

| Flujo | Casos | Estado |
| :--- | :--- | :--- |
| Vinculación | 18 casos (VIN-01 a VIN-18) | Preparados; la ejecución comienza al contar con la versión de prueba |
| Registro e ingreso | A definir | Por preparar |
| Listas de sitios | A definir | Por preparar |
| Bloqueo | A definir | Por preparar |
| Sin conexión | A definir | Por preparar |
| Alertas | A definir | Por preparar |

**Entorno de prueba:** Dos dispositivos Android (uno adulto y uno protegido; el bloqueo real se prueba en celular físico), compilación de desarrollo (las notificaciones no funcionan en Expo Go), cuenta de prueba, acceso al servidor, Postman y Jira.

**Riesgos principales:** Continuidad del bloqueo en segundo plano y tras reiniciar el teléfono; prevención de desinstalación o cambio de permisos; fuente y formato de la lista LOTBA; privacidad del historial de actividad de menores; entrega de alertas sin conexión.

---

### 3.4. Arquitectura y tratamiento de datos
- **Mecanismo de filtrado:** Se propone VPN local en Android. Mobile debe comprobar bloqueo, navegación permitida, segundo plano, reinicio, pérdida de permisos y conflicto con otra VPN.
- **Listas:** La lista oficial se mantiene separada de las personalizadas, con origen verificable y versiones. Su entrega por LOTBA y actualización siguen sin confirmar. Ante fallos se conserva la última versión válida; las listas de prueba se identifican como tales.
- **Privacidad:** Se propone registrar datos mínimos, dominio sin URL completa cuando corresponda y fechas de ocurrencia y recepción.
