import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z]+$/, 'Username can only contain letters')
    .required('Username is required'),

  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format',
    )
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(14, 'Password must be at most 14 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Must contain one uppercase, one lowercase, one number and one special case character',
    )
    .required('Password is required'),

  confirmPassword: Yup.string()
    .trim()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  age: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value,
    )
    .typeError('Age must be a number')
    .min(5, 'Must be at least 5 years old')
    .max(80, 'Must be at most 80 years old') 
    .required('Age is required'),

  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender') 
    .required('Please select a gender'),
});


export type SignupInput = Yup.InferType<typeof signupSchema>;