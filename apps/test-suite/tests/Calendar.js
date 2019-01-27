import { Calendar } from 'expo';
import { Platform } from 'react-native';

import * as TestUtils from '../TestUtils';

async function createTestCalendarAsync() {
  return await Calendar.createCalendarAsync({
    title: 'Expo test-suite calendar',
    color: '#4B968A',
    entityType: Calendar.EntityTypes.EVENT,
    name: 'expo-test-suite-calendar',
    sourceId: await pickCalendarSourceIdAsync(),
    source: {
      isLocalAccount: true,
      name: 'expo',
    },
  });
}

async function getCalendarByIdAsync(calendarId) {
  const calendars = await Calendar.getCalendarsAsync();
  return calendars.find(calendar => calendar.id === calendarId);
}

async function pickCalendarSourceIdAsync() {
  if (Platform.OS === 'ios') {
    const sources = await Calendar.getSourcesAsync();
    return sources && sources[0] && sources[0].id;
  }
}

async function createTestEventAsync(calendarId) {
  return await Calendar.createEventAsync(calendarId, {
    title: 'App.js Conference',
    startDate: +new Date(2019, 3, 4), // 4th April 2019, months are counted from 0
    endDate: +new Date(2019, 3, 5), // 5th April 2019
    allDay: true,
    location: 'Qubus Hotel, Nadwiślańska 6, 30-527 Kraków, Poland',
    notes: 'The very first Expo & React Native conference in Europe',
    availability: Calendar.Availability.BUSY,
  });
}

export async function test(t) {
  const shouldSkipTestsRequiringPermissions = await TestUtils.shouldSkipTestsRequiringPermissionsAsync();
  const describeWithPermissions = shouldSkipTestsRequiringPermissions ? t.xdescribe : t.describe;

  function testCalendarShape(calendar) {
    t.expect(calendar).toBeDefined();
    t.expect(typeof calendar.id).toBe('string');
    t.expect(typeof calendar.title).toBe('string');
    t.expect(typeof calendar.source).toBe('object'); // testSourceShape
    testCalendarSourceShape(calendar.source);
    t.expect(typeof calendar.color).toBe('string');
    t.expect(typeof calendar.allowsModifications).toBe('boolean');

    t.expect(Array.isArray(calendar.allowedAvailabilities)).toBe(true);
    calendar.allowedAvailabilities.forEach(availability => {
      t.expect(Object.values(Calendar.Availability)).toContain(availability);
    });

    if (Platform.OS === 'ios') {
      t.expect(typeof calendar.entityType).toBe('string');
      t.expect(Object.values(Calendar.EntityTypes)).toContain(calendar.entityType);

      t.expect(typeof calendar.type).toBe('string');
      t.expect(Object.values(Calendar.CalendarType)).toContain(calendar.type);
    }
    if (Platform.OS === 'android') {
      t.expect(typeof calendar.isPrimary).toBe('boolean');
      t.expect(typeof calendar.name).toBe('string');
      t.expect(typeof calendar.ownerAccount).toBe('string');
      t.expect(typeof calendar.timeZone).toBe('string');

      t.expect(Array.isArray(calendar.allowedReminders)).toBe(true);
      calendar.allowedReminders.forEach(reminder => {
        t.expect(Object.values(Calendar.AlarmMethod)).toContain(reminder);
      });

      t.expect(Array.isArray(calendar.allowedAttendeeTypes)).toBe(true);
      calendar.allowedAttendeeTypes.forEach(attendeeType => {
        t.expect(Object.values(Calendar.AttendeeType)).toContain(attendeeType);
      });

      t.expect(typeof calendar.isVisible).toBe('boolean');
      t.expect(typeof calendar.isSynced).toBe('boolean');
      t.expect(typeof calendar.accessLevel).toBe('string');
    }
  }

  function testEventShape(event) {
    t.expect(event).toBeDefined();
    t.expect(typeof event.id).toBe('string');
    t.expect(typeof event.calendarId).toBe('string');
    t.expect(typeof event.title).toBe('string');
    t.expect(typeof event.startDate).toBe('string');
    t.expect(typeof event.endDate).toBe('string');
    t.expect(typeof event.allDay).toBe('boolean');
    t.expect(typeof event.location).toBe('string');
    t.expect(typeof event.notes).toBe('string');
    t.expect(Array.isArray(event.alarms)).toBe(true);
    t.expect(typeof event.recurrenceRule).toBe('object');
    t.expect(Object.values(Calendar.Availability)).toContain(event.availability);
    t.expect(typeof event.timeZone).toBe('string');

    if (Platform.OS === 'ios') {
      t.expect(typeof event.url).toBe('string');
      t.expect(typeof event.creationDate).toBe('string');
      t.expect(typeof event.lastModifiedDate).toBe('string');
      t.expect(typeof event.originalStartDate).toBe('string');
      t.expect(typeof event.isDetached).toBe('boolean');
      t.expect(Object.values(Calendar.EventStatus)).toContain(event.status);
      t.expect(typeof event.organizer).toBe('object'); // testAttendeeShape
    }
    if (Platform.OS === 'android') {
      t.expect(typeof event.endTimeZone).toBe('string');
      t.expect(typeof event.organizerEmail).toBe('string');
      t.expect(Object.values(Calendar.EventAccessLevel)).toContain(event.accessLevel);
      t.expect(typeof event.guestsCanModify).toBe('boolean');
      t.expect(typeof event.guestsCanInviteOthers).toBe('boolean');
      t.expect(typeof event.guestsCanSeeGuests).toBe('boolean');
      t.expect(typeof event.originalId).toBe('string');
      t.expect(typeof event.instanceId).toBe('string');
    }
  }

  function testCalendarSourceShape(source) {
    t.expect(source).toBeDefined();
    t.expect(typeof source.id).toBe('string');
    t.expect(typeof source.name).toBe('string');
    t.expect(typeof source.type).toBe('string');

    if (Platform.OS === 'android') {
      t.expect(typeof source.isLocalAccount).toBe('boolean');
    }
  }

  describeWithPermissions('Calendar', () => {
    t.describe('requestPermissionsAsync()', () => {
      t.it('requests for Calendar permissions', async () => {
        const results = await Calendar.requestPermissionsAsync();

        t.expect(results.granted).toBe(true);
        t.expect(results.status).toBe('granted');
      });
    });

    t.describe('createCalendarAsync()', () => {
      let calendarId;

      t.it('creates a calendar', async () => {
        calendarId = await createTestCalendarAsync();
        const calendar = getCalendarByIdAsync(calendarId);

        t.expect(calendarId).toBeDefined();
        t.expect(typeof calendarId).toBe('string');
        testCalendarShape(calendar);
      });

      t.afterAll(async () => {
        await Calendar.deleteCalendarAsync(calendarId);
      });
    });

    t.describe('getCalendarsAsync()', () => {
      let calendarId;

      t.beforeAll(async () => {
        calendarId = await createTestCalendarAsync();
      });

      t.it('returns an array of calendars with correct shape', async () => {
        const calendars = await Calendar.getCalendarsAsync();

        t.expect(Array.isArray(calendars)).toBeTruthy();

        for (const calendar of calendars) {
          testCalendarShape(calendar);
        }
      });

      t.afterAll(async () => {
        await Calendar.deleteCalendarAsync(calendarId);
      });
    });

    t.describe('deleteCalendarAsync()', () => {
      t.it('deletes a calendar', async () => {
        const calendarId = await createTestCalendarAsync();
        await Calendar.deleteCalendarAsync(calendarId);

        const calendars = await Calendar.getCalendarsAsync();
        t.expect(calendars.findIndex(calendar => calendar.id === calendarId)).toBe(-1);
      });
    });

    t.describe('updateCalendarAsync()', () => {
      let calendarId;

      t.beforeAll(async () => {
        calendarId = await createTestCalendarAsync();
      });

      t.it('updates a calendar', async () => {
        const newTitle = 'New test-suite calendar title';
        const updatedCalendarId = await Calendar.updateCalendarAsync(calendarId, {
          title: newTitle,
        });
        const updatedCalendar = await getCalendarByIdAsync(calendarId);

        t.expect(updatedCalendarId).toBe(calendarId);
        t.expect(updatedCalendar.title).toBe(newTitle);
      });

      t.afterAll(async () => {
        await Calendar.deleteCalendarAsync(calendarId);
      });
    });

    t.describe('createEventAsync()', () => {
      let calendarId;

      t.beforeAll(async () => {
        calendarId = await createTestCalendarAsync();
      });

      t.it('creates an event in the specific calendar', async () => {
        const eventId = await createTestEventAsync(calendarId);

        t.expect(eventId).toBeDefined();
        t.expect(typeof eventId).toBe('string');
      });

      t.afterAll(async () => {
        await Calendar.deleteCalendarAsync(calendarId);
      });
    });

    t.describe('getEventsAsync()', () => {
      let calendarId, eventId;

      t.beforeAll(async () => {
        calendarId = await createTestCalendarAsync();
        eventId = await createTestEventAsync(calendarId);
      });

      t.it('resolves to an array with an event of the correct shape', async () => {
        const events = await Calendar.getEventsAsync(
          [calendarId],
          +new Date(2019, 3, 1),
          +new Date(2019, 3, 29)
        );

        console.log(events);

        t.expect(Array.isArray(events)).toBe(true);
        t.expect(events.length).toBe(1);
        t.expect(events[0].id).toBe(eventId);
        testEventShape(events[0]);
      });

      t.afterAll(async () => {
        await Calendar.deleteCalendarAsync(calendarId);
      });
    });

    t.describe('getEventAsync()', () => {

    });

    t.describe('updateEventAsync()', () => {

    });

    t.describe('deleteEventAsync()', () => {

    });

    t.describe('getAttendeesForEventAsync()', () => {

    });

    t.describe('createAttendeeAsync()', () => {

    });

    t.describe('updateAttendeeAsync()', () => {

    });

    t.describe('deleteAttendeeAsync()', () => {

    });

    t.describe('requestRemindersPermissionsAsync()', () => {
      t.it('requests for Reminders permissions', async () => {
        const results = await Calendar.requestRemindersPermissionsAsync();

        t.expect(results.granted).toBe(true);
        t.expect(results.status).toBe('granted');
      });
    });

    t.describe('getRemindersAsync()', () => {

    });

    t.describe('getReminderAsync()', () => {

    });

    t.describe('createReminderAsync()', () => {

    });

    t.describe('updateReminderAsync()', () => {

    });

    t.describe('deleteReminderAsync()', () => {

    });

    t.describe('getSources()', () => {
      t.it('returns an array of sources', async () => {
        const sources = await Calendar.getSourcesAsync();
        console.log(sources);

        t.expect(Array.isArray(sources)).toBe(true);
      });
    });
  });
}
