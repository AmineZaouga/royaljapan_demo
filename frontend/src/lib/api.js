import axios from 'axios';

export async function safeRequest(config) {
  try {
    const res = await axios(config);
    // Log successful responses if desired
    if (!window.__API_LOGS__) window.__API_LOGS__ = [];
    window.__API_LOGS__.push({ time: new Date().toISOString(), status: res.status, url: config.url });
    return { ok: true, status: res.status, data: res.data, original: res };
  } catch (err) {
    const status = err?.response?.status || 0;
    const message = err?.response?.data?.message || err?.response?.data || err.message || 'Unknown error';
    // Push to global error log and console
    if (!window.__ERROR_LOGS__) window.__ERROR_LOGS__ = [];
    window.__ERROR_LOGS__.push({ time: new Date().toISOString(), status, message, url: config?.url });
    console.error('API error', { status, message, url: config?.url, err });
    return { ok: false, status, error: message, original: err };
  }
}

export function logError(err, context = {}) {
  const record = { time: new Date().toISOString(), message: err?.message || err, context };
  if (!window.__ERROR_LOGS__) window.__ERROR_LOGS__ = [];
  window.__ERROR_LOGS__.push(record);
  console.error('Logged error', record);
}
