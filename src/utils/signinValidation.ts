import * as Yup from 'yup';

export const signinSchema = Yup.object().shape({
  

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

 
});


export type SigninInput = Yup.InferType<typeof signinSchema>;