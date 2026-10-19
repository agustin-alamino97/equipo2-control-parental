// const { Expo } = require('expo-server-sdk');
// const expo = new Expo();

class ExpoNotificationProvider {
  async sendPushNotification(pushToken, title, body, data = {}) {
    /* Código real de Expo:
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Token de Expo inválido: ${pushToken}`);
      return { success: false, error: 'INVALID_TOKEN' };
    }

    const messages = [{
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high'
    }];

    const chunks = expo.chunkPushNotifications(messages);
    // enviar chunks...
    */

    console.log(`[Expo Provider] Enviando notificación a token Expo: ${pushToken}`);
    return { success: true, provider: 'expo' };
  }
}

module.exports = new ExpoNotificationProvider();