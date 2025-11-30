// src/utils/api.ts
export async function sendMessage(message: string): Promise<string> {
  try {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.reply; // BE trả về { reply: "..." }
  } catch (err) {
    console.error('sendMessage error:', err);
    return 'Error';
  }
}

export async function sendDocMessage(message: string): Promise<string> {
  try {
    const res = await fetch('/api/chat/doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error('sendDocMessage error:', err);
    return 'Error';
  }
}

export async function searchMessage(query: string): Promise<string[]> {
  try {
    const res = await fetch('/api/chat/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data.results; // BE trả về { results: [...] }
  } catch (err) {
    console.error('searchMessage error:', err);
    return [];
  }
}
