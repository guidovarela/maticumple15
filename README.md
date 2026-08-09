# 🌙 Tarjeta de Invitación y RSVP - Mis 15 Años

Landing page interactiva, moderna y completamente responsiva desarrollada para la confirmación de asistencia y difusión de un cumpleaños de 15. El diseño está inspirado en la estética nocturna/mística de *Fixdate 15 Moon*, adaptada con una paleta cromática personalizada en tonos azul noche, violeta místico y detalles en gris plata.

---

## 🎨 Paleta de Colores

El proyecto utiliza variables CSS (`:root`) definidas a partir de la siguiente paleta cromática:

* **Azul Noche / Fondo Principal:** `#0C1166`
* **Violeta Místico / Acentos:** `#796D99`
* **Gris Plata / Texto Muted:** `#A1A1A1`
* **Blanco Neutro / Contraste:** `#EBEBEB`

---

## ✨ Características y Secciones

* **Portada (Hero):** Presentación del evento con el nombre de la cumpleañera, frase personalizada y fecha destacada.
* **Cuenta Regresiva:** Contador en tiempo real configurado hacia la fecha objetivo (**03/10/2026 - 21:00 hs**).
* **Ubicación & Agendado:**
  * Integración con **Google Maps** para visualizar la ubicación del salón.
  * Botón **"Agendar en Google Calendar"** que genera de forma automática el evento con fecha, horario y detalle.
* **Confirmación de Asistencia (RSVP):** Formulario para ingresar Nombre, Apellido, Confirmación de asistencia y Restricciones alimenticias (Celíaco, Vegetariano, Vegano, etc.).
* **Detalles Interactivos:**
  * **Sugerencia de Canciones:** Formulario directo para que los invitados dejen temas para la playlist.
  * **Dress Code:** Ventana modal con información sobre el código de vestimenta y enlace directo a un tablero de Pinterest.
* **Módulo de Regalos:**
  * Muestra el alias/CBU de MercadoPago.
  * Botón interactivo para **copiar el alias al portapapeles** con un solo clic.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructuración semántica de la página web.
* **CSS3:** Maquetación responsiva (*Flexbox* / *Grid*), animaciones suaves, variables CSS y ventanas modales.
* **JavaScript (ES6+):** Manipulación del DOM, lógica del contador regresivo, copiado al portapapeles y captura de datos.
* **Google Apps Script / Webhook:** Procesamiento de respuestas enviadas desde el frontend hacia Google Sheets sin necesidad de backend propio.

---

## 📊 Configuración de la Base de Datos (Google Sheets)

La captura de respuestas se realiza mediante un Webhook que envía los datos en formato JSON a **Google Sheets**.

### Pasos para conectar tu propia hoja de cálculo:

1. Crea una hoja en **Google Sheets** con los siguientes encabezados en la Fila 1:
   `Fecha` | `Nombre` | `Asistencia` | `Restriccion` | `Tipo` | `Cancion`
2. Ve a **Extensiones > Apps Script** e inserta el script receptor (`doPost(e)`).
3. Haz clic en **Desplegar > Nuevo despliegue**:
   * **Tipo:** Aplicación Web.
   * **Ejecutar como:** Yo.
   * **Quién tiene acceso:** Cualquier persona (*Anyone*).
4. Copia la URL del despliegue (`https://script.google.com/macros/s/.../exec`).
5. Pega la URL en la constante `GOOGLE_SCRIPT_URL` dentro de tu archivo `script.js`:

```javascript
const GOOGLE_SCRIPT_URL = "TU_URL_DE_GOOGLE_APPS_SCRIPT";