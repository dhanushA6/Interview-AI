import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import IntervierPhoto from '../assets/Interviewer.jpeg';

// SVG Components for better organization
const SVGs = {
  Message: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Check: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Back: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Send: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Mic: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  X: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  MicOff: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 5.586A2 2 0 017 5h4a2 2 0 012 2v6M8 21h8m-4 0v-5m-7-7l18 18" />
    </svg>
  )
};

// Sub-components for better modularity
const LoadingOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Feedback</h3>
      <p className="text-gray-600">We're analyzing your interview to create personalized feedback...</p>
    </div>
  </div>
);

const InterviewerProfile = ({ botSpeaking }) => (
  <div className="hidden md:flex w-80 flex-col items-center justify-center bg-white p-6 border-r border-gray-200">
    <div className={`relative mb-6 transition-all duration-300 ${botSpeaking ? 'scale-105' : 'scale-100'}`}>
      <div className={`absolute inset-0 rounded-full bg-blue-400/10 ${botSpeaking ? 'animate-ping opacity-40' : 'opacity-0'}`} />
      <div className="relative">
        <div className={`w-40 h-40 rounded-full border-4 overflow-hidden ${botSpeaking ? 'border-blue-400' : 'border-gray-200'}`}>
          <img 
            src={IntervierPhoto}
            alt="Interviewer" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-2 shadow-md border border-gray-100">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <SVGs.Message className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
    
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">Varun Mohan</h2>
      <p className="text-blue-500 font-medium">Senior Interviewer</p>
    </div>

    <div className="mt-8 w-full">
      <div className="bg-gray-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-700 mb-2">Interview Tips</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            "Speak clearly and confidently",
            "Structure your answers (STAR method)",
            "Ask clarifying questions if needed"
          ].map((tip, index) => (
            <li key={index} className="flex items-start">
              <SVGs.Check className="h-4 w-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const ChatHeader = ({ onFinish, onNavigateBack }) => (
  <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
    <div className="flex items-center">
      <button 
        onClick={onNavigateBack} 
        className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
      >
        <SVGs.Back className="h-5 w-5" />
      </button>
      <h1 className="text-xl font-bold text-gray-800">Mock Interview</h1>
    </div>
    <button
      onClick={onFinish}
      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200"
    >
      <SVGs.Check className="h-5 w-5" />
      <span>Finish Interview</span>
    </button>
  </div>
);

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8">
    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
      <SVGs.Message className="h-12 w-12 text-blue-500" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">Your Interview is Starting</h3>
    <p className="text-gray-600 max-w-md">The interviewer will begin with some questions. Take your time to think before responding.</p>
  </div>
);

const MessageBubble = ({ message }) => (
  <div className={`max-w-3xl rounded-2xl px-4 py-3 ${
    message.role === 'user' 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
      : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
  }`}>
    <div className="prose prose-sm">{message.content}</div>
  </div>
);

const ChatInput = ({ onSend }) => {
  const [val, setVal] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (val.trim()) {
      onSend(val);
      setVal('');
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setVal(e.target.value);
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
        placeholder="Type your response..."
        rows={1}
      />
      <button
        type="submit"
        disabled={!val.trim()}
        className={`absolute right-3 bottom-3 p-1 rounded-full ${
          val.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-400'
        }`}
      >
        <SVGs.Send className="h-6 w-6" />
      </button>
    </form>
  );
};

const SpeechInput = ({ onSend }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }
    
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-IN';
    
    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimText += transcriptPart;
        }
      }
      
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
      setInterimTranscript(interimText);
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        // Don't stop listening for these errors, just continue
        return;
      }
      setListening(false);
      isListeningRef.current = false;
    };
    
    recognitionRef.current.onend = () => {
      if (isListeningRef.current) {
        // Restart recognition if we're still supposed to be listening
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
          setListening(false);
          isListeningRef.current = false;
        }
      }
    };
    
    return () => {
      if (recognitionRef.current) {
        isListeningRef.current = false;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      isListeningRef.current = true;
      setTranscript('');
      setInterimTranscript('');
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setListening(false);
        isListeningRef.current = false;
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      setListening(false);
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setInterimTranscript('');
    }
  };

  const resetSpeechInput = () => {
    // Stop listening if currently listening
    if (listening) {
      setListening(false);
      isListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
    // Clear all transcripts
    setTranscript('');
    setInterimTranscript('');
  };

  const clearTranscript = () => {
    resetSpeechInput();
  };

  const submitTranscript = () => {
    if (transcript.trim()) {
      onSend(transcript.trim());
      resetSpeechInput(); // Reset after submitting
    }
  };

  const displayText = transcript + interimTranscript;

  return (
    <div className="space-y-3">
      {/* Speech text display */}
      <div className="min-h-[80px] p-4 border border-gray-300 rounded-xl bg-gray-50">
        {displayText ? (
          <div className="text-gray-800">
            <span className="text-gray-900">{transcript}</span>
            <span className="text-gray-500 italic">{interimTranscript}</span>
          </div>
        ) : (
          <div className="text-gray-500 italic">
            {listening ? 'Listening... speak now' : 'Click "Start Listening" to begin'}
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex space-x-3">
        {/* Start/Stop listening button */}
        <button
          onClick={listening ? stopListening : startListening}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all ${
            listening
              ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 border-green-500 text-white hover:bg-green-600'
          }`}
        >
          <div className={`w-4 h-4 rounded-full ${listening ? 'bg-white animate-pulse' : 'bg-white'}`} />
          <span>{listening ? 'Stop Listening' : 'Start Listening'}</span>
          {listening ? <SVGs.MicOff className="h-5 w-5" /> : <SVGs.Mic className="h-5 w-5" />}
        </button>

        {/* Clear button */}
        <button
          onClick={clearTranscript}
          disabled={!displayText && !listening}
          className={`p-3 rounded-xl border transition-all ${
            (displayText || listening)
              ? 'bg-gray-500 border-gray-500 text-white hover:bg-gray-600'
              : 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <SVGs.X className="h-5 w-5" />
        </button>

        {/* Submit button */}
        <button
          onClick={submitTranscript}
          disabled={!transcript.trim()}
          className={`p-3 rounded-xl border transition-all ${
            transcript.trim()
              ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <SVGs.Check className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState([]);
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const hasStartedRef = useRef(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // Speak the latest AI message
  useEffect(() => {
    if (msgs.length && msgs[msgs.length - 1].role === 'ai') {
      const utter = new window.SpeechSynthesisUtterance(msgs[msgs.length - 1].content);
      setBotSpeaking(true);
      utter.onend = () => setBotSpeaking(false);
      synthRef.current.speak(utter);
    }
  }, [msgs]);

  // Clean up speech synthesis
  useEffect(() => {
    return () => {
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Start interview
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      axios.post(`http://localhost:3000/api/mockinterview/${id}/start`, {}, { withCredentials: true })
        .then(({ data }) => {
          setMsgs([data.message]);
        });
    }
  }, [id]);

  // Send message to server
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { role: 'user', content: text }]);
    const { data } = await axios.post(
      `http://localhost:3000/api/mockinterview/${id}/message`, 
      { content: text }, 
      { withCredentials: true }
    );
    if (data?.message?.content) {
      setMsgs(prev => [...prev, data.message]);
    } else {
      console.error('No AI reply received:', data);
    }
  };

  // Finish interview
  const finish = async () => {
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
    }
    setLoading(true);
    await axios.post(
      `http://localhost:3000/api/mockinterview/${id}/finish`, 
      {}, 
      { withCredentials: true }
    );
    navigate(`/feedback/${id}`);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loading && <LoadingOverlay />}
      
      <InterviewerProfile botSpeaking={botSpeaking} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader 
          onFinish={finish} 
          onNavigateBack={() => navigate(-1)} 
        />
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {msgs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {msgs.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <MessageBubble message={message} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <ChatInput onSend={sendMessage} />
            <SpeechInput onSend={sendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}