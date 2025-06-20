
export interface AudienceData {
  edadMin?: number;     // opcional
  edadMax?: number;
  ubicacion?: string;
  intereses?: string;
}

export interface UserData {
  productoServicio: string;
  clienteIdeal: string;
  objetivoMarketing: string;
  redesSociales: string[];
}

export interface Campaign {
  titulo: string;
  texto: string;
  publicoObjetivo: string;
  presupuesto: string;
  duracion: string;
  canal: string;
  imagenes?: string[]; // Agregamos las imágenes generadas
}
