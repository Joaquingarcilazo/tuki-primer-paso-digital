
import React from 'react';
import TukiChat from '../components/TukiChat';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ¡Hola! Soy <span className="text-blue-600">Tuki</span> 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu asistente personal para crear campañas de marketing digital que realmente funcionen para tu negocio
          </p>
        </div>
        
        <TukiChat />
      </div>
    </div>
  );
};

export default Index;
