// src/pages/api/products.js
import { MongoClient } from 'mongodb';
import type { APIRoute } from 'astro';
import { DateTime } from 'luxon';

const uri = import.meta.env.DATABASE_URI || 'mongodb://localhost/' ;
const mongo_db = import.meta.env.MONGODB_DB || '' ;
const db_collection = import.meta.env.DB_COLLECTION || '' ;
const client = new MongoClient(uri);
interface EventData {
  daysTotal: number;
  eventTotal: number;
  hourlyEvents: { hour: number; count: number }[];
  calendarData: { date: string; count: number }[];
}
export const GET: APIRoute = async () => {
  const eventData: EventData = {
    daysTotal: 0,
    eventTotal: 0,
    hourlyEvents: [],
    calendarData: [],
  }
  try {
    await client.connect();
    const database = client.db(mongo_db);
    const collection = database.collection(db_collection);
    const events = await collection.find({}).toArray();
    eventData.eventTotal = events.length
    eventData.hourlyEvents = Array.from({ length: 24 }).map((_, hour) => ({ hour, count: 0 }))
    
    for (const event of events) {
      // const date = new Date(event.epoch * 1000) // Convert seconds to ms
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

    // eslint-disable-next-line no-undef
    return new Response(JSON.stringify(eventData));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-undef
    return new Response(JSON.stringify({ error: 'Database error', details: message }), { status: 500 });
  } finally {
    await client.close();
  }
}
