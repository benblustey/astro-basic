import { MongoClient } from "mongodb";
import type { AllEventsData } from "../utils/eventTypes";
import { DateTime } from "luxon";

export async function getAllEvents() {
  const client = new MongoClient("mongodb://root:Yi2Zlx5LTocv4DYIK0Km66JfCMFICBmF0BeITw1Qi7NmxlNMOwh3p2E7HYQKAxhb@5.78.89.159:19635/?directConnection=true");
  const db = client.db("test");
  const events = await db.collection("events").find({}).toArray();

  const eventData: AllEventsData = {
    daysTotal: 0,
    eventTotal: 0,
    hourlyEvents: [],
    calendarData: [],
  }
  eventData.eventTotal = events.length
  eventData.hourlyEvents = Array.from({ length: 24 }).map((_, hour) => ({ hour, count: 0 }))
  
  for (const event of events) {
    const date = DateTime.fromSeconds(event.epoch, { zone: 'America/Los_Angeles' });
    const yyyy = date.year;
    const mm = String(date.month).padStart(2, '0')
    const dd = String(date.day).padStart(2, '0')
    const dateFormatted = `${yyyy}-${mm}-${dd}`
    const dateIndex = eventData.calendarData.findIndex((item) => item.date === dateFormatted)
    eventData.hourlyEvents[date.hour].count += 1
    if (dateIndex !== -1) {
      eventData.calendarData[dateIndex].count += 1
    } else {
      eventData.calendarData.push({ date: dateFormatted, count: 1 })
    }
  }
  eventData.daysTotal = eventData.calendarData.length

  return eventData;
}
