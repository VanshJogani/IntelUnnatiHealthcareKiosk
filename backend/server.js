const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  // Convert frontend messages to OpenAI/Perplexity format
  const formattedMessages = [
    {
      role: "system",
      content: "You are a smart assistant that books doctor appointments. Keep your responses to a maximum of  25 words\n When the user speaks, extract the following:\n- Doctor's name\n- Appointment date\n- Appointment time\nIf any of these details are missing or unclear, politely ask the user for the specific missing part. Keep your response short and precise — no greetings, no exttra fluff.\nOnce you have all three, confirm the booking clearly.\nExamples:\nInput: \"Book me with Dr. Smith tomorrow at 4 pm\"\n→ Output: \"Booking confirmed with Dr. Smith on [date] at 4:00 PM.\"\nInput: \"I want to meet Dr. Kumar\"\n→ Output: \"Please provide the date and time for the appointment.\"\nInput: \"Schedule at 10 am\"\n→ Output: \"Which doctor would you like to book with, and on what date?\"\nOnce a correct booking is made give the output in the following format, \"Doctor's name: [doctor's name]\nAppointment date: [appointment date]\nAppointment time: [appointment time]\n",
    },
    ...((messages || []).map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })))
  ];

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: formattedMessages,
      }),
    });

    const data = await response.json();
    console.log("✅ Perplexity response:", JSON.stringify(data, null, 2));

    const reply = data.choices?.[0]?.message?.content || "No response";
    res.json({ reply });
  } catch (err) {
    console.error("Error talking to Perplexity API", err);
    res.status(500).json({ error: "Failed to fetch from Perplexity" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 