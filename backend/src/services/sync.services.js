const db = require('../config/db');

class SyncService {
  async getSystemRules() {
    const { data, error } = await db
      .from('system_blocklist')
      .select('domain, rule_type')
      .eq('activo', true);

    if (error) {
      throw new Error(`Error al obtener la lista de bloqueo del sistema: ${error.message}`);
    }

    const lotba = data.filter(item => item.rule_type === 'lotba').map(item => item.domain);
    const regex = data.filter(item => item.rule_type === 'regex').map(item => item.domain);

    return {
      total: data.length,
      lotba,
      regex,
      syncedAt: new Date().toISOString()
    };
  }

  async getCustomRules(deviceUuid, deviceToken) {
    // 1. Validar las credenciales del dispositivo (Validación cruzada: device_uuid + device_token)
    const { data: device, error: deviceError } = await db
      .from('devices')
      .select('id, device_uuid, device_token')
      .eq('device_uuid', deviceUuid)
      .single();

    if (deviceError || !device) {
      const err = new Error('Dispositivo no encontrado o UUID inválido');
      err.statusCode = 404;
      throw err;
    }

    // Verificar que el token del header coincida exactamente con el de la base de datos
    if (device.device_token !== deviceToken) {
      const err = new Error('Inconsistencia en las credenciales del dispositivo (device_token inválido)');
      err.statusCode = 401;
      throw err;
    }

    // 2. Si la validación es correcta, consultamos la tabla custom_blocklists
    const { data: customRules, error: rulesError } = await db
      .from('custom_blocklists')
      .select('domain, activo')
      .eq('device_id', device.id); // o filtrado por device_uuid según tu esquema

    if (rulesError) {
      throw new Error(`Error al obtener las reglas personalizadas: ${rulesError.message}`);
    }

    return {
      deviceUuid,
      customRules: customRules || [],
      syncedAt: new Date().toISOString()
    };
  }
}

module.exports = new SyncService();