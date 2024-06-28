import "./calendar.css";

let calendarDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    export function loadCalendar() {
        const calendar = document.querySelector(".calendar");
        const date = new Date();
        const options = {
            showDay: true,
            showFullDayName: true,
            showToday: true
        };
        const calendarHTML = weekCalendar(date, options);
        calendar.innerHTML = `
            <section id="weekCalendar">
                <div class="today">today</div>
                ${calendarHTML}
            </section>
        `;
    }

    function calendarWeekHtml(arrWeekDays) {
        let html = "<thead><tr>";
        arrWeekDays.forEach((day, idx) => {
            html += "<th";
            if (idx === 0) {
              html += " class=\"Sun\"";
            } else if (idx === 6) {
              html += " class=\"Sat\"";
            } else if (idx === 3) {
              html += " class=\"todayDate\"";
            }
            html += ">" + calendarDays[day] + "</th>";
        });
        html += "</tr></thead>";
        return html;
    }

    let hashmapCalendarHoliday = {
        "1-1": { "title": "새해" },
        "3-1": { "title": "삼일절" },
        "5-5": { "title": "어린이날" },
        "6-6": { "title": "현충일" },
        "8-15": { "title": "광복절" },
        "10-3": { "title": "개천절" },
        "10-9": { "title": "한글날" },
        "12-25": { "title": "성탄절" }
    };

    function getCalendarHoliday(calendarYear, calendarMonth, calendarDay) {
        if (Object.keys(hashmapCalendarHoliday).length === 0) {
            return null;
        }
        let holidayInfo = hashmapCalendarHoliday[calendarMonth + "-" + calendarDay];
        return holidayInfo;
    }

    function setCalendarOptions(options) {
        if (options.showDay === undefined || options.showDay === null || typeof options.showDay !== "boolean") {
            options.showDay = true;
        }
        if (options.showFullDayName === undefined || options.showFullDayName === null || typeof options.showFullDayName !== "boolean") {
            options.showFullDayName = false;
        }
        if (options.showToday === undefined || options.showToday === null || typeof options.showToday !== "boolean") {
            options.showToday = true;
        }

        if (options.arHoliday !== undefined && options.arHoliday !== null && Array.isArray(options.arHoliday)) {
            Object.assign(hashmapCalendarHoliday, options.arHoliday);
        }
    }

    function weekCalendar(date, options) {
        if (date === undefined || date === null || typeof date !== "object" || !(date instanceof Date)) {
            return "";
        }

        setCalendarOptions(options);

        let today = date;
        let calendarYear = today.getFullYear();
        let calendarMonth = today.getMonth() + 1;
        let calendarToday = today.getDate();
        let monthLastDate = new Date(calendarYear, calendarMonth, 0).getDate();
        let prevMonthLastDate = new Date(calendarYear, calendarMonth - 1, 0).getDate();
        let calendarMonthTodayDay = today.getDay();

        let arrWeek = [0, 0, 0, 0, 0, 0, 0];
        let arrWeekDays = [0, 0, 0, 0, 0, 0, 0];

        for (let i = -3; i <= 3; i++) {
            let dayOffset = calendarToday + i;
            let targetDate;
            let targetDay = (calendarMonthTodayDay + i + 7) % 7;

            if (dayOffset <= 0) {
                targetDate = prevMonthLastDate + dayOffset;
            } else if (dayOffset > monthLastDate) {
                targetDate = dayOffset - monthLastDate;
            } else {
                targetDate = dayOffset;
            }

            arrWeek[i + 3] = targetDate;
            arrWeekDays[i + 3] = targetDay;
        }

        let html = "<table>";
        html += calendarWeekHtml(arrWeekDays);
        html += "<tbody><tr>";

        arrWeek.forEach((day, idx) => {
            let holidayInfo = getCalendarHoliday(calendarYear, calendarMonth, day);
            let dayClass = "";
            if (idx === 0) {
                dayClass = "Sun";
            } else if (idx === 6) {
                dayClass = "Sat";
            }
            if (holidayInfo) {
                dayClass += " holiday";
            }
            if (day === calendarToday) {
                dayClass += "todayDate";
            }

            html += `<td class="${dayClass}">${day}</td>`;
        });

        html += "</tr></tbody></table>";

        return html;
    }
