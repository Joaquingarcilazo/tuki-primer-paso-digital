
import React from 'react';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface InstagramPreviewProps {
  caption: string;
  imageUrl: string;
  hashtags: string[];
  accountName: string;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ 
  caption, 
  imageUrl, 
  hashtags, 
  accountName 
}) => {
  const displayCaption = caption.length > 100 
    ? caption.substring(0, 100) + '... ver más'
    : caption;

  return (
    <Card className="max-w-sm mx-auto bg-white shadow-lg">
      {/* Header del post */}
      <div className="flex items-center p-3 border-b">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm font-bold">
            {accountName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-semibold text-sm">{accountName}</span>
        <div className="ml-auto">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
        </div>
      </div>
      
      {/* Imagen */}
      <div className="aspect-square">
        <img 
          src={imageUrl} 
          alt="Instagram post" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Acciones */}
      <div className="flex items-center justify-between p-3">
        <div className="flex space-x-4">
          <Heart className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
          <Send className="w-6 h-6" />
        </div>
        <Bookmark className="w-6 h-6" />
      </div>
      
      {/* Likes y caption */}
      <div className="px-3 pb-3">
        <div className="font-semibold text-sm mb-1">324 Me gusta</div>
        <div className="text-sm">
          <span className="font-semibold mr-2">{accountName}</span>
          {displayCaption}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          hace 2 minutos
        </div>
      </div>
    </Card>
  );
};

export default InstagramPreview;
