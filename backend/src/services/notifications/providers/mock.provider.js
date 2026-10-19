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
}

module.exports = new MockNotificationProvider();