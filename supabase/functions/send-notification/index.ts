// ============================================================
// send-notification
//
// Invoked by other edge functions. Accepts { user_id, title, body, data }.
// Reads push_token from notification_prefs and sends via Expo Push API.
// ============================================================

import { createClient } from '@supabase/supabase-js';

interface SendNotificationRequest {
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound: 'default';
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: SendNotificationRequest;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { user_id, title, body, data } = payload;
  if (!user_id || !title || !body) {
    return new Response(
      JSON.stringify({ error: 'user_id, title, and body are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: prefs, error } = await supabase
    .from('notification_prefs')
    .select('push_token')
    .eq('user_id', user_id)
    .single();

  if (error || !prefs?.push_token) {
    return new Response(
      JSON.stringify({ skipped: true, reason: 'no push_token' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const message: ExpoPushMessage = {
    to: prefs.push_token,
    title,
    body,
    data,
    sound: 'default',
  };

  const expoResponse = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!expoResponse.ok) {
    const errorBody = await expoResponse.text();
    console.error('Expo Push API error:', expoResponse.status, errorBody);
    return new Response(
      JSON.stringify({ error: 'Push delivery failed', status: expoResponse.status }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const result = await expoResponse.json();
  return new Response(JSON.stringify({ success: true, result }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
