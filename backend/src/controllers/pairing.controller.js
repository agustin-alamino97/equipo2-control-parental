const pairingService = require('../services/pairing.services');
const { consumeCodeSchema } = require('../schemas/pairing.schema');

// ============================================================================
// CONTROLADOR DE EMPAREJAMIENTO MEDIANTE CÓDIGO (PAIRING)
// ============================================================================

/**
 * Solicitado por el tutor para generar un PIN de 6 dígitos con expiración.
 * @route POST /api/pairing/generate
 */
const generateCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pairingService.generatePairingCode(userId);

    return res.status(201).json({
      message: 'Código de vinculación generado con éxito',
      code: result.code,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error('Error al generar código:', error);
    return res.status(500).json({ error: 'Error interno al generar código' });
  }
};

/**
 * Enviado desde el dispositivo del menor para validar el PIN y vincular el equipo.
 * @route POST /api/pairing/consume
 */
const consumeCode = async (req, res) => {
  try {
    const validatedData = consumeCodeSchema.parse(req.body);
    const {device, deviceToken} = await pairingService.consumePairingCode(validatedData);

    return res.status(200).json({
      message: 'Dispositivo vinculado con éxito',
      device,
      deviceToken
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Error de validación en el payload', 
        details: error.issues?.[0]?.message || error.errors 
      });
    }
    if (error.message === 'INVALID_OR_EXPIRED_CODE') {
      return res.status(400).json({ error: 'El código ingresado es inválido o ha expirado' });
    }
    console.error('Error al consumir código de vinculación:', error);
    return res.status(500).json({ error: 'Error interno al procesar el código' });
  }
};

module.exports = {
  generateCode,
  consumeCode
};