// src/pages/api/hours.ts
import type { APIRoute } from 'astro';
import { MongoClient } from 'mongodb';
const uri = 'mongodb://192.168.1.81/fw_db';
const client = new MongoClient(uri);

export const GET: APIRoute = async () => {
  if (import.meta.env.PROD) {
    // eslint-disable-next-line no-undef
    return new Response(
      JSON.stringify({ message: 'Static file served in production' }),
      { status: 404 }
    );
  }

  try {
    await client.connect();
    const database = client.db('fw_db');
    const collection = database.collection('events');
    const events = await collection.find({}).toArray();

    const hourlyCount = Array(24).fill(0);
    for (const {epoch} of events) {
      const date = new Date(epoch * 1000);
      const hour = date.getHours();
      hourlyCount[hour]++;
    }

    const transformed = hourlyCount.map((count, hour) => ({ hour, count }));
    // eslint-disable-next-line no-undef
    return new Response(JSON.stringify(transformed));

    // return new Response(JSON.stringify(transformed), {
    //   headers: { 'Content-Type': 'application/json' }
    // });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-undef
    return new Response(JSON.stringify({ error: 'Database error', details: message }), { status: 500 });
  } finally {
    await client.close();
  }
};
