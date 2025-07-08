
import { useCallback, useRef } from 'react';

export const useAudioNotification = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const createSnapSound = useCallback(() => {
    // Crear contexto de audio si no existe
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    
    // Crear un sonido sintético similar a un chasquido de dedos
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Configurar filtro para darle más realismo
    filterNode.type = 'highpass';
    filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);

    // Configurar osciladores para crear el sonido de chasquido
    oscillator1.type = 'square';
    oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);

    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.03);

    // Configurar envelope (envolvente) para el chasquido
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    // Conectar los nodos
    oscillator1.connect(filterNode);
    oscillator2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Reproducir el sonido
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    
    // Detener después del sonido
    oscillator1.stop(audioContext.currentTime + 0.15);
    oscillator2.stop(audioContext.currentTime + 0.15);
  }, []);

  const playTukiNotification = useCallback(async () => {
    try {
      // Reanudar el contexto de audio en caso de que esté suspendido (política del navegador)
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      createSnapSound();
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  }, [createSnapSound]);

  return { playTukiNotification };
};
