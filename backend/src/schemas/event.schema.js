const { z } = require('zod');

const EVENT_TYPES = [
  'domain',
  'keyword',
  'regex',
  'uninstall_attempt',
  'app_install_attempt',
  'os_permission_change',
  'score_exceeded',
  'custom'
];

const singleEventSchema = z.object({
  device_uuid: z.string().min(1, "El device_uuid es obligatorio"),
  event_type: z.enum(EVENT_TYPES),
  value: z.string().min(1, "El valor es obligatorio"),
  event_time: z.string().optional() // Acepta el string ISO enviado por el cliente
});

const reportEventSchema = z.union([
  singleEventSchema,
  z.array(singleEventSchema)
]);

module.exports = {
  reportEventSchema,
  EVENT_TYPES
};