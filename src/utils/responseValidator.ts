export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// Lista de palabras que no son productos/servicios válidos
const invalidProducts = [
  'fuego', 'agua', 'aire', 'tierra', 'sol', 'luna', 'cielo', 'mar', 'océano',
  'amor', 'felicidad', 'tristeza', 'miedo', 'alegría', 'dolor', 'paz', 'guerra',
  'vida', 'muerte', 'tiempo', 'espacio', 'universo', 'dios', 'diablo',
  'nada', 'todo', 'algo', 'nada más', 'cualquier cosa',
  'quemar', 'arder', 'volar', 'caminar', 'correr', 'saltar', 'gritar', 'llorar',
  'reír', 'dormir', 'comer', 'beber', 'respirar', 'pensar', 'soñar',
  'fumar', 'bailar', 'cantar', 'escuchar', 'mirar', 'tocar', 'oler',
  'calor', 'frío', 'lluvia', 'viento', 'nieve', 'hielo', 'vapor',
  'luz', 'sombra', 'oscuridad', 'silencio', 'ruido', 'música', 'sonido',
  'violencia', 'odio', 'ira', 'venganza', 'maldad', 'crueldad', 'destrucción',
  'caos', 'desastre', 'ruina', 'perdición', 'condenación', 'castigo',
  'sufrimiento', 'tortura', 'agresión', 'ataque', 'daño', 'perjuicio',
  'asesinato', 'asesinatos', 'matar', 'asesinar', 'homicidio', 'crimen',
  'robo', 'robos', 'robar', 'hurto', 'estafa', 'fraude', 'droga', 'drogas',
  'arma', 'armas', 'pistola', 'pistolas', 'revólver', 'rifle', 'fusil',
  'bala', 'balas', 'munición', 'municiones', 'explosivo', 'explosivos',
  'bomba', 'bombas', 'cuchillo', 'cuchillos', 'navaja', 'navajas'
];

// Patrones más específicos para detectar contenido inapropiado
const inappropriatePatterns = [
  /\b(asesinat|matar|mat[aáe]|homicidi|crimen|criminal)\w*\b/i,
  /\b(rob[aoó]|hurt|estaf|fraud)\w*\b/i,
  /\b(drog|narcotic|cocain|marihuan)\w*\b/i,
  /\b(violenci|agresi[óo]n|tortur)\w*\b/i,
  /\b(odio|venganz|maldad|crueldad)\b/i,
  /\b(arm[oa]s?|pistol|revólver|rifle|fusil)\w*\b/i,
  /\b(bal[oa]s?|munici[óo]n|explosiv)\w*\b/i,
  /\b(bomb[oa]s?|cuchill|navaj)\w*\b/i
];

// Patrones que indican texto sin sentido
const gibberishPatterns = [
  /^[a-z]{1,3}(\s[a-z]{1,3}){3,}$/i, // Palabras muy cortas repetidas
  /^[a-z]*[0-9]+[a-z]*$/i, // Mezcla aleatoria de letras y números
  /([a-z])\1{4,}/i, // Letras repetidas más de 4 veces
  /^[bcdfghjklmnpqrstvwxyz]{5,}$/i, // Solo consonantes largas
  /^[aeiou]{4,}$/i, // Solo vocales largas
  /\b(asdf|qwer|zxcv|hjkl|fghj|dfgh|sdfg|xcvb|vbnm)\b/i // Patrones de teclado
];

// Palabras que indican productos/servicios comerciales válidos
const validBusinessIndicators = [
  'vendo', 'venta', 'servicio', 'producto', 'negocio', 'empresa', 'tienda', 'local',
  'ropa', 'comida', 'restaurante', 'panadería', 'peluquería', 'taller', 'consultorio',
  'contador', 'abogado', 'médico', 'dentista', 'veterinario', 'profesor', 'tutor',
  'limpieza', 'construcción', 'reparación', 'instalación', 'diseño', 'fotografía',
  'catering', 'delivery', 'transporte', 'mudanza', 'jardinería', 'carpintería',
  'plomería', 'electricidad', 'pintura', 'decoración', 'muebles', 'electrodomésticos',
  'repuestos', 'accesorios', 'joyería', 'zapatos', 'bolsos', 'perfumes', 'cosméticos'
];

export const validateProductoServicio = (input: string): ValidationResult => {
  const trimmed = input.trim().toLowerCase();
  
  // Verificar longitud mínima
  if (trimmed.length < 3) {
    return {
      isValid: false,
      errorMessage: 'Por favor, describe tu producto o servicio con más detalle. Necesito al menos unas palabras para entender mejor tu negocio.'
    };
  }

  // Verificar si es solo números o caracteres especiales
  if (/^[0-9\W]+$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'No veo que hayas descrito un producto o servicio real. ¿Podrías contarme qué es lo que ofrecés específicamente?'
    };
  }

  // Verificar patrones inapropiados PRIMERO (antes de palabras individuales)
  const hasInappropriatePattern = inappropriatePatterns.some(pattern => pattern.test(trimmed));
  
  if (hasInappropriatePattern) {
    return {
      isValid: false,
      errorMessage: 'Eso no parece ser un producto o servicio legítimo que puedas ofrecer. ¿Podrías contarme sobre tu negocio real?'
    };
  }

  // Verificar palabras inválidas
  const words = trimmed.split(/\s+/);
  const hasInvalidWords = words.some(word => invalidProducts.includes(word));
  
  if (hasInvalidWords) {
    return {
      isValid: false,
      errorMessage: 'Mmm, eso no parece ser un producto o servicio que puedas vender. ¿Podrías contarme qué es lo que realmente ofrecés en tu negocio?'
    };
  }

  // Verificar patrones de texto sin sentido
  const isGibberish = gibberishPatterns.some(pattern => pattern.test(trimmed));
  
  if (isGibberish) {
    return {
      isValid: false,
      errorMessage: 'No logro entender bien lo que escribiste. ¿Podrías describir nuevamente qué producto o servicio ofrecés? Por ejemplo: "vendo ropa", "soy contador", "tengo una panadería".'
    };
  }

  // Verificar que tenga al menos una palabra significativa O un indicador de negocio válido
  const meaningfulWords = words.filter(word => 
    word.length > 2 && 
    !/^(el|la|los|las|un|una|de|del|en|con|por|para|que|es|son|muy|más|pero|como|todo|esta|este)$/.test(word)
  );

  const hasValidBusinessIndicator = words.some(word => 
    validBusinessIndicators.includes(word) || 
    validBusinessIndicators.some(indicator => word.includes(indicator))
  );

  if (meaningfulWords.length === 0 && !hasValidBusinessIndicator) {
    return {
      isValid: false,
      errorMessage: 'Necesito que me cuentes específicamente qué vendes o qué servicio ofrecés. ¿Podrías ser más claro?'
    };
  }

  // Verificar que no sea solo conceptos abstractos
  if (meaningfulWords.length > 0 && !hasValidBusinessIndicator) {
    const abstractWords = meaningfulWords.filter(word => 
      invalidProducts.includes(word) || 
      /^(belleza|libertad|justicia|verdad|mentira|esperanza|desesperanza|bondad)$/.test(word)
    );
    
    if (abstractWords.length === meaningfulWords.length) {
      return {
        isValid: false,
        errorMessage: 'Parece que mencionaste conceptos abstractos. Necesito que me cuentes sobre un producto concreto que vendas o un servicio específico que ofrezcas.'
      };
    }
  }

  return { isValid: true };
};

export const validateClienteIdeal = (input: string): ValidationResult => {
  const trimmed = input.trim().toLowerCase();
  
  if (trimmed.length < 5) {
    return {
      isValid: false,
      errorMessage: 'Necesito más información sobre tu cliente ideal. ¿Podrías describir con más detalle quién es esa persona que realmente necesita lo que ofrecés?'
    };
  }

  // Verificar patrones de texto sin sentido
  const isGibberish = gibberishPatterns.some(pattern => pattern.test(trimmed));
  
  if (isGibberish) {
    return {
      isValid: false,
      errorMessage: 'No logro entender bien tu respuesta. ¿Podrías describir nuevamente quién es tu cliente ideal? Por ejemplo: "mujeres de 25-40 años", "pequeños empresarios", etc.'
    };
  }

  return { isValid: true };
};

export const validateResponse = (questionId: string, input: string): ValidationResult => {
  switch (questionId) {
    case 'productoServicio':
      return validateProductoServicio(input);
    case 'clienteIdeal':
      return validateClienteIdeal(input);
    default:
      return { isValid: true };
  }
};
