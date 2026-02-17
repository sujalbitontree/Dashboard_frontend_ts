import * as Yup from 'yup'
import { emailValidation } from './schema';

export const forgotPasswordSchema = Yup.object().shape({
  email: emailValidation,
})

export type EmailInput = Yup.InferType<typeof forgotPasswordSchema>;
