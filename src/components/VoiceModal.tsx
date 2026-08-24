import React, { useEffect, useState } from 'react';
import { X, Mic } from 'lucide-react';

export default function VoiceModal({ onClose, onResult }: any) {
  const [text, setText] = useState('Requesting microphone access...');
  const [error, setError] = useState(false);

  useEffect(() => {
    let timeout: any;
    let recognition: any;

    const startRecognition = () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setText(result);
          setTimeout(() => {
            if(onResult) onResult(result);
            onClose();
          }, 1000);
        };

        recognition.onerror = (event: any) => {
          setText('Error capturing audio. Please try again.');
          setError(true);
        };

        recognition.onend = () => {
          setText(prev => {
            if (prev === 'Listening...' || prev === 'Requesting microphone access...') {
              setError(true);
              return 'No voice detected.';
            }
            return prev;
          });
        };

        setText('Listening...');
        recognition.start();
      } else {
        setText('Voice search is not supported on this browser.');
        setError(true);
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          startRecognition();
        })
        .catch((err) => {
          setText('Microphone access blocked. Please allow permissions in your browser settings.');
          setError(true);
        });
    } else {
      startRecognition();
    }

    return () => {
      if (recognition) recognition.stop();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#111] border-2 border-[#3b82f6] rounded-2xl w-full max-w-sm text-center p-8 relative flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          <X size={24} />
        </button>
        <div className={`w-20 h-20 ${error ? 'bg-red-500/20' : 'bg-[#3b82f6]/20'} rounded-full flex items-center justify-center mb-6 ${!error ? 'animate-pulse' : ''}`}>
          <Mic size={40} className={error ? 'text-red-500' : 'text-[#3b82f6]'} />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">{text}</h2>
        <p className="text-gray-400 text-sm">Speak now to search courses or products</p>
      </div>
    </div>
  );
}
