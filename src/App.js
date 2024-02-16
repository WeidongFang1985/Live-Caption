import React, { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true; // 启用临时结果

function App() {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      recognition.start();
      recognition.onend = () => {
        console.log("...continue listening...");
        recognition.start();
      }
    } else {
      recognition.stop();
      recognition.onend = () => {
        console.log("Stopped listening per user request");
      }
    }

    recognition.onresult = event => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript + '\n'; // 添加换行符
        else interim += transcript;
      }

      setInterimTranscript(interim);
      setFinalTranscript(finalTranscript => finalTranscript + final);
    };

    recognition.onerror = event => {
      console.log("An error occurred in recognition: " + event.error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsListening(prevState => !prevState)}>
        {isListening ? 'Stop' : 'Start'}
      </button>
      <p style={{ whiteSpace: 'pre-line' }}>{finalTranscript + interimTranscript}</p>
    </div>
  );
}

export default App;
