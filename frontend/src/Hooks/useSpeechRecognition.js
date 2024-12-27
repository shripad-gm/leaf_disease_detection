import { useState, useEffect, useRef } from 'react';

// Hook to manage Speech Recognition
const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Store the recognition instance in a ref
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition API not supported in this browser.");
      return;
    }

    // Initialize SpeechRecognition instance once
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false; // Single phrase recognition
    recognition.interimResults = false; // No interim results

    // Store the instance in the ref
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText); // Set the transcript to the state
    };

    // Cleanup on component unmount
    return () => {
      recognition.abort();
    };
  }, []);

  // Function to start recognition
  const startRecognition = () => {
    recognitionRef.current?.start(); // Start recognition
  };

  // Function to stop recognition
  const stopRecognition = () => {
    recognitionRef.current?.stop(); // Stop recognition
  };

  return {
    transcript,
    isListening,
    startRecognition,
    stopRecognition,
  };
};

export default useSpeechRecognition;
