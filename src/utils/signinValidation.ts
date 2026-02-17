import * as Yup from 'yup'
import { emailValidation, passwordValidation } from './schema'

export const signinSchema = Yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
})

export type SigninInput = Yup.InferType<typeof signinSchema>
