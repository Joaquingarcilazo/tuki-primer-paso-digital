
import { useCallback, useRef } from 'react';

export const useAudioNotification = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTukiNotification = useCallback(async () => {
    try {
      // URL directa del archivo MP3 de Google Drive
      // Convertimos la URL de visualización a URL de descarga directa
      const googleDriveFileId = '1yR9DimAeEUQcjh_d7GaWdWdO2lFL0Bih';
      const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${googleDriveFileId}`;
      
      // Crear nuevo elemento de audio si no existe o si la fuente cambió
      if (!audioRef.current || audioRef.current.src !== directDownloadUrl) {
        audioRef.current = new Audio(directDownloadUrl);
        
        // Configurar el audio
        audioRef.current.preload = 'auto';
        audioRef.current.volume = 0.7; // Volumen al 70%
      }
      
      // Reiniciar el audio al principio
      audioRef.current.currentTime = 0;
      
      // Reproducir el audio
      await audioRef.current.play();
      
    } catch (error) {
      console.log('Audio playback failed:', error);
      
      // Fallback: reproducir sonido sintético simple si falla el MP3
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (fallbackError) {
        console.log('Fallback audio also failed:', fallbackError);
      }
    }
  }, []);

  return { playTukiNotification };
};
