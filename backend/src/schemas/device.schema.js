const { z } = require('zod');

const linkDeviceSchema = z.object({
  alias_name: z.string().min(2, 'El alias o nombre del menor debe tener al menos 2 caracteres'),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  device_uuid: z.string().min(1, 'El identificador único del dispositivo es requerido'),
  os_model: z.string().min(1, 'El modelo/SO del dispositivo es requerido'),
  push_token: z.string().optional()
});

module.exports = {
  linkDeviceSchema
};