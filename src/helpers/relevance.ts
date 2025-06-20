
export function isImageRelevant(url: string, producto: string): boolean {
  const keyword = producto.split(' ')[0].toLowerCase();   // palabra clave
  return url.toLowerCase().includes(keyword);             // regla simple
}
