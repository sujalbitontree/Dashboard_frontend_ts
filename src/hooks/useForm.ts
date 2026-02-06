import { useState, useCallback } from 'react';
import { validateField } from '@/utils/fieldValidation';

export function useForm<T extends object>(initialValues: T) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleFieldValidation = useCallback(async (name: keyof T, value: any, currentData: T) => {
    const errorMsg = await validateField(name as string, value, currentData);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
    return errorMsg;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof T;

    const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;

    setFormData((prev) => {
      const newData = { ...prev, [fieldName]: finalValue };
      
      if (errors[fieldName]) {
        handleFieldValidation(fieldName, finalValue, newData);
      }
      return newData;
    });
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof T;
    const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;

    await handleFieldValidation(fieldName, finalValue, formData);
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleBlur,
    hasErrors: Object.values(errors).some((msg) => !!msg),
  };
}