/**
 * Normaliza un valor según su tipo (ej. extraer hostname y remover 'www.' para dominios).
 * @param {string} eventType - El tipo de regla/evento (ej. 'domain', 'keyword', etc.)
 * @param {string} rawValue - El valor crudo a normalizar
 * @returns {string} El valor limpio y estandarizado
 */
const normalizeValue = (eventType, rawValue) => {
  if (!rawValue) return '';
  
  if (eventType === 'domain') {
    let hostname = '';
    try {
      const urlToParse = rawValue.startsWith('http') ? rawValue : `https://${rawValue}`;
      const parsed = new URL(urlToParse);
      hostname = parsed.hostname.toLowerCase();
    } catch {
      hostname = rawValue.trim().toLowerCase();
    }

    // Remover el prefijo 'www.' si lo tiene
    return hostname.replace(/^www\./, '');
  }
  
  return rawValue.trim().toLowerCase(); // Opcional: mantener todo consistente en minúsculas
};

module.exports = {
  normalizeValue
};