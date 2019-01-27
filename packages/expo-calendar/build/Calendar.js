import { UnavailabilityError } from 'expo-errors';
import { Platform, processColor } from 'react-native';
import ExpoCalendar from './ExpoCalendar';
export async function getCalendarsAsync(entityType) {
    if (!entityType) {
        return ExpoCalendar.getCalendarsAsync(null);
    }
    return ExpoCalendar.getCalendarsAsync(entityType);
}
export async function createCalendarAsync(details = {}) {
    let color = details.color ? processColor(details.color) : undefined;
    const newDetails = { ...details, id: undefined, color };
    return ExpoCalendar.saveCalendarAsync(newDetails);
}
export async function updateCalendarAsync(id, details = {}) {
    if (!id) {
        throw new Error('updateCalendarAsync must be called with an id (string) of the target calendar');
    }
    let color = details.color ? processColor(details.color) : undefined;
    if (Platform.OS === 'android') {
        if (details.hasOwnProperty('source') ||
            details.hasOwnProperty('color') ||
            details.hasOwnProperty('allowsModifications') ||
            details.hasOwnProperty('allowedAvailabilities') ||
            details.hasOwnProperty('isPrimary') ||
            details.hasOwnProperty('ownerAccount') ||
            details.hasOwnProperty('timeZone') ||
            details.hasOwnProperty('allowedReminders') ||
            details.hasOwnProperty('allowedAttendeeTypes') ||
            details.hasOwnProperty('accessLevel')) {
            console.warn('updateCalendarAsync was called with one or more read-only properties, which will not be updated');
        }
    }
    else {
        if (details.hasOwnProperty('source') ||
            details.hasOwnProperty('type') ||
            details.hasOwnProperty('entityType') ||
            details.hasOwnProperty('allowsModifications') ||
            details.hasOwnProperty('allowedAvailabilities')) {
            console.warn('updateCalendarAsync was called with one or more read-only properties, which will not be updated');
        }
    }
    const newDetails = { ...details, id, color };
    return ExpoCalendar.saveCalendarAsync(newDetails);
}
export async function deleteCalendarAsync(id) {
    if (!id) {
        throw new Error('deleteCalendarAsync must be called with an id (string) of the target calendar');
    }
    return ExpoCalendar.deleteCalendarAsync(id);
}
export async function getEventsAsync(calendarIds, startDate, endDate) {
    if (!startDate) {
        throw new Error('getEventsAsync must be called with a startDate (date) to search for events');
    }
    if (!endDate) {
        throw new Error('getEventsAsync must be called with an endDate (date) to search for events');
    }
    if (!calendarIds || !calendarIds.length) {
        throw new Error('getEventsAsync must be called with a non-empty array of calendarIds to search');
    }
    return ExpoCalendar.getEventsAsync(startDate, endDate, calendarIds);
}
export async function getEventAsync(id, { futureEvents = false, instanceStartDate } = {}) {
    if (!id) {
        throw new Error('getEventAsync must be called with an id (string) of the target event');
    }
    if (Platform.OS === 'ios') {
        return ExpoCalendar.getEventByIdAsync(id, instanceStartDate);
    }
    else {
        return ExpoCalendar.getEventByIdAsync(id);
    }
}
export async function createEventAsync(calendarId, details = {}) {
    if (!calendarId) {
        throw new Error('createEventAsync must be called with an id (string) of the target calendar');
    }
    if (Platform.OS === 'android') {
        if (!details.startDate) {
            throw new Error('createEventAsync requires a startDate (Date)');
        }
        if (!details.endDate) {
            throw new Error('createEventAsync requires an endDate (Date)');
        }
        if (!details.timeZone) {
            throw new Error('createEventAsync requires a timeZone (string)');
        }
    }
    const newDetails = {
        ...details,
        id: undefined,
        calendarId: calendarId === DEFAULT ? undefined : calendarId,
    };
    return ExpoCalendar.saveEventAsync(newDetails, {});
}
export async function updateEventAsync(id, details = {}, { futureEvents = false, instanceStartDate } = {}) {
    if (!id) {
        throw new Error('updateEventAsync must be called with an id (string) of the target event');
    }
    if (Platform.OS === 'ios') {
        if (details.hasOwnProperty('creationDate') ||
            details.hasOwnProperty('lastModifiedDate') ||
            details.hasOwnProperty('originalStartDate') ||
            details.hasOwnProperty('isDetached') ||
            details.hasOwnProperty('status') ||
            details.hasOwnProperty('organizer')) {
            console.warn('updateEventAsync was called with one or more read-only properties, which will not be updated');
        }
    }
    const newDetails = { ...details, id, instanceStartDate };
    return ExpoCalendar.saveEventAsync(newDetails, { futureEvents });
}
export async function deleteEventAsync(id, { futureEvents = false, instanceStartDate } = {}) {
    if (!id) {
        throw new Error('deleteEventAsync must be called with an id (string) of the target event');
    }
    return ExpoCalendar.deleteEventAsync({ id, instanceStartDate }, { futureEvents });
}
export async function getAttendeesForEventAsync(id, { futureEvents = false, instanceStartDate } = {}) {
    if (!id) {
        throw new Error('getAttendeesForEventAsync must be called with an id (string) of the target event');
    }
    // Android only takes an ID, iOS takes an object
    const params = Platform.OS === 'ios' ? { id, instanceStartDate } : id;
    return ExpoCalendar.getAttendeesForEventAsync(params);
}
export async function createAttendeeAsync(eventId, details = {}) {
    if (Platform.OS === 'ios') {
        throw new Error('createAttendeeAsync is not available on iOS');
    }
    if (!eventId) {
        throw new Error('createAttendeeAsync must be called with an id (string) of the target event');
    }
    if (!details.email) {
        throw new Error('createAttendeeAsync requires an email (string)');
    }
    if (!details.role) {
        throw new Error('createAttendeeAsync requires a role (string)');
    }
    if (!details.type) {
        throw new Error('createAttendeeAsync requires a type (string)');
    }
    if (!details.status) {
        throw new Error('createAttendeeAsync requires a status (string)');
    }
    const newDetails = { ...details, id: undefined };
    return ExpoCalendar.saveAttendeeForEventAsync(newDetails, eventId);
} // Android
export async function updateAttendeeAsync(id, details = {}) {
    if (Platform.OS === 'ios') {
        throw new Error('updateAttendeeAsync is not available on iOS');
    }
    if (!id) {
        throw new Error('updateAttendeeAsync must be called with an id (string) of the target event');
    }
    const newDetails = { ...details, id };
    return ExpoCalendar.saveAttendeeForEventAsync(newDetails, null);
} // Android
export async function deleteAttendeeAsync(id) {
    if (Platform.OS === 'ios') {
        throw new Error('deleteAttendeeAsync is not available on iOS');
    }
    if (!id) {
        throw new Error('deleteAttendeeAsync must be called with an id (string) of the target event');
    }
    return ExpoCalendar.deleteAttendeeAsync(id);
} // Android
export async function getRemindersAsync(calendarIds, status, startDate, endDate) {
    if (Platform.OS === 'android') {
        throw new Error('getRemindersAsync is not available on Android');
    }
    if (status && !startDate) {
        throw new Error('getRemindersAsync must be called with a startDate (date) to search for reminders');
    }
    if (status && !endDate) {
        throw new Error('getRemindersAsync must be called with an endDate (date) to search for reminders');
    }
    if (!calendarIds || !calendarIds.length) {
        throw new Error('getRemindersAsync must be called with a non-empty array of calendarIds to search');
    }
    return ExpoCalendar.getRemindersAsync(startDate || null, endDate || null, calendarIds, status || null);
} // iOS
export async function getReminderAsync(id) {
    if (Platform.OS === 'android') {
        throw new Error('getReminderAsync is not available on Android');
    }
    if (!id) {
        throw new Error('getReminderAsync must be called with an id (string) of the target reminder');
    }
    return ExpoCalendar.getReminderByIdAsync(id);
} // iOS
export async function createReminderAsync(calendarId, details = {}) {
    if (Platform.OS === 'android') {
        throw new Error('createReminderAsync is not available on Android');
    }
    if (!calendarId) {
        throw new Error('createReminderAsync must be called with an id (string) of the target calendar');
    }
    const newDetails = {
        ...details,
        id: undefined,
        calendarId: calendarId === DEFAULT ? undefined : calendarId,
    };
    return ExpoCalendar.saveReminderAsync(newDetails);
} // iOS
export async function updateReminderAsync(id, details = {}) {
    if (Platform.OS === 'android') {
        throw new Error('updateReminderAsync is not available on Android');
    }
    if (!id) {
        throw new Error('updateReminderAsync must be called with an id (string) of the target reminder');
    }
    if (details.hasOwnProperty('creationDate') || details.hasOwnProperty('lastModifiedDate')) {
        console.warn('updateReminderAsync was called with one or more read-only properties, which will not be updated');
    }
    const newDetails = { ...details, id };
    return ExpoCalendar.saveReminderAsync(newDetails);
} // iOS
export async function deleteReminderAsync(id) {
    if (Platform.OS === 'android') {
        throw new Error('deleteReminderAsync is not available on Android');
    }
    if (!id) {
        throw new Error('deleteReminderAsync must be called with an id (string) of the target reminder');
    }
    return ExpoCalendar.deleteReminderAsync(id);
} // iOS
export async function getSourcesAsync() {
    if (!ExpoCalendar.getSourcesAsync) {
        throw new UnavailabilityError('Calendar', 'getSourcesAsync');
    }
    return ExpoCalendar.getSourcesAsync();
} // iOS
export async function getSourceAsync(id) {
    if (Platform.OS === 'android') {
        throw new Error('getSourceAsync is not available on Android');
    }
    if (!id) {
        throw new Error('getSourceAsync must be called with an id (string) of the target source');
    }
    return ExpoCalendar.getSourceByIdAsync(id);
} // iOS
export function openEventInCalendar(id) {
    if (Platform.OS === 'ios') {
        console.warn('openEventInCalendar is not available on iOS');
        return;
    }
    if (!id) {
        throw new Error('openEventInCalendar must be called with an id (string) of the target event');
    }
    return ExpoCalendar.openEventInCalendar(parseInt(id, 10));
} // Android
export async function requestPermissionsAsync() {
    if (!ExpoCalendar.requestPermissionsAsync) {
        throw new UnavailabilityError('Calendar', 'requestPermissionsAsync');
    }
    return await ExpoCalendar.requestPermissionsAsync();
}
export async function requestRemindersPermissionsAsync() {
    if (!ExpoCalendar.requestRemindersPermissionsAsync) {
        throw new UnavailabilityError('Calendar', 'requestRemindersPermissionsAsync');
    }
    return await ExpoCalendar.requestRemindersPermissionsAsync();
}
export const EntityTypes = {
    EVENT: 'event',
    REMINDER: 'reminder',
};
export const Frequency = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
};
export const Availability = {
    NOT_SUPPORTED: 'notSupported',
    BUSY: 'busy',
    FREE: 'free',
    TENTATIVE: 'tentative',
    UNAVAILABLE: 'unavailable',
};
export const CalendarType = {
    LOCAL: 'local',
    CALDAV: 'caldav',
    EXCHANGE: 'exchange',
    SUBSCRIBED: 'subscribed',
    BIRTHDAYS: 'birthdays',
}; // iOS
export const EventStatus = {
    NONE: 'none',
    CONFIRMED: 'confirmed',
    TENTATIVE: 'tentative',
    CANCELED: 'canceled',
};
export const SourceType = {
    LOCAL: 'local',
    EXCHANGE: 'exchange',
    CALDAV: 'caldav',
    MOBILEME: 'mobileme',
    SUBSCRIBED: 'subscribed',
    BIRTHDAYS: 'birthdays',
};
export const AttendeeRole = {
    UNKNOWN: 'unknown',
    REQUIRED: 'required',
    OPTIONAL: 'optional',
    CHAIR: 'chair',
    NON_PARTICIPANT: 'nonParticipant',
    ATTENDEE: 'attendee',
    ORGANIZER: 'organizer',
    PERFORMER: 'performer',
    SPEAKER: 'speaker',
    NONE: 'none',
};
export const AttendeeStatus = {
    UNKNOWN: 'unknown',
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    TENTATIVE: 'tentative',
    DELEGATED: 'delegated',
    COMPLETED: 'completed',
    IN_PROCESS: 'inProcess',
    INVITED: 'invited',
    NONE: 'none',
};
export const AttendeeType = {
    UNKNOWN: 'unknown',
    PERSON: 'person',
    ROOM: 'room',
    GROUP: 'group',
    RESOURCE: 'resource',
    OPTIONAL: 'optional',
    REQUIRED: 'required',
    NONE: 'none',
};
export const AlarmMethod = {
    ALARM: 'alarm',
    ALERT: 'alert',
    EMAIL: 'email',
    SMS: 'sms',
    DEFAULT: 'default',
};
export const EventAccessLevel = {
    CONFIDENTIAL: 'confidential',
    PRIVATE: 'private',
    PUBLIC: 'public',
    DEFAULT: 'default',
};
export const CalendarAccessLevel = {
    CONTRIBUTOR: 'contributor',
    EDITOR: 'editor',
    FREEBUSY: 'freebusy',
    OVERRIDE: 'override',
    OWNER: 'owner',
    READ: 'read',
    RESPOND: 'respond',
    ROOT: 'root',
    NONE: 'none',
};
export const ReminderStatus = {
    COMPLETED: 'completed',
    INCOMPLETE: 'incomplete',
};
export const DEFAULT = 'default';
//# sourceMappingURL=Calendar.js.map