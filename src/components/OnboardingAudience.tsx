
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AudienceData } from '../types/campaign';

const OnboardingAudience: React.FC<{ onNext: (a: AudienceData) => void }> = ({ onNext }) => {
  const [audience, setAudience] = useState<AudienceData>({
    edadMin: undefined,
    edadMax: undefined,
    ubicacion: '',
    intereses: ''
  });

  const handleChange = (field: keyof AudienceData, value: string | number) => {
    setAudience(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!audience.ubicacion?.trim() && !audience.intereses?.trim()) {
      alert('Indicá al menos una ubicación o intereses para tu público objetivo.');
      return;
    }
    onNext(audience);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Definí tu público objetivo</h2>

      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Edad mínima"
          value={audience.edadMin ?? ''}
          onChange={e => handleChange('edadMin', +e.target.value)}
        />
        <Input
          type="number"
          placeholder="Edad máxima"
          value={audience.edadMax ?? ''}
          onChange={e => handleChange('edadMax', +e.target.value)}
        />
      </div>

      <Input
        type="text"
        placeholder="Ubicación (ej.: Santa Fe, Argentina)"
        value={audience.ubicacion}
        onChange={e => handleChange('ubicacion', e.target.value)}
      />

      <Textarea
        placeholder="Intereses relevantes"
        value={audience.intereses}
        onChange={e => handleChange('intereses', e.target.value)}
      />

      <Button onClick={handleContinue} className="w-full">
        Continuar
      </Button>
    </div>
  );
};

export default OnboardingAudience;
