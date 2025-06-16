import type { Event, HourlyEvent } from '../utils/eventTypes';

const allEvents = await fetch('http://localhost:4321/api/events/allEventsData.json');
const allEventsData = await allEvents.json();
const hourEvents = allEventsData.hourlyEvents;

const Hello = () => {
  return (
    <>
      <h2>Hello from React</h2>
      <h3>Total Events: {allEventsData.eventTotal}</h3>
      <h3>Total Days: {allEventsData.daysTotal}</h3>
      <div>
        {hourEvents.map((event: HourlyEvent) => (
          <div key={event.hour}>
            <h2>{event.hour}: {event.count}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default Hello;