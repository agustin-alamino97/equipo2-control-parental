const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  surname: z.string().optional(),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  gender: z.string().optional(),
  birth_date: z.string().optional() // Formato YYYY-MM-DD
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

module.exports = {
  registerSchema,
  loginSchema
};