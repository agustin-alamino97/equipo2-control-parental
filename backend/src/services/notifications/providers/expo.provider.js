/* ==========================================================================
 * BORRADOR (Pendiente de instalar 'expo-server-sdk' y configurar front-end)
 * 
 * Cuando se active Expo, descomentar todo este bloque y eliminar la clase 
 * placeholder inferior.
 * ==========================================================================

const { Expo } = require('expo-server-sdk');
const expo = new Expo();

class ExpoNotificationProvider {
  async sendPushNotification(pushToken, title, body, data = {}) {
    if (!Expo.isExpoPushToken(pushToken)) {
      throw new Error(`Token de Expo inválido: ${pushToken}`);
    }

    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    };

    return await expo.sendPushNotificationsAsync([message]);
  }

  async sendSilentPush({ pushTokens, payload }) {
    const tokens = Array.isArray(pushTokens) ? pushTokens : [pushTokens];
    const messages = [];

    for (const pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        continue;
      }

      messages.push({
        to: pushToken,
        priority: 'high',
        _contentAvailable: true,
        data: payload,
      });
    }

    if (messages.length === 0) return false;

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return { success: true, tickets };
  }
}

module.exports = new ExpoNotificationProvider();
========================================================================== */
