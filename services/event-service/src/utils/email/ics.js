const crypto = require("crypto");

function pad(n) {
    return String(n).padStart(2, "0");
}

// NOTE: Convert a JS Date (or ISO string) into ICS UTC format: YYYYMMDDTHHMMSSZ
function toICSDate(dateInput) {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
        d.getUTCDate()
    )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(
        d.getUTCSeconds()
    )}Z`;
}

// NOTE: Escape newline and commas for ICS TEXT fields
function escapeText(text = "") {
    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,");
}

function generateUID(prefix = "event") {
    // simple unique id
    const rand = crypto.randomBytes(8).toString("hex");
    return `${prefix}-${Date.now()}-${rand}@kidsplan`;
}

/**
 * Build ICS content.
 * options:
 *  - title, description, location
 *  - start (ISO string or Date)  -> start datetime of first occurrence
 *  - end (ISO string or Date)    -> end datetime of first occurrence
 *  - attendees: array of emails (optional)
 *  - recurrence: { freq: 'WEEKLY'|'DAILY'|'MONTHLY', count: number, until: ISOString } (optional)
 *  - method: 'REQUEST'|'PUBLISH' (REQUEST will mark as invitation with attendees)
 */
function buildICS(options = {}) {
    const {
        title = "",
        description = "",
        location = "",
        start,
        end,
        // attendees = [],
        recurrence = null,
        method = "PUBLISH", // 'REQUEST' makes mail clients treat it as meeting invite
        uid = generateUID(),
    } = options;

    if (!start || !end) throw new Error("start and end are required");

    const dtstamp = toICSDate(new Date());
    const dtstart = toICSDate(start);
    const dtend = toICSDate(end);

    const lines = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("PRODID:-//YourApp//EN");
    lines.push("VERSION:2.0");
    lines.push(`METHOD:${method}`); // METHOD optional; useful for invites
    lines.push("CALSCALE:GREGORIAN");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    lines.push(`SUMMARY:${escapeText(title)}`);
    if (description) lines.push(`DESCRIPTION:${escapeText(description)}`);
    if (location) lines.push(`LOCATION:${escapeText(location)}`);

    // Attendees (RFC: ATTENDEE;CN=Name:mailto:email)
    // Many clients accept ATTENDEE:mailto:email as well.
    // for (const email of attendees) {
    //     lines.push(
    //         `ATTENDEE;CN="${escapeText(
    //             email
    //         )}";ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${email}`
    //     );
    // }

    // recurrence (RRULE)
    if (recurrence) {
        // recurrence = { freq: 'WEEKLY', interval: 1, count: 10, until: '2025-12-31T23:59:59Z', byday: 'MO,WE' }
        const rparts = [];
        if (!recurrence.freq) throw new Error("recurrence.freq required");
        rparts.push(`FREQ=${recurrence.freq.toUpperCase()}`);
        if (recurrence.interval && Number(recurrence.interval) > 1) {
            rparts.push(`INTERVAL=${Math.max(1, Number(recurrence.interval))}`);
        }
        if (recurrence.count) {
            rparts.push(`COUNT=${Number(recurrence.count)}`);
        } else if (recurrence.until) {
            // UNTIL must be in UTC format YYYYMMDDTHHMMSSZ
            const until = toICSDate(recurrence.until);
            rparts.push(`UNTIL=${until}`);
        }
        if (recurrence.byday) {
            // e.g., 'MO,WE,FR'
            rparts.push(`BYDAY=${recurrence.byday}`);
        }
        lines.push(`RRULE:${rparts.join(";")}`);
    }

    lines.push("END:VEVENT");
    lines.push("END:VCALENDAR");

    // ICS must use CRLF (\r\n)
    return lines.join("\r\n");
}

module.exports = { buildICS, toICSDate, generateUID };
