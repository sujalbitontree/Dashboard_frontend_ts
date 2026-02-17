import * as Yup from 'yup'

export const usernameValidation = Yup.string()
  .required('Username is required')
  .matches(/^[a-zA-Z]+$/, 'Username can only contain letters')
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')

export const emailValidation = Yup.string()
  .required('Email is required')
  .matches(/@/, 'Email must contain an "@" symbol')
  .matches(/\.[a-zA-Z]{2,}$/, 'Email must have a valid domain (e.g. .com)')
  .email('Invalid email format')

export const passwordValidation = Yup.string()
  .required('Password is required')
  .matches(/^\S*$/, 'Password cannot contain spaces')
  .matches(/[a-z]/, 'Password needs at least one lowercase letter')
  .matches(/[A-Z]/, 'Password needs at least one uppercase letter')
  .matches(/[0-9]/, 'Password needs at least one number')
  .matches(
    /[!@#$%^&*]/,
    'Password needs at least one special character (!@#$%^&*)'
  )
  .min(8, 'Password must be at least 8 characters')
  .max(14, 'Password must be at most 14 characters')



export const ageValidation = Yup.number()
  .transform((value, originalValue) =>
    originalValue === '' ? undefined : value
  )
  .typeError('Age must be a number')
  .required('Age is required')
  .min(5, 'Must be at least 5 years old')
  .max(80, 'Must be at most 80 years old')

export const genderValidation = Yup.string()
  .oneOf(['male', 'female', 'other'] as const, 'Please select a valid gender')
  .required('Please select a gender')
