import { ValidationError } from 'yup';
import { SignupInput, signupSchema } from './signupValidation';
import { changePasswordSchema } from './changePasswordValidation'; 

export const validateField = async (
  name: string, 
  value: string,
  allFormData: []
) => {
  try {
    const dataToValidate = { ...allFormData, [name]: value };

    if (name === 'oldPassword' || name === 'newPassword') {
      await changePasswordSchema.validateAt(name, dataToValidate);
    } 
    else {
      await signupSchema.validateAt(name as keyof SignupInput, dataToValidate);
    }

    return '';
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return error.message;
    }
    console.error("Validation error details:", error);
    return 'An unexpected error occurred';
  }
};