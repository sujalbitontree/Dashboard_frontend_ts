import * as Yup from 'yup'
import { passwordValidation } from './schema'

export const changePasswordSchema = Yup.object().shape({
  oldPassword: passwordValidation,

  newPassword: passwordValidation.notOneOf(
    [Yup.ref('oldPassword')],
    'New password must be different from the old one'
  ),
})

export type changePasswordInput = Yup.InferType<typeof changePasswordSchema>
