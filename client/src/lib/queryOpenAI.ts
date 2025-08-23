// client/src/lib/queryOpenAI.ts
export async function queryOpenAI(prompt: string) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      // Read the server’s message so we see the real reason in the UI
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data; // { text: string, speak?: string (SSML) }
  } catch (err: any) {
    // Let the UI display the actual message
    throw new Error(err?.message ?? "Unknown error");
  }
}
