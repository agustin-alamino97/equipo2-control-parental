const { z } = require('zod');

const consumeCodeSchema = z.object({
  code: z.string().length(6, 'El código debe tener exactamente 6 dígitos'),
  alias_name: z.string().min(2, 'El alias del menor es requerido'),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  device_uuid: z.string().min(1, 'El identificador del dispositivo es requerido'),
  os_model: z.string().min(1, 'El modelo u SO es requerido'),
  push_token: z.string().optional()
});

module.exports = {
  consumeCodeSchema
};