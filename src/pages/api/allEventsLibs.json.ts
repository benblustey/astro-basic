// src/pages/api/allEventsLibs.json.ts
import { getAllEvents } from '../../lib/getAllEvents';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const data = await getAllEvents();
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
