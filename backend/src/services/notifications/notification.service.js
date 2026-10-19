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
}

module.exports = new NotificationService();