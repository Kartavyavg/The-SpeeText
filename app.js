let isSpeaking = false;

document.getElementById('speak').addEventListener('click', () => {
    const text = document.getElementById('text').value;
    if (text.trim() === '') {
        alert('Please enter some text.');
        return;
    }
    
    if (isSpeaking) {
        // Stop the speech if it's already speaking
        window.speechSynthesis.cancel();
        isSpeaking = false;
    } else {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text; // Language Text
        speech.lang = 'en-IND'; // Language Medium
        speech.volume = 100; // Volume Control
        speech.rate = 0.7; // Speed Control
        speech.pitch = 0.2; // Pitch Control
        
        speech.onend = () => {
            isSpeaking = false;
        };

        speech.onerror = () => {
            isSpeaking = false;
        };

        window.speechSynthesis.speak(speech);
        isSpeaking = true;
    }
});

// Speech-to-Text functionality
let recognition;
try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
} catch (e) {
    console.error("Speech Recognition not supported in this browser.");
}

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const textArea = document.getElementById('text');

if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IND';

    let finalTranscript = '';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            const transcript = result[0].transcript;

            if (result.isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        // Combine final and interim transcripts
        textArea.value = finalTranscript + interimTranscript;
        textArea.scrollTop = textArea.scrollHeight; // Scroll to the bottom as text grows
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error detected: " + event.error);
    };

    recognition.onend = () => {
        console.log("Speech recognition service disconnected");
    };
}

startButton.addEventListener('click', () => {
    if (recognition) {
        finalTranscript = ''; // Reset final transcript when starting a new session
        recognition.start();
    } else {
        alert("Speech Recognition not supported in this browser.");
    }
});

stopButton.addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
    }
});
