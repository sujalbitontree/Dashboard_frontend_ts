import * as Yup from 'yup'
import {
  ageValidation,
  emailValidation,
  genderValidation,
  passwordValidation,
  usernameValidation,
} from './schema'

export const signupSchema = Yup.object().shape({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  age: ageValidation,
  gender: genderValidation,
})

export type SignupInput = {
  [K in keyof Yup.InferType<typeof signupSchema>]:
    | Yup.InferType<typeof signupSchema>[K]
    | ''
}
