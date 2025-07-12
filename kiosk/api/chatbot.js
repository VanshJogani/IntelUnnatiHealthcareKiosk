export async function fetchBookingReply(messages) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  });

  const data = await res.json();
  return data.reply;
} 