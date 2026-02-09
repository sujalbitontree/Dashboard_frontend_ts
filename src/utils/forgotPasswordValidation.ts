import * as Yup from 'yup'

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .required('Email is required'),
})

export type EmailInput = Yup.InferType<typeof forgotPasswordSchema>;
