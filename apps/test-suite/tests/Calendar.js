import { Calendar } from 'expo';

import * as TestUtils from '../TestUtils';

export async function test(t) {
  const shouldSkipTestsRequiringPermissions = await TestUtils.shouldSkipTestsRequiringPermissionsAsync();
  const describeWithPermissions = shouldSkipTestsRequiringPermissions ? t.xdescribe : t.describe;

  t.describe('Calendar', () => {
    describeWithPermissions('getCalendarsAsync()', () => {
      t.it('returns an array of calendars', async () => {
        const calendars = await Calendar.getCalendarsAsync();
        t.expect(Array.isArray(calendars)).toBeTruthy();
      });
    });

    describeWithPermissions('createCalendarAsync()', () => {

    });

    describeWithPermissions('updateCalendarAsync()', () => {

    });

    describeWithPermissions('deleteCalendarAsync()', () => {

    });

    describeWithPermissions('getEventsAsync()', () => {

    });

    describeWithPermissions('getEventAsync()', () => {

    });

    describeWithPermissions('createEventAsync()', () => {

    });

    describeWithPermissions('updateEventAsync()', () => {

    });

    describeWithPermissions('deleteEventAsync()', () => {

    });

    describeWithPermissions('getAttendeesForEventAsync()', () => {

    });

    describeWithPermissions('createAttendeeAsync()', () => {

    });

    describeWithPermissions('updateAttendeeAsync()', () => {

    });

    describeWithPermissions('deleteAttendeeAsync()', () => {

    });

    describeWithPermissions('getRemindersAsync()', () => {

    });

    describeWithPermissions('getReminderAsync()', () => {

    });

    describeWithPermissions('createReminderAsync()', () => {

    });

    describeWithPermissions('updateReminderAsync()', () => {

    });

    describeWithPermissions('deleteReminderAsync()', () => {

    });
  });
}
