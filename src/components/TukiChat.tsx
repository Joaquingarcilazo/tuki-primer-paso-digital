import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Edit3, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import OnboardingSummary from './OnboardingSummary';
import { validateResponse } from '../utils/responseValidator';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface UserData {
  productoServicio: string;
  clienteIdeal: string;
  objetivoMarketing: string;
  redesSociales: string[];
}

const questions = [
  {
    id: 'productoServicio',
    text: 'Empecemos conociendo tu negocio. ¿Qué tipo de producto o servicio ofrecés? Brindame detalles para poder ayudarte mejor 😊',
    placeholder: 'Por ejemplo: Vendo ropa deportiva para mujeres, soy contador, tengo una panadería...',
    type: 'textarea'
  },
  {
    id: 'clienteIdeal',
    text: '¡Genial! Ahora ayudame a definir tu cliente ideal. Seleccioná todas las características que mejor describan a tu público objetivo 🎯',
    type: 'multiple',
    options: [
      'Jóvenes (18-30 años)',
      'Adultos (30-50 años)',
      'Adultos mayores (50+ años)',
      'Hombres',
      'Mujeres',
      'Familias con hijos',
      'Profesionales/Ejecutivos',
      'Emprendedores/Pequeños empresarios',
      'Estudiantes',
      'Personas con poder adquisitivo alto',
      'Personas con presupuesto moderado',
      'Personas que buscan calidad premium',
      'Personas que buscan precio accesible',
      'Personas activas/deportistas',
      'Personas interesadas en tecnología',
      'Personas del barrio/zona local'
    ]
  },
  {
    id: 'objetivoMarketing',
    text: 'Excelente. ¿Cuál es tu principal objetivo de marketing en este momento? 🚀',
    type: 'options',
    options: ['Aumentar visibilidad de mi marca', 'Generar más leads/consultas', 'Aumentar ventas directas']
  },
  {
    id: 'redesSociales',
    text: '¡Última pregunta! ¿Qué canales digitales utilizás o te interesa usar para promocionar tu negocio? Seleccioná todos los que apliquen 📱',
    type: 'multiple',
    options: ['Instagram', 'Facebook', 'Google Ads', 'Email Marketing']
  }
];

const TukiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState<UserData>({
    productoServicio: '',
    clienteIdeal: '',
    objetivoMarketing: '',
    redesSociales: []
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Forzar reinicio completo SIEMPRE
    console.log('🔄 Reiniciando onboarding completamente...');
    localStorage.removeItem('tukiUserData');
    
    // Resetear TODO el estado
    setMessages([]);
    setCurrentQuestion(-1);
    setInputValue('');
    setUserData({
      productoServicio: '',
      clienteIdeal: '',
      objetivoMarketing: '',
      redesSociales: []
    });
    setIsComplete(false);
    setIsTyping(false);
    setHasStarted(false);
    setIsEditMode(false);
    
    // Iniciar el flujo inmediatamente con un timestamp único
    const timestamp = Date.now();
    setTimeout(() => {
      console.log('🚀 Iniciando onboarding con timestamp:', timestamp);
      startOnboarding();
    }, 800);
  }, []); // Sin dependencias para que se ejecute solo al montar

const startOnboarding = () => {
  console.log('✨ Iniciando conversación con Tuki...');
  const welcomeMessage: Message = {
    id: 'welcome-' + Date.now() + '-' + Math.random(),
    text: '¡Hola! 👋 Soy Tuki, tu asistente personal de marketing digital para emprendedores argentinos. Estoy acá para ayudarte a crear campañas impactantes y rápidas para tu negocio. ¿Arrancamos?',
    isBot: true,
    timestamp: new Date()
  };

  setMessages([welcomeMessage]);
  setHasStarted(true);

  // Simular que Tuki está pensando 1.5s antes de la primera pregunta
  setTimeout(() => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentQuestion(0);
      showNextQuestion(0);
    }, 1500); // Duración del "pensando..."
    
  }, 2000); // Delay entre bienvenida y "pensando..."
};

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNextQuestion = (questionIndex: number) => {
    setIsTyping(true);
    setTimeout(() => {
      if (questionIndex < questions.length) {
        const question = questions[questionIndex];
        const newMessage: Message = {
          id: `question-${questionIndex}-${Date.now()}-${Math.random()}`,
          text: question.text,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
        setValidationError(null); // Limpiar errores de validación
      }
    }, 1500);
  };

  const showValidationError = (errorMessage: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const errorMsg: Message = {
        id: `validation-error-${Date.now()}-${Math.random()}`,
        text: errorMessage,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
      setValidationError(errorMessage);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Validar la respuesta antes de procesarla
    const currentQuestionId = questions[currentQuestion].id;
    const validation = validateResponse(currentQuestionId, inputValue);

    if (!validation.isValid && validation.errorMessage) {
      // Agregar mensaje del usuario primero
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: inputValue,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // Mostrar error de validación
      showValidationError(validation.errorMessage);
      return;
    }

    // Si la validación es exitosa, proceder normalmente
    const userMessage: Message = {
      id: Date.now().toString() + '-' + Math.random(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Guardar respuesta
    const questionKey = questions[currentQuestion].id as keyof UserData;
    const updatedUserData = {
      ...userData,
      [questionKey]: inputValue
    };
    setUserData(updatedUserData);

    setInputValue('');
    setValidationError(null);
    
    // Avanzar a la siguiente pregunta
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);

    // Mostrar siguiente pregunta o completar
    setTimeout(() => {
      if (nextQuestion < questions.length) {
        showNextQuestion(nextQuestion);
      } else {
        completeOnboarding(updatedUserData);
      }
    }, 1000);
  };

  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + '-' + Math.random(),
      text: option,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const questionKey = questions[currentQuestion].id as keyof UserData;
    const updatedUserData = {
      ...userData,
      [questionKey]: option
    };
    setUserData(updatedUserData);

    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);

    setTimeout(() => {
      if (nextQuestion < questions.length) {
        showNextQuestion(nextQuestion);
      } else {
        completeOnboarding(updatedUserData);
      }
    }, 1000);
  };

  const handleMultipleSelect = (option: string) => {
    const currentQuestionId = questions[currentQuestion].id;
    
    if (currentQuestionId === 'clienteIdeal') {
      // Manejar clienteIdeal como string (las opciones seleccionadas se joinean)
      const currentSelections = userData.clienteIdeal.split(', ').filter(item => item.length > 0);
      const updatedSelections = currentSelections.includes(option) 
        ? currentSelections.filter(item => item !== option)
        : [...currentSelections, option];
      
      setUserData(prev => ({
        ...prev,
        clienteIdeal: updatedSelections.join(', ')
      }));
    } else if (currentQuestionId === 'redesSociales') {
      // Manejar redesSociales como array
      const updatedRedesSociales = userData.redesSociales.includes(option) 
        ? userData.redesSociales.filter(item => item !== option)
        : [...userData.redesSociales, option];
      
      setUserData(prev => ({
        ...prev,
        redesSociales: updatedRedesSociales
      }));
    }
  };

  const completeMultipleChoice = () => {
    const currentQuestionId = questions[currentQuestion].id;
    let selectedOptions = '';
    
    if (currentQuestionId === 'clienteIdeal') {
      selectedOptions = userData.clienteIdeal.length > 0 ? userData.clienteIdeal : 'No especificado';
    } else if (currentQuestionId === 'redesSociales') {
      selectedOptions = userData.redesSociales.length > 0 ? userData.redesSociales.join(', ') : 'Ningún canal seleccionado';
    }
    
    const userMessage: Message = {
      id: Date.now().toString() + '-' + Math.random(),
      text: selectedOptions,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);

    setTimeout(() => {
      if (nextQuestion < questions.length) {
        showNextQuestion(nextQuestion);
      } else {
        completeOnboarding(userData);
      }
    }, 1000);
  };

  const completeOnboarding = (finalUserData: UserData) => {
    setIsTyping(true);
    setTimeout(() => {
      const completionMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: '¡Perfecto! Ya tengo toda la información que necesito. Ahora voy a preparar un resumen de tu briefing 📋',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, completionMessage]);
      setIsTyping(false);
      
      // Guardar en localStorage
      localStorage.setItem('tukiUserData', JSON.stringify(finalUserData));
      
      setTimeout(() => {
        setIsComplete(true);
      }, 2000);
    }, 1500);
  };

  const handleEditResponses = () => {
    console.log('📝 Iniciando modo edición...');
    setIsComplete(false);
    setIsEditMode(true);
    setIsTyping(false);
    
    // Mostrar mensaje de edición
    const editMessage: Message = {
      id: Date.now().toString() + '-' + Math.random(),
      text: '¡Perfecto! Te voy a mostrar tus respuestas una por una para que puedas editarlas. ¿Por cuál querés empezar? 🔧',
      isBot: true,
      timestamp: new Date()
    };
    
    setMessages([editMessage]);
  };

  const handleEditQuestion = (questionIndex: number) => {
    console.log(`✏️ Editando pregunta ${questionIndex}`);
    setCurrentQuestion(questionIndex);
    setIsEditMode(false);
    setValidationError(null);
    
    // Pre-cargar la respuesta actual en el input si es de tipo texto
    const currentAnswer = userData[questions[questionIndex].id as keyof UserData];
    if (questions[questionIndex].type === 'textarea' && typeof currentAnswer === 'string') {
      setInputValue(currentAnswer);
    }
    
    // Mostrar la pregunta
    showNextQuestion(questionIndex);
  };

  const currentQuestionData = currentQuestion >= 0 ? questions[currentQuestion] : null;

  if (isComplete) {
    return <OnboardingSummary userData={userData} onEdit={handleEditResponses} />;
  }

  // Mostrar opciones de edición
  if (isEditMode) {
    return (
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Editá tus respuestas ✏️
            </h2>
            <p className="text-gray-600">
              Hacé click en cualquier pregunta para modificar tu respuesta
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const answerKey = question.id as keyof UserData;
              const answer = userData[answerKey];
              const displayAnswer = Array.isArray(answer) ? answer.join(', ') : answer || 'Sin respuesta';
              
              return (
                <div 
                  key={question.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleEditQuestion(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {index + 1}. {question.text.split('😊')[0].split('🎯')[0].split('🚀')[0].split('📱')[0].trim()}
                      </h3>
                      <p className="text-gray-600 bg-gray-100 rounded p-2">
                        <strong>Tu respuesta:</strong> {displayAnswer}
                      </p>
                    </div>
                    <Edit3 className="w-5 h-5 text-blue-600 ml-4 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => setIsComplete(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Continuar con estas respuestas
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <div className="h-[600px] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-3 px-4 py-2 text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm italic text-blue-600">pensando...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentQuestion >= 0 && currentQuestion < questions.length && !isTyping && currentQuestionData && (
          <div className="border-t bg-gray-50/50 p-4">
            {validationError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">💡 Tip: {validationError}</p>
              </div>
            )}
            
            {currentQuestionData.type === 'options' ? (
              <div className="grid gap-2">
                {currentQuestionData.options?.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    onClick={() => handleOptionSelect(option)}
                    className="justify-start text-left h-auto p-4 hover:bg-blue-50"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : currentQuestionData.type === 'multiple' ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {currentQuestionData.options?.map((option) => {
                    const isSelected = currentQuestionData.id === 'clienteIdeal' 
                      ? userData.clienteIdeal.split(', ').includes(option)
                      : userData.redesSociales.includes(option);
                    
                    return (
                      <Button
                        key={option}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => handleMultipleSelect(option)}
                        className="text-sm"
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
                <Button 
                  onClick={completeMultipleChoice}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continuar
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                {currentQuestionData.type === 'textarea' ? (
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestionData.placeholder}
                    className={`flex-1 resize-none ${validationError ? 'border-red-300 focus:border-red-500' : ''}`}
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                ) : (
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestionData.placeholder}
                    className={`flex-1 ${validationError ? 'border-red-300 focus:border-red-500' : ''}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                )}
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TukiChat;
