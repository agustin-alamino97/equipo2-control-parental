const syncService = require('../services/sync.services');

class SyncController {
  async getSystemSync(req, res) {
    try {
      // Extraemos versión y checksum opcionales enviados por la app cliente en los query params
      const clientVersion = req.query.version ? parseInt(req.query.version, 10) : null;
      const clientChecksum = req.query.checksum || null;

      const result = await syncService.getSystemRules({ clientVersion, clientChecksum });

      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error en sync system controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error interno al sincronizar reglas del sistema'
      });
    }
  }

  /**
   * GET /api/v1/sync/custom/user
   * Obtiene la lista actual de reglas personalizadas activas para el tutor.
   */
  async getCustomRulesForUser(req, res, next) {
    try {
      // El middleware authenticateToken inyecta el usuario decodificado en req.user
      const userId = req.user.id; 

      const result = await syncService.getCustomRulesForUser({ userId });

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/sync/custom/user
   * Agrega o reactiva una regla personalizada del tutor y dispara el Silent Push.
   */
  async addCustomRuleForUser(req, res, next) {
    try {
      const userId = req.user.id;
      const { domain, rule_type } = req.body;

      const result = await syncService.addCustomRuleForUser({
        userId,
        domain,
        ruleType: rule_type
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/sync/custom/device
   * Sincronización de reglas personalizadas para el dispositivo protegido (Doble verificación + 7 días).
   */
  async getCustomRulesForDevice(req, res, next) {
    try {
      // El middleware deviceAuthMiddleware inyecta los datos validados del dispositivo (ej. req.device)
      // O los lee directamente de los headers/query si el middleware los procesó así:
      const userId = req.device.id_user; 
      const { client_timestamp, client_checksum } = req.query;

      const result = await syncService.getCustomRulesForDevice({
        userId,
        clientTimestamp: client_timestamp,
        clientChecksum: client_checksum
      });

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      // AQUÍ: Respondemos al cliente con el código de error correspondiente (ej. 401)
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SyncController();