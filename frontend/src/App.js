import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Volume2, Phone, X, Clock, MessageSquare, MicOff, Grid3x3, Volume1, UserPlus, Video, Users, Battery, Wifi, Signal } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Componente de Status Bar do Celular
const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar" data-testid="status-bar">
      <div className="status-time">{currentTime}</div>
      <div className="status-icons">
        <Signal size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <Battery size={20} strokeWidth={2.5} />
      </div>
    </div>
  );
};

const IntroScreen = () => {
  const navigate = useNavigate();

  const handleStartSecretly = () => {
    navigate('/call');
  };

  const handleAlreadyPassed = () => {
    navigate('/already-passed');
  };

  return (
    <div className="intro-screen" data-testid="intro-screen">
      <StatusBar />
      <div className="intro-content">
        <h1 className="intro-title" data-testid="intro-title">
          A verdade precisa vir a tona mas isso causará conflitos antes de continuar preciso que você responda algumas perguntas
        </h1>
        
        <div className="sound-icon" data-testid="sound-icon">
          <Volume2 size={48} strokeWidth={2} />
        </div>
        
        <p className="intro-subtitle" data-testid="intro-subtitle">
          Assim consigo identificar de que lado você está.<br />
          Responda com sinceridade.
        </p>
        
        <button 
          className="start-button" 
          onClick={handleStartSecretly}
          data-testid="start-button"
        >
          Iniciar secretamente
        </button>
        
        <button 
          className="already-passed-link" 
          onClick={handleAlreadyPassed}
          data-testid="already-passed-link"
        >
          Já passei pelo processo.
        </button>
      </div>
    </div>
  );
};

const CallScreen = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [audioEnded, setAudioEnded] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay bloqueado:', err);
      });
    }
  }, []);

  const handleAudioEnd = () => {
    setAudioEnded(true);
    if (!hasAnswered) {
      setTimeout(() => {
        navigate('/in-call');
      }, 1000);
    }
  };

  const handleAnswer = () => {
    setHasAnswered(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/in-call');
  };

  const handleDecline = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/');
  };

  const handleReminder = () => {
    console.log('Lembrar mais tarde');
  };

  const handleMessage = () => {
    console.log('Enviar mensagem');
  };

  return (
    <div className="call-screen" data-testid="call-screen">
      <StatusBar />
      <audio 
        ref={audioRef} 
        src="https://files.catbox.moe/ognhw7.mp3"
        onEnded={handleAudioEnd}
      />
      
      <div className="call-content">
        <div className="caller-info">
          <div className="caller-avatar" data-testid="caller-avatar">
            <img 
              src="https://customer-assets.emergentagent.com/job_inicio-proyecto/artifacts/qds5xpk1_photo_2026-01-05_11-01-56.jpg" 
              alt="Presidente Lula" 
            />
          </div>
          
          <p className="caller-status" data-testid="caller-status">Invasor inesperado</p>
          <h2 className="caller-name" data-testid="caller-name">Presidente Lula</h2>
          <p className="caller-request" data-testid="caller-request">por favor atenda</p>
        </div>

        <div className="call-actions">
          <div className="action-row">
            <button 
              className="call-button decline-button" 
              onClick={handleDecline}
              data-testid="decline-button"
            >
              <div className="button-icon">
                <X size={32} strokeWidth={2.5} />
              </div>
              <span>Recusar</span>
            </button>

            <button 
              className="call-button answer-button" 
              onClick={handleAnswer}
              data-testid="answer-button"
            >
              <div className="button-icon">
                <Phone size={32} strokeWidth={2.5} />
              </div>
              <span>Atender</span>
            </button>
          </div>

          <div className="action-row">
            <button 
              className="call-button secondary-button" 
              onClick={handleReminder}
              data-testid="reminder-button"
            >
              <div className="button-icon-small">
                <Clock size={24} strokeWidth={2} />
              </div>
              <span>Lembrar</span>
            </button>

            <button 
              className="call-button secondary-button" 
              onClick={handleMessage}
              data-testid="message-button"
            >
              <div className="button-icon-small">
                <MessageSquare size={24} strokeWidth={2} />
              </div>
              <span>Mensagem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InCallScreen = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay bloqueado:', err);
      });
    }

    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAudioEnd = () => {
    setTimeout(() => {
      navigate('/end-call');
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleSpeaker = () => setIsSpeaker(!isSpeaker);
  const handleKeypad = () => console.log('Keypad');
  const handleAddCall = () => console.log('Add call');
  const handleFaceTime = () => console.log('FaceTime');
  const handleContacts = () => console.log('Contacts');

  return (
    <div className="in-call-screen" data-testid="in-call-screen">
      <StatusBar />
      <audio 
        ref={audioRef} 
        src="https://files.catbox.moe/5wpges.mp3"
        onEnded={handleAudioEnd}
      />
      
      <div className="in-call-content">
        <div className="in-call-info">
          <div className="in-call-avatar" data-testid="in-call-avatar">
            <img 
              src="https://customer-assets.emergentagent.com/job_inicio-proyecto/artifacts/qds5xpk1_photo_2026-01-05_11-01-56.jpg" 
              alt="Presidente Lula" 
            />
          </div>
          
          <h2 className="in-call-name" data-testid="in-call-name">Presidente Lula</h2>
          <p className="in-call-status" data-testid="in-call-status">Confidencial</p>
          <p className="call-timer" data-testid="call-timer">{formatTime(callTime)}</p>
        </div>

        <div className="in-call-controls">
          <div className="control-row">
            <button 
              className={`control-button ${isMuted ? 'active' : ''}`}
              onClick={toggleMute}
              data-testid="mute-button"
            >
              <div className="control-icon">
                <MicOff size={28} strokeWidth={2} />
              </div>
              <span>mute</span>
            </button>

            <button 
              className="control-button"
              onClick={handleKeypad}
              data-testid="keypad-button"
            >
              <div className="control-icon">
                <Grid3x3 size={28} strokeWidth={2} />
              </div>
              <span>keypad</span>
            </button>

            <button 
              className={`control-button ${isSpeaker ? 'active' : ''}`}
              onClick={toggleSpeaker}
              data-testid="speaker-button"
            >
              <div className="control-icon">
                <Volume1 size={28} strokeWidth={2} />
              </div>
              <span>speaker</span>
            </button>
          </div>

          <div className="control-row">
            <button 
              className="control-button"
              onClick={handleAddCall}
              data-testid="add-call-button"
            >
              <div className="control-icon">
                <UserPlus size={28} strokeWidth={2} />
              </div>
              <span>add call</span>
            </button>

            <button 
              className="control-button"
              onClick={handleFaceTime}
              data-testid="facetime-button"
            >
              <div className="control-icon">
                <Video size={28} strokeWidth={2} />
              </div>
              <span>FaceTime</span>
            </button>

            <button 
              className="control-button"
              onClick={handleContacts}
              data-testid="contacts-button"
            >
              <div className="control-icon">
                <Users size={28} strokeWidth={2} />
              </div>
              <span>contacts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EndCallScreen = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [callTime, setCallTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay bloqueado:', err);
      });
    }

    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, []);

  const handleAudioEnd = () => {
    setTimeout(() => {
      navigate('/truth');
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="end-call-screen" data-testid="end-call-screen">
      <StatusBar />
      <audio 
        ref={audioRef} 
        src="https://files.catbox.moe/cp5kz3.mp3"
        onEnded={handleAudioEnd}
      />
      
      <div className="end-call-content">
        <div className="end-call-icon" data-testid="end-call-icon">
          <div className="phone-icon-circle">
            <Phone size={50} strokeWidth={2.5} />
          </div>
        </div>
        
        <h2 className="end-call-title" data-testid="end-call-title">O segredo</h2>
        <p className="end-call-timer" data-testid="end-call-timer">{formatTime(callTime)}</p>
        
        <p className="end-call-message" data-testid="end-call-message">
          Vamos prosseguir uffa...
        </p>
        
        <div className="progress-bar-container" data-testid="progress-bar">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const TruthScreen = () => {
  const navigate = useNavigate();

  const handleWantTruth = () => {
    navigate('/next-step');
  };

  return (
    <div className="truth-screen" data-testid="truth-screen">
      <StatusBar />
      
      <div className="truth-content">
        {/* Bandeira do Brasil no topo */}
        <div className="flag-top" data-testid="flag-top">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/320px-Flag_of_Brazil.svg.png" 
            alt="Bandeira do Brasil" 
          />
        </div>

        {/* Imagem principal */}
        <div className="main-image" data-testid="main-image">
          <img 
            src="https://via.placeholder.com/350x250/dc2626/ffffff?text=IMAGEM+PLACEHOLDER" 
            alt="Imagem Principal" 
          />
        </div>

        {/* Título principal */}
        <h1 className="truth-title" data-testid="truth-title">
          35 PROVAS<br />JUDICIAIS
        </h1>

        {/* Subtítulo */}
        <p className="truth-subtitle" data-testid="truth-subtitle">
          Que mostram o por que Lula não<br />deveria ser presidente do Brasil.
        </p>

        {/* Bandeira pequena e texto */}
        <div className="flag-small" data-testid="flag-small">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/80px-Flag_of_Brazil.svg.png" 
            alt="Bandeira do Brasil" 
          />
        </div>
        <p className="defender-text" data-testid="defender-text">
          O defensor da pátria
        </p>

        {/* Texto de aviso */}
        <p className="warning-text" data-testid="warning-text">
          Prosseguir pode ser arriscado. Mas pense, mais vale uma mentira confortável ou uma verdade dolorosa?
        </p>

        {/* Botão pulsante */}
        <button 
          className="truth-button" 
          onClick={handleWantTruth}
          data-testid="truth-button"
        >
          Quero a verdade
        </button>
      </div>
    </div>
  );
};

const NextStepScreen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      question: "Você já parou pra pensar como a prisão de Maduro pode mudar o cenário político da América Latina?",
      options: [
        "Prefiro não saber a verdade",
        "Acho que isso é fake news",
        "Eu preciso de provas e quero continuar",
        "Preciso ter acesso a esses fatos"
      ]
    },
    {
      question: "Qual a primeira imagem que vem à sua mente quando você pensa em Lula e sua conexão com Maduro?",
      options: [
        "Uma aliança estratégica necessária",
        "Corrupção e interesses escusos",
        "Amizade política normal",
        "Conspiração da direita"
      ]
    },
    {
      question: "Na sua opinião, a esquerda no Brasil está realmente em perigo com essa prisão ou é tudo um teatro político?",
      options: [
        "É um golpe contra a esquerda",
        "É apenas teatro político",
        "A esquerda está em perigo real",
        "Preciso de mais informações"
      ]
    },
    {
      question: "Você acredita que essa relação faz parte de uma estratégia maior? Se sim, qual?!",
      options: [
        "Sim, controle da América Latina",
        "Não, são apenas aliados políticos",
        "Talvez, mas não tenho certeza",
        "É uma conspiração internacional"
      ]
    },
    {
      question: "Se você pudesse resumir em uma palavra o que essa prisão representa pra política brasileira, qual seria?",
      options: [
        "Justiça",
        "Perseguição",
        "Alerta",
        "Transformação"
      ]
    }
  ];

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, { question: currentQuestion, answer: optionIndex }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz finalizado
      navigate('/final');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-screen" data-testid="quiz-screen">
      <StatusBar />
      
      <div className="quiz-content">
        {/* Bandeira do Brasil */}
        <div className="quiz-flag" data-testid="quiz-flag">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/320px-Flag_of_Brazil.svg.png" 
            alt="Bandeira do Brasil" 
          />
        </div>

        {/* Barra de progresso */}
        <div className="quiz-progress-container" data-testid="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Pergunta */}
        <h2 className="quiz-question" data-testid="quiz-question">
          {questions[currentQuestion].question}
        </h2>

        {/* Opções */}
        <div className="quiz-options" data-testid="quiz-options">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className="quiz-option-button"
              onClick={() => handleAnswer(index)}
              data-testid={`quiz-option-${index}`}
            >
              <span>{option}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ))}
        </div>

        {/* Indicador de pergunta */}
        <p className="quiz-counter" data-testid="quiz-counter">
          Pergunta {currentQuestion + 1} de {questions.length}
        </p>
      </div>
    </div>
  );
};

const FinalScreen = () => {
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Quando chegar a 100%, navegar para checkout (será implementado depois)
          setTimeout(() => {
            navigate('/checkout');
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // Atualiza a cada 50ms para completar em ~5 segundos

    return () => clearInterval(progressTimer);
  }, [navigate]);

  return (
    <div className="final-screen" data-testid="final-screen">
      <StatusBar />
      
      <div className="final-content">
        {/* Bandeira do Brasil */}
        <div className="final-flag" data-testid="final-flag">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/320px-Flag_of_Brazil.svg.png" 
            alt="Bandeira do Brasil" 
          />
        </div>

        {/* Título */}
        <h1 className="final-title" data-testid="final-title">
          Encaixotando suas<br />respostas...
        </h1>

        {/* Subtítulo */}
        <p className="final-subtitle" data-testid="final-subtitle">
          Aguarde, a verdade estará em suas mãos...
        </p>

        {/* Barra de progresso com label e porcentagem */}
        <div className="final-loading-section">
          <div className="final-loading-header">
            <span className="final-loading-label">Carregando</span>
            <span className="final-loading-percentage">{loadingProgress}%</span>
          </div>
          <div className="final-progress-container" data-testid="final-progress">
            <div className="final-progress-bar" style={{ width: `${loadingProgress}%` }}></div>
          </div>
        </div>

        {/* Imagem principal (placeholder) */}
        <div className="final-image" data-testid="final-image">
          <img 
            src="https://via.placeholder.com/600x700/cccccc/666666?text=IMAGEM+PLACEHOLDER" 
            alt="Imagem de processamento" 
          />
        </div>
      </div>
    </div>
  );
};

const CheckoutScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <StatusBar />
      <h1 className="text-3xl">Checkout - Em Desenvolvimento</h1>
    </div>
  );
};

const AlreadyPassedScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <StatusBar />
      <h1 className="text-3xl">Área para quem já passou - Em Desenvolvimento</h1>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IntroScreen />} />
          <Route path="/call" element={<CallScreen />} />
          <Route path="/in-call" element={<InCallScreen />} />
          <Route path="/end-call" element={<EndCallScreen />} />
          <Route path="/truth" element={<TruthScreen />} />
          <Route path="/next-step" element={<NextStepScreen />} />
          <Route path="/final" element={<FinalScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/already-passed" element={<AlreadyPassedScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
