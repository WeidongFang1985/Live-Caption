import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        console.log("Stopped listening per user request");
      };
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
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4">
        <div className="container-fluid">
          <h1 className="mb-2">语音转文字</h1>
          <button
            onClick={() => setIsListening(prevState => !prevState)}
            className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`}
          >
            {isListening ? 'Stop' : 'Start'}
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">实时字幕</h5>
                <textarea
                  ref={textareaRef}
                  style={{
                    whiteSpace: 'pre-line',
                    overflowY: 'auto',
                    height: '400px',
                    width: "100%",
                    fontSize: "18px",
                    resize: 'none'
                  }}
                  className="form-control"
                  value={finalTranscript + interimTranscript}
                  readOnly
                ></textarea>
              </div>
            </div>

            <div className="card shadow mt-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">转录历史</h5>
                <div className="list-group">
                  {finalTranscript.split('\n').map((text, index) => (
                    <div key={index} className="list-group-item">
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}

export default App;
