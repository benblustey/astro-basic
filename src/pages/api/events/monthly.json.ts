// src/pages/api/products.js
import { MongoClient } from 'mongodb';
import type { APIRoute } from 'astro';

// const uri = process.env.MONGODB_URI;
const uri = 'mongodb://192.168.1.81/fw_db';
const client = new MongoClient(uri);

export const GET: APIRoute = async () => {
  const calendarData: { date: string; value: number }[] = []
  try {
    await client.connect();
    const database = client.db('fw_db');
    const collection = database.collection('events');
    const events = await collection.find({}).toArray();
    for (const event of events) {
      const date = new Date(event.epoch * 1000) // Convert seconds to ms
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      // const hh = String(date.getHours()).padStart(2, '0')
      const dateFormatted = `${yyyy}-${mm}-${dd}`
      const dateIndex = calendarData.findIndex((item) => item.date === dateFormatted)
      // eventHourlyArray[parseInt(hh)].value += 1
  
      if (dateIndex !== -1) {
        calendarData[dateIndex].value += 1
      } else {
        calendarData.push({ date: dateFormatted, value: 1 })
      }
    }
    // eslint-disable-next-line no-undef
    return new Response(JSON.stringify(calendarData));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-undef
    return new Response(JSON.stringify({ error: 'Database error', details: message }), { status: 500 });
  } finally {
    await client.close();
  }
}
