
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

interface ClienteIdealData {
  edad: string[];
  genero: string[];
  nivelAdquisitivo: string[];
  caracteristicasAdicionales: string[];
}

const questions = [
  {
    id: 'productoServicio',
    text: 'Empecemos conociendo tu negocio. ¿Qué tipo de producto o servicio ofrecés? Brindame detalles para poder ayudarte mejor 😊',
    placeholder: 'Por ejemplo: Vendo ropa deportiva para mujeres, soy contador, tengo una panadería...',
    type: 'textarea'
  },
  {
    id: 'edad',
    text: 'Perfecto! Ahora definamos tu cliente ideal. Empecemos por la edad. ¿Qué rangos de edad tiene tu público objetivo? Podés seleccionar todas las opciones que apliquen 🎯',
    type: 'multiple',
    options: ['Jóvenes (18-30 años)', 'Adultos (30-50 años)', 'Adultos mayores (50+ años)', 'Todas las edades']
  },
  {
    id: 'genero',
    text: '¡Excelente! Ahora, ¿a qué géneros está dirigido tu producto o servicio? Podés seleccionar todas las opciones que apliquen 👥',
    type: 'multiple',
    options: ['Hombres', 'Mujeres', 'Ambos géneros', 'No binario/Otros']
  },
  {
    id: 'nivelAdquisitivo',
    text: 'Genial. ¿Qué niveles adquisitivos tienen tus clientes ideales? Podés seleccionar todas las opciones que apliquen 💰',
    type: 'multiple',
    options: ['Poder adquisitivo alto', 'Presupuesto moderado', 'Precio accesible', 'Todos los niveles']
  },
  {
    id: 'caracteristicasAdicionales',
    text: 'Perfecto! Para terminar de definir tu cliente ideal, ¿qué otras características lo describen? Podés seleccionar todas las que apliquen 🎯',
    type: 'multiple',
    options: [
      'Familias con hijos',
      'Profesionales/Ejecutivos',
      'Emprendedores/Pequeños empresarios',
      'Estudiantes',
      'Personas que buscan calidad premium',
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
    text: '¡Última pregunta! ¿Qué canales digitales utilizás o te interesa usar para promocionar tu negocio? Podés seleccionar todos los que apliquen 📱',
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
  const [clienteIdealData, setClienteIdealData] = useState<ClienteIdealData>({
    edad: [],
    genero: [],
    nivelAdquisitivo: [],
    caracteristicasAdicionales: []
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showWorking, setShowWorking] = useState(false);
  const [showClienteIdealSummary, setShowClienteIdealSummary] = useState(false);
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);

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
    setClienteIdealData({
      edad: [],
      genero: [],
      nivelAdquisitivo: [],
      caracteristicasAdicionales: []
    });
    setIsComplete(false);
    setIsTyping(false);
    setHasStarted(false);
    setIsEditMode(false);
    setShowQuestionOptions(false);
    
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
      text: 'Te ayudaré 24/7 a crear campañas efectivas de marketing digital para tu negocio. ¿Comenzamos?',
      isBot: true,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setHasStarted(true);

    // 1. Espera 2 segundos, luego muestra "Trabajando para tu negocio"
    setTimeout(() => {
      setShowWorking(true);

      // 2. Espera 3 segundos, luego oculta el mensaje y muestra la primera pregunta
      setTimeout(() => {
        setShowWorking(false);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          setCurrentQuestion(0);
          showNextQuestion(0);
        }, 1500); // Duración del "pensando..."

      }, 3000); // "Trabajando para tu negocio" visible 3s

    }, 2000); // Delay entre bienvenida y "Trabajando..."
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNextQuestion = (questionIndex: number) => {
    setIsTyping(true);
    setShowQuestionOptions(false);
    
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
        setValidationError(null);
        
        // Mostrar opciones después de un delay más largo para asegurar que la pregunta sea visible
        setTimeout(() => {
          setShowQuestionOptions(true);
          // Hacer scroll después de mostrar las opciones para asegurar visibilidad
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }, 2000); // Aumentado de 500ms a 2000ms
      }
    }, 1500);
  };

  const buildClienteIdealString = () => {
    const parts = [];
    if (clienteIdealData.edad.length > 0) parts.push(...clienteIdealData.edad);
    if (clienteIdealData.genero.length > 0) parts.push(...clienteIdealData.genero);
    if (clienteIdealData.nivelAdquisitivo.length > 0) parts.push(...clienteIdealData.nivelAdquisitivo);
    if (clienteIdealData.caracteristicasAdicionales.length > 0) {
      parts.push(...clienteIdealData.caracteristicasAdicionales);
    }
    return parts.join(', ');
  };

  const showClienteIdealConfirmation = () => {
    setShowClienteIdealSummary(true);
    setIsTyping(true);
    
    setTimeout(() => {
      const clienteIdealString = buildClienteIdealString();
      const confirmationMessage: Message = {
        id: `cliente-confirmation-${Date.now()}-${Math.random()}`,
        text: `Perfecto! Según lo que me contaste, tu cliente ideal es: "${clienteIdealString}". ¿Está correcto? 🎯`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmationMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleClienteIdealConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      const clienteIdealString = buildClienteIdealString();
      setUserData(prev => ({ ...prev, clienteIdeal: clienteIdealString }));
      
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: 'Sí, está correcto',
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setShowClienteIdealSummary(false);
      setCurrentQuestion(5); // Ir a objetivo de marketing
      
      setTimeout(() => {
        showNextQuestion(5);
      }, 1000);
    } else {
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: 'No, me gustaría modificarlo',
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Resetear datos del cliente ideal y volver al primer paso
      setClienteIdealData({
        edad: [],
        genero: [],
        nivelAdquisitivo: [],
        caracteristicasAdicionales: []
      });
      
      setShowClienteIdealSummary(false);
      setCurrentQuestion(1); // Volver a edad
      
      setTimeout(() => {
        showNextQuestion(1);
      }, 1000);
    }
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
    setShowQuestionOptions(false);
    
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

  const handleOptionSelectNew = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + '-' + Math.random(),
      text: option,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const currentQuestionId = questions[currentQuestion].id;
    
    // Solo manejar objetivo de marketing como selección única
    if (currentQuestionId === 'objetivoMarketing') {
      setUserData(prev => ({ ...prev, objetivoMarketing: option }));
      setShowQuestionOptions(false);
      setCurrentQuestion(6); // Ir a redes sociales
      setTimeout(() => showNextQuestion(6), 1000);
    }
  };

  const handleMultipleSelect = (option: string) => {
    const currentQuestionId = questions[currentQuestion].id;
    
    if (currentQuestionId === 'edad') {
      const updatedSelections = clienteIdealData.edad.includes(option) 
        ? clienteIdealData.edad.filter(item => item !== option)
        : [...clienteIdealData.edad, option];
      
      setClienteIdealData(prev => ({
        ...prev,
        edad: updatedSelections
      }));
    } else if (currentQuestionId === 'genero') {
      const updatedSelections = clienteIdealData.genero.includes(option) 
        ? clienteIdealData.genero.filter(item => item !== option)
        : [...clienteIdealData.genero, option];
      
      setClienteIdealData(prev => ({
        ...prev,
        genero: updatedSelections
      }));
    } else if (currentQuestionId === 'nivelAdquisitivo') {
      const updatedSelections = clienteIdealData.nivelAdquisitivo.includes(option) 
        ? clienteIdealData.nivelAdquisitivo.filter(item => item !== option)
        : [...clienteIdealData.nivelAdquisitivo, option];
      
      setClienteIdealData(prev => ({
        ...prev,
        nivelAdquisitivo: updatedSelections
      }));
    } else if (currentQuestionId === 'caracteristicasAdicionales') {
      const updatedSelections = clienteIdealData.caracteristicasAdicionales.includes(option) 
        ? clienteIdealData.caracteristicasAdicionales.filter(item => item !== option)
        : [...clienteIdealData.caracteristicasAdicionales, option];
      
      setClienteIdealData(prev => ({
        ...prev,
        caracteristicasAdicionales: updatedSelections
      }));
    } else if (currentQuestionId === 'redesSociales') {
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
    
    if (currentQuestionId === 'edad') {
      selectedOptions = clienteIdealData.edad.length > 0 
        ? clienteIdealData.edad.join(', ') 
        : 'Sin edad específica';
        
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: selectedOptions,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setShowQuestionOptions(false);
      setCurrentQuestion(2); // Ir a género
      setTimeout(() => showNextQuestion(2), 1000);
      
    } else if (currentQuestionId === 'genero') {
      selectedOptions = clienteIdealData.genero.length > 0 
        ? clienteIdealData.genero.join(', ') 
        : 'Sin género específico';
        
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: selectedOptions,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setShowQuestionOptions(false);
      setCurrentQuestion(3); // Ir a nivel adquisitivo
      setTimeout(() => showNextQuestion(3), 1000);
      
    } else if (currentQuestionId === 'nivelAdquisitivo') {
      selectedOptions = clienteIdealData.nivelAdquisitivo.length > 0 
        ? clienteIdealData.nivelAdquisitivo.join(', ') 
        : 'Sin nivel adquisitivo específico';
        
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: selectedOptions,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setShowQuestionOptions(false);
      setCurrentQuestion(4); // Ir a características adicionales
      setTimeout(() => showNextQuestion(4), 1000);
      
    } else if (currentQuestionId === 'caracteristicasAdicionales') {
      selectedOptions = clienteIdealData.caracteristicasAdicionales.length > 0 
        ? clienteIdealData.caracteristicasAdicionales.join(', ') 
        : 'Sin características adicionales';
        
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: selectedOptions,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setShowQuestionOptions(false);
      // Mostrar resumen del cliente ideal
      setTimeout(() => {
        showClienteIdealConfirmation();
      }, 1000);
      
    } else if (currentQuestionId === 'redesSociales') {
      selectedOptions = userData.redesSociales.length > 0 
        ? userData.redesSociales.join(', ') 
        : 'Ningún canal seleccionado';
        
      const userMessage: Message = {
        id: Date.now().toString() + '-' + Math.random(),
        text: selectedOptions,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setShowQuestionOptions(false);
      // Completar onboarding
      setTimeout(() => {
        completeOnboarding(userData);
      }, 1000);
    }
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
    setShowQuestionOptions(false);
    
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
          {showWorking && (
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                Trabajando para tu negocio
              </span>
            </div>
          )}
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
          
          {/* Espacio adicional para asegurar que las opciones no tapen el último mensaje */}
          {showQuestionOptions && <div className="h-4"></div>}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {showClienteIdealSummary && (
          <div className="border-t bg-gray-50/50 p-4">
            <div className="flex space-x-3 justify-center">
              <Button
                onClick={() => handleClienteIdealConfirmation(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                Sí, está correcto
              </Button>
              <Button
                onClick={() => handleClienteIdealConfirmation(false)}
                variant="outline"
                className="px-8"
              >
                No, modificar
              </Button>
            </div>
          </div>
        )}

        {currentQuestion >= 0 && currentQuestion < questions.length && !isTyping && !showClienteIdealSummary && currentQuestionData && showQuestionOptions && (
          <div className="border-t bg-gray-50/50 p-4">
            {validationError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">💡 Tip: {validationError}</p>
              </div>
            )}
            
            {currentQuestionData.type === 'options' ? (
              <div className="grid gap-3 max-w-2xl mx-auto">
                {currentQuestionData.options?.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    onClick={() => handleOptionSelectNew(option)}
                    className="justify-start text-left h-auto p-4 hover:bg-blue-50 text-wrap"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : currentQuestionData.type === 'multiple' ? (
              <>
                <div className="max-h-64 overflow-y-auto mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                    {currentQuestionData.options?.map((option) => {
                      let isSelected = false;
                      
                      if (currentQuestionData.id === 'edad') {
                        isSelected = clienteIdealData.edad.includes(option);
                      } else if (currentQuestionData.id === 'genero') {
                        isSelected = clienteIdealData.genero.includes(option);
                      } else if (currentQuestionData.id === 'nivelAdquisitivo') {
                        isSelected = clienteIdealData.nivelAdquisitivo.includes(option);
                      } else if (currentQuestionData.id === 'caracteristicasAdicionales') {
                        isSelected = clienteIdealData.caracteristicasAdicionales.includes(option);
                      } else if (currentQuestionData.id === 'redesSociales') {
                        isSelected = userData.redesSociales.includes(option);
                      }
                      
                      return (
                        <Button
                          key={option}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleMultipleSelect(option)}
                          className="text-sm h-auto p-3 text-wrap justify-start"
                        >
                          {option}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={completeMultipleChoice}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Continuar
                  </Button>
                </div>
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
