
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Edit3, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import OnboardingSummary from './OnboardingSummary';

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
    text: '¡Perfecto! Empecemos conociendo tu negocio. ¿Qué tipo de producto o servicio ofrecés? Contame con detalles para poder ayudarte mejor 😊',
    placeholder: 'Por ejemplo: Vendo ropa deportiva para mujeres, soy contador, tengo una panadería...'
  },
  {
    id: 'clienteIdeal',
    text: '¡Genial! Ahora contame, ¿quién es tu cliente ideal? Pensá en esa persona que realmente necesita lo que ofrecés 🎯',
    placeholder: 'Por ejemplo: Mujeres de 25-40 años que hacen ejercicio, pequeños empresarios, familias del barrio...'
  },
  {
    id: 'objetivoMarketing',
    text: 'Excelente. ¿Cuál es tu principal objetivo de marketing en este momento? 🚀',
    options: ['Aumentar visibilidad de mi marca', 'Generar más leads/consultas', 'Aumentar ventas directas']
  },
  {
    id: 'redesSociales',
    text: '¡Última pregunta! ¿Tenés redes sociales activas? Seleccioná todas las que usás 📱',
    options: ['Instagram', 'Facebook', 'Google My Business', 'Email Marketing', 'No tengo redes activas aún']
  }
];

const TukiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState<UserData>({
    productoServicio: '',
    clienteIdeal: '',
    objetivoMarketing: '',
    redesSociales: []
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mensaje de bienvenida
    const welcomeMessage: Message = {
      id: '1',
      text: '¡Hola! 👋 Soy Tuki, tu asistente de marketing digital. Estoy aquí para ayudarte a crear campañas increíbles para tu negocio. Te voy a hacer algunas preguntas rápidas para conocerte mejor. ¿Estás listo?',
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Después de un momento, mostrar la primera pregunta
    setTimeout(() => {
      showNextQuestion();
    }, 2000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNextQuestion = () => {
    setIsTyping(true);
    setTimeout(() => {
      if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        const newMessage: Message = {
          id: Date.now().toString(),
          text: question.text,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Guardar respuesta
    const questionKey = questions[currentQuestion].id as keyof UserData;
    setUserData(prev => ({
      ...prev,
      [questionKey]: inputValue
    }));

    setInputValue('');
    setCurrentQuestion(prev => prev + 1);

    // Mostrar siguiente pregunta o completar
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        showNextQuestion();
      } else {
        completeOnboarding();
      }
    }, 1000);
  };

  const handleOptionSelect = (option: string, isMultiple = false) => {
    const questionKey = questions[currentQuestion].id as keyof UserData;
    
    if (isMultiple) {
      setUserData(prev => ({
        ...prev,
        redesSociales: prev.redesSociales.includes(option) 
          ? prev.redesSociales.filter(item => item !== option)
          : [...prev.redesSociales, option]
      }));
    } else {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: option,
        isBot: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      setUserData(prev => ({
        ...prev,
        [questionKey]: option
      }));

      setCurrentQuestion(prev => prev + 1);

      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          showNextQuestion();
        } else {
          completeOnboarding();
        }
      }, 1000);
    }
  };

  const completeRedesSociales = () => {
    const selectedOptions = userData.redesSociales.join(', ');
    const userMessage: Message = {
      id: Date.now().toString(),
      text: selectedOptions || 'No tengo redes activas aún',
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsTyping(true);
    setTimeout(() => {
      const completionMessage: Message = {
        id: Date.now().toString(),
        text: '¡Perfecto! Ya tengo toda la información que necesito. Ahora voy a preparar un resumen de tu briefing 📋',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, completionMessage]);
      setIsTyping(false);
      
      // Guardar en localStorage
      localStorage.setItem('tukiUserData', JSON.stringify(userData));
      
      setTimeout(() => {
        setIsComplete(true);
      }, 2000);
    }, 1500);
  };

  const handleEditResponses = () => {
    setIsComplete(false);
    setCurrentQuestion(0);
    setMessages([]);
    setUserData({
      productoServicio: '',
      clienteIdeal: '',
      objetivoMarketing: '',
      redesSociales: []
    });
    
    // Reiniciar el flujo
    const welcomeMessage: Message = {
      id: '1',
      text: '¡Perfecto! Vamos a revisar tus respuestas. Te haré las preguntas nuevamente 😊',
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    setTimeout(() => {
      showNextQuestion();
    }, 2000);
  };

  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isRedesSocialesQuestion = currentQuestionData?.id === 'redesSociales';

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
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentQuestion < questions.length && !isTyping && (
          <div className="border-t bg-gray-50/50 p-4">
            {currentQuestionData?.options ? (
              <div className="space-y-3">
                {isRedesSocialesQuestion ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {currentQuestionData.options.map((option) => (
                        <Button
                          key={option}
                          variant={userData.redesSociales.includes(option) ? "default" : "outline"}
                          onClick={() => handleOptionSelect(option, true)}
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
                  <div className="grid gap-2">
                    {currentQuestionData.options.map((option) => (
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
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                {currentQuestionData?.id === 'productoServicio' || currentQuestionData?.id === 'clienteIdeal' ? (
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestionData?.placeholder}
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
                    placeholder={currentQuestionData?.placeholder}
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
