import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [finalTranscript, interimTranscript]);

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
        if (event.results[i].isFinal) final += transcript + '\n';
        else interim += transcript;
      }

      setInterimTranscript(interim);
      setFinalTranscript(prevTranscript => prevTranscript + final);
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
      <br/><br/>
      <main className="main">
        <textarea
          ref={textareaRef}
          style={{ whiteSpace: 'pre-line', overflowY: 'auto', height: '200px', width: "100%", fontSize: "18px" }}
          value={finalTranscript + interimTranscript}
          readOnly
        ></textarea>
      </main>
    </div>
  );
}

export default App;
