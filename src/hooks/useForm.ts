import { useState, useCallback, useRef, useEffect } from 'react'
import { validateField } from '@/utils/fieldValidation'

export function useForm<T extends object>(initialValues: T) {
  const [formData, setFormData] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const touchedFields = useRef<Partial<Record<keyof T, boolean>>>({})

  const handleFieldValidation = useCallback(
    async (name: keyof T, value: string, currentData: T) => {
      const errorMsg = await validateField(name as string, value, currentData as [])
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }))
      return errorMsg
    },
    []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof T

    touchedFields.current[fieldName] = true


    setFormData((prev) => {
      const newData = { ...prev, [fieldName]: value }

      return newData
    })
  }



  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Object.keys(touchedFields.current).forEach((key) => {
        const fieldName = key as keyof T
        handleFieldValidation(fieldName, formData[fieldName] as string, formData)
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData, handleFieldValidation])

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    hasErrors: Object.values(errors).some((msg) => !!msg),
  }
}
