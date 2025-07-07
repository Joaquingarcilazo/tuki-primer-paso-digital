import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Edit3, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import OnboardingSummary from './OnboardingSummary';
import { runAction } from 'lovable:actions';

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
    text: '¡Genial! Ahora contame, ¿quién es tu cliente ideal? Pensá en esa persona que realmente necesita lo que ofrecés 🎯',
    placeholder: 'Por ejemplo: Mujeres de 25-40 años que hacen ejercicio, pequeños empresarios, familias del barrio...',
    type: 'textarea'
  },
  {
    id: 'objetivoMarketing',
    text: 'Excelente. ¿Cuál es tu principal objetivo de marketing en este momento? 🚀',
    type: 'options',
    options: ['Aumentar visibilidad de mi marca', 'Generar más leads/consultas', 'Aumentar ventas directas']
  },
  {
    id: 'redesSociales',
    text: '¡Última pregunta! ¿Tenés redes sociales activas? Seleccioná todas las que usás 📱',
    type: 'multiple',
    options: ['Instagram', 'Facebook', 'Google My Business', 'Email Marketing', 'No tengo redes activas aún']
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
      }
    }, 1500);
  };

  const validateProductService = (input: string): boolean => {
    const trimmedInput = input.trim().toLowerCase();
    
    // Lista de palabras que no son productos/servicios válidos
    const invalidWords = [
      'fuego', 'agua', 'aire', 'tierra', 'amor', 'felicidad', 'tristeza', 
      'alegría', 'paz', 'guerra', 'libertad', 'justicia', 'verdad', 'mentira',
      'tiempo', 'espacio', 'nada', 'todo', 'vida', 'muerte', 'sol', 'luna',
      'cielo', 'infierno', 'dios', 'alma', 'espíritu', 'energía', 'luz', 'oscuridad'
    ];
    
    // Si la respuesta es solo una palabra inválida
    if (invalidWords.includes(trimmedInput)) {
      return false;
    }
    
    // Si es muy corta (menos de 3 caracteres)
    if (trimmedInput.length < 3) {
      return false;
    }
    
    // Palabras clave que indican un producto/servicio válido
    const validKeywords = [
      'vendo', 'venta', 'servicio', 'ofrezco', 'brindo', 'tengo', 'soy',
      'trabajo', 'empresa', 'negocio', 'tienda', 'local', 'consultorio',
      'taller', 'curso', 'clase', 'enseño', 'capacito', 'reparo', 'fabrico',
      'produzco', 'distribuyo', 'importo', 'exporto', 'alquilo', 'rento'
    ];
    
    // Si contiene alguna palabra clave válida, es válido
    const hasValidKeyword = validKeywords.some(keyword => 
      trimmedInput.includes(keyword)
    );
    
    if (hasValidKeyword) {
      return true;
    }
    
    // Si tiene más de 10 caracteres y no es solo una palabra inválida, probablemente es válido
    if (trimmedInput.length > 10 && !invalidWords.includes(trimmedInput)) {
      return true;
    }
    
    return false;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-' + Math.random(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Validación especial para la primera pregunta (producto/servicio)
    const questionKey = questions[currentQuestion].id as keyof UserData;
    if (questionKey === 'productoServicio') {
      if (!validateProductService(inputValue)) {
        const retryMessage: Message = {
          id: "invalid-" + Date.now(),
          text: "Mmm... No logro identificar un producto o servicio específico en tu respuesta. ¿Podés contarme qué vendés, qué servicio ofrecés, o cuál es tu negocio? Por ejemplo: 'Vendo ropa para niños', 'Soy diseñador gráfico', 'Tengo un restaurante', etc. 😊",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, retryMessage]);
        setInputValue('');
        return;
      }
    }

    // Guardar respuesta válida
    const updatedUserData = {
      ...userData,
      [questionKey]: inputValue
    };
    setUserData(updatedUserData);

    setInputValue('');
    
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
    const updatedRedesSociales = userData.redesSociales.includes(option) 
      ? userData.redesSociales.filter(item => item !== option)
      : [...userData.redesSociales, option];
    
    setUserData(prev => ({
      ...prev,
      redesSociales: updatedRedesSociales
    }));
  };

  const completeRedesSociales = () => {
    const selectedOptions = userData.redesSociales.length > 0 
      ? userData.redesSociales.join(', ') 
      : 'No tengo redes activas aún';
    
    const userMessage: Message = {
      id: Date.now().toString() + '-' + Math.random(),
      text: selectedOptions,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const updatedUserData = { ...userData };
    completeOnboarding(updatedUserData);
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
    console.log('🔄 Reiniciando desde editar respuestas...');
    // Reiniciar completamente
    setIsComplete(false);
    setCurrentQuestion(-1);
    setMessages([]);
    setUserData({
      productoServicio: '',
      clienteIdeal: '',
      objetivoMarketing: '',
      redesSociales: []
    });
    setHasStarted(false);
    setIsTyping(false);
    setInputValue('');
    
    // Reiniciar el flujo
    setTimeout(() => {
      startOnboarding();
    }, 500);
  };

  const currentQuestionData = currentQuestion >= 0 ? questions[currentQuestion] : null;

  if (isComplete) {
    return <OnboardingSummary userData={userData} onEdit={handleEditResponses} />;
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
                  {currentQuestionData.options?.map((option) => (
                    <Button
                      key={option}
                      variant={userData.redesSociales.includes(option) ? "default" : "outline"}
                      onClick={() => handleMultipleSelect(option)}
                      className="text-sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={completeRedesSociales}
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
                    className="flex-1 resize-none"
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
                    className="flex-1"
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
