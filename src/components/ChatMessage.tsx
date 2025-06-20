
import React from 'react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.isBot ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          <span className="text-sm">
            {message.isBot ? '🤖' : '👤'}
          </span>
        </div>
        
        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-3 ${
          message.isBot 
            ? 'bg-white border border-gray-200 text-gray-800' 
            : 'bg-blue-600 text-white'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
          <p className={`text-xs mt-2 ${
            message.isBot ? 'text-gray-400' : 'text-blue-100'
          }`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
