class MockNotificationProvider {
  async sendPushNotification(pushToken, title, body, data = {}) {
    console.log('\n================ [MOCK PUSH NOTIFICATION] ================');
    console.log(`📡 Destinatario (Push Token): ${pushToken}`);
    console.log(`🔔 Título: ${title}`);
    console.log(`💬 Mensaje: ${body}`);
    console.log(`📦 Data adjunta:`, JSON.stringify(data, null, 2));
    console.log('===========================================================\n');
    
    return { success: true, provider: 'mock', messageId: `mock-${Date.now()}` };
  }

  
  /**
   * Simula el envío de notificaciones silenciosas a dispositivos protegidos.
   */
  async sendSilentPush({ pushTokens, payload }) {
    console.log('\n================================--------------------');
    console.log('🔕 [MOCK PUSH] Disparando Silent Push Notification');
    console.log(`📱 Destinatarios (${pushTokens.length} dispositivos):`, pushTokens);
    console.log('📦 Payload enviado:', JSON.stringify(payload, null, 2));
    console.log('================================--------------------\n');
  
    return {
      success: true,
      deliveredCount: pushTokens.length,
      mock: true
    };
  }
}


module.exports = new MockNotificationProvider();