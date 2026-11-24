const mockProvider = require('./providers/mock.provider');
const expoProvider = require('./providers/expo.provider');

class NotificationService {
  constructor() {
    // Lee la variable de entorno o usa 'mock' por defecto
    const providerName = (process.env.NOTIFICATION_PROVIDER || 'mock').toLowerCase();

    switch (providerName) {
      case 'expo':
        this.provider = expoProvider;
        break;
      case 'mock':
      default:
        this.provider = mockProvider;
        break;
    }
  }

  // Método público expuesto a event.service.js
  async enviarNotificacion(pushToken, payload) {
    if (!pushToken) {
      console.warn('[NotificationService] No se envió notificación: El usuario no tiene push_token registrado.');
      return false;
    }

    const { title, body, data } = payload;
    
    try {
      return await this.provider.sendPushNotification(pushToken, title, body, data);
    } catch (error) {
      console.error('[NotificationService] Error al enviar notificación push:', error);
      return false;
    }
  }

  /**
   * Envía una notificación silenciosa (Silent Push) a uno o varios dispositivos.
   * @param {Object} options - Opciones del silent push
   * @param {string|string[]} options.pushTokens - Token o lista de tokens de los dispositivos
   * @param {Object} options.payload - Datos adicionales que viajan en la notificación
   */
  async sendSilentPush({ pushTokens, payload }) {
    if (!pushTokens || (Array.isArray(pushTokens) && pushTokens.length === 0)) {
      console.warn('[NotificationService] No se envió silent push: No hay tokens de dispositivos.');
      return false;
    }

    try {
      // Si tu proveedor soporta envío masivo (como el mock o expo), se lo pasamos directamente
      if (typeof this.provider.sendSilentPush === 'function') {
        return await this.provider.sendSilentPush({ pushTokens, payload });
      }

      // Fallback por si el proveedor solo soporta envío individual
      const tokens = Array.isArray(pushTokens) ? pushTokens : [pushTokens];
      const results = [];
      for (const token of tokens) {
        const res = await this.provider.sendPushNotification(token, '', '', payload);
        results.push(res);
      }
      return { success: true, deliveredCount: results.length };

    } catch (error) {
      console.error('[NotificationService] Error al enviar Silent Push:', error);
      throw error;
    }
  }

  
}

module.exports = new NotificationService();