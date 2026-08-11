/* ==========================================================================
   6. AGENDAR EN GOOGLE CALENDAR
   ========================================================================== */
function initCalendarButton() {
  const btnCalendar = document.getElementById("btn-calendar");
  if (!btnCalendar) return;

  btnCalendar.addEventListener("click", () => {
    // Formato UTC: AAAA-MM-DD-THHMMSSZ
    // Octubre 3, 2026, 21:00 hs Argentina (UTC-3) -> 2026-10-04 00:00:00 UTC
    // Finalización: Octubre 4, 2026, 05:00 hs Argentina -> 2026-10-04 08:00:00 UTC
    const title = encodeURIComponent("Los 15 de Matilda");
    const details = encodeURIComponent("¡Celebremos juntos!");
    const location = encodeURIComponent("Jano`s San Telmo II- Moreno 550 , CABA, Argentina");
    const dates = "20261004T000000Z/20261004T080000Z";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;

    window.open(calendarUrl, "_blank");
    showToast("🗓️ Redirigiendo a Google Calendar...");
  });
}

/* ==========================================================================
   6. AGENDAR EN CALENDAR Iphone
   ========================================================================== */
function initCalendarButtonIphone() {
  const btnCalendarIphone = document.getElementById("btn-calendar-iphone");
  if (!btnCalendarIphone) return;  
  
  btnCalendarIphone.addEventListener("click", () => {
    const title = encodeURIComponent("Los 15 de Matilda");
    const details = encodeURIComponent("¡Celebremos juntos!");
    const location = encodeURIComponent("Jano`s San Telmo II- Moreno 550 , CABA, Argentina");
    const startDate = "20261003T210000"; // 3 de Octubre de 2026, 21:00 hs
    const endDate = "20261004T050000"; // 4 de Octubre de 2026, 05:00 hs

    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${title}%0ADESCRIPTION:${details}%0ALOCATION:${location}%0ADTSTART:${startDate}%0ADTEND:${endDate}%0AEND:VEVENT%0AEND:VCALENDAR`;

    window.open(calendarUrl, "_blank");
    showToast("�🗓️ Redirigiendo a Calendar iPhone...");
  });

}
 export { initCalendarButton, initCalendarButtonIphone };