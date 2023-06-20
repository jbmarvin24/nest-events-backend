import { Event } from './event.entity';

test('Event should be initialized through constructor', () => {
  const event = new Event({
    name: 'a',
    description: 'a',
  });

  expect(event).toEqual({
    name: 'a',
    description: 'a',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
  });
});
