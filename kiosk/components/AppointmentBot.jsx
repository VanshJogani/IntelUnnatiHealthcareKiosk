import React, { useState, useRef } from "react";
import { fetchBookingReply } from "@/api/chatbot";

const AppointmentBot = ({ openFromParent, setOpenFromParent }) => {
  const [messages, setMessages] = useState([]); // 💬 full chat log
  const [speakText, setSpeakText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openFromParent !== undefined ? openFromParent : internalOpen;
  const setOpen = setOpenFromParent !== undefined ? setOpenFromParent : setInternalOpen;
  const ttsUtteranceRef = useRef(null);

  // TTS logic
  React.useEffect(() => {
    if (speakText) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utterance = new window.SpeechSynthesisUtterance(speakText);
      utterance.lang = "en-US";
      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpokenText(speakText);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentSpokenText("");
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentSpokenText("");
      };
      ttsUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [speakText]);

  const stopTTS = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentSpokenText("");
  };

  // VoiceInput logic (inline, not as a separate component)
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserSpeech(transcript);
    };
    recognition.onerror = (e) => {
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };
  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };
  const toggleMic = () => {
    if (listening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const handleUserSpeech = async (userText) => {
    const newMessages = [
      ...messages,
      { sender: "user", text: userText }
    ];
    setMessages(newMessages);

    const botReply = await fetchBookingReply(newMessages);

    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);

    // TTS: If reply contains all three booking lines, only read lines that do NOT start with the format keys
    const lines = botReply.split('\n').map(l => l.trim()).filter(Boolean);
    const isFinalized = lines.some(l => l.startsWith("Doctor's name:")) &&
      lines.some(l => l.startsWith("Appointment date:")) &&
      lines.some(l => l.startsWith("Appointment time:"));
    if (isFinalized) {
      // Read only lines that do NOT start with the format keys
      const toSpeak = lines.filter(l =>
        !l.startsWith("Doctor's name:") &&
        !l.startsWith("Appointment date:") &&
        !l.startsWith("Appointment time:")
      ).join(' ');
      setSpeakText(toSpeak);
    } else {
      setSpeakText(botReply.split('\n')[0]); // Only read the first line for non-finalized
    }
  };

  return (
    <div>
      {/* Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none border-4 border-emerald-900"
          aria-label="Open Appointment Chatbot"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3C6.477 3 2 6.797 2 11c0 1.61.67 3.11 1.85 4.36-.13.98-.53 2.09-1.36 3.13a1 1 0 0 0 1.11 1.56c2.13-.37 3.77-1.13 4.91-1.8A13.6 13.6 0 0 0 12 18c5.523 0 10-3.797 10-7s-4.477-8-10-8Z"/></svg>
        </button>
      )}
      {/* Floating Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[320px] max-w-[95vw] bg-emerald-950 border border-emerald-800 rounded-2xl shadow-2xl flex flex-col overflow-x-hidden" style={{ minHeight: 420, maxHeight: '75vh' }}>
          {/* Header with close button */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-800 bg-emerald-900 rounded-t-2xl">
            <span className="text-emerald-400 font-bold text-base">🎙️ Appointment Bot</span>
            <button
              onClick={() => setOpen(false)}
              className="text-emerald-400 hover:text-emerald-200 text-xl font-bold rounded-full p-1 focus:outline-none"
              aria-label="Close Appointment Chatbot"
            >
              ×
            </button>
          </div>
          {/* 💬 Chat UI */}
          <div className="flex-1 overflow-y-auto px-2 pb-20 pt-2 flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "self-end max-w-[70%] bg-emerald-600 text-white rounded-2xl rounded-br-md px-3 py-2 text-sm shadow"
                    : "self-start max-w-[85%] bg-emerald-900 text-emerald-100 rounded-2xl rounded-bl-md px-3 py-2 text-sm shadow"
                }
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ))}
          </div>

          {/* 👄 Voice Output */}
          {isSpeaking && (
            <div className="absolute top-3 right-4 text-emerald-400 bg-emerald-900 border border-emerald-700 rounded-lg px-3 py-1 shadow z-20 flex items-center gap-2">
              <span>🔊 Speaking: {currentSpokenText}</span>
              <button onClick={stopTTS} className="ml-2 px-2 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">Stop</button>
            </div>
          )}

          {/* Chat Input Bar (sticky at bottom) */}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (textInput.trim()) {
                handleUserSpeech(textInput);
                setTextInput("");
              }
            }}
            className="sticky bottom-0 left-0 w-full bg-emerald-900 flex gap-2 items-center px-2 py-3 border-t border-emerald-800 z-10 rounded-b-2xl"
          >
            <input
              type="text"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Type your request..."
              className="flex-1 min-w-0 px-3 py-2 rounded-full border border-emerald-700 bg-emerald-950 text-emerald-100 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
            <div className="flex gap-1 items-center">
              <button type="submit" className="px-3 py-2 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition min-w-[36px] h-9 flex items-center justify-center shadow-none">
                Send
              </button>
              <button
                type="button"
                onClick={toggleMic}
                className={`px-2 py-2 rounded-full border-none ${listening ? 'bg-red-600 animate-pulse' : 'bg-emerald-700'} text-white text-lg flex items-center justify-center h-9 min-w-[36px] transition`}
                aria-label={listening ? 'Stop Listening' : 'Start Listening'}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="3" width="6" height="10" rx="3" fill="white" fillOpacity={listening ? '0.8' : '0.6'} />
                  <rect x="9" y="14" width="2" height="3" rx="1" fill="white" fillOpacity={listening ? '0.8' : '0.6'} />
                  <path d="M5 10V11C5 14 15 14 15 11V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={listening ? '1' : '0.7'} />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppointmentBot;
