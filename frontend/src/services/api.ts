export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const fetchLatestEvent = async () => {
  const response = await fetch(`${API_BASE_URL}/events/latest`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchAllEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchLatestTelemetry = async () => {
  const response = await fetch(`${API_BASE_URL}/telemetry/latest`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchAllTelemetry = async () => {
  const response = await fetch(`${API_BASE_URL}/telemetry`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const sendChatMessage = async (message: string, history: any[] = []) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history }),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};
