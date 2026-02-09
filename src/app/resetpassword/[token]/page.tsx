'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ValidationError } from 'yup'
import { useForm } from '@/hooks/useForm'
import { signupSchema } from '@/utils/signupValidation'
import api from '@/services/api'

type ResetPasswordInput = Pick<
  import('@/utils/signupValidation').SignupInput,
  'password' | 'confirmPassword'
>

const ResetPasswordPage = () => {
  const router = useRouter()
  const params = useParams()
  const token = params?.token as string

  const [loading, setLoading] = useState(false)

  const { formData, setFormData, errors, setErrors, handleChange, handleBlur } =
    useForm<ResetPasswordInput>({
      password: '',
      confirmPassword: '',
    })

  const isInvalid = useMemo(() => {
    const hasEmptyFields = !formData.password || !formData.confirmPassword
    const hasErrors = Object.values(errors).some((msg) => !!msg)
    const mismatch = formData.password !== formData.confirmPassword

    return hasEmptyFields || hasErrors || mismatch || loading
  }, [formData, errors, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signupSchema.validateAt('password', formData)
      await signupSchema.validateAt('confirmPassword', formData)

      const response = await api.post(`/reset-password/${token}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      toast.success(response.data?.message || 'Password updated successfully!')
      router.push('/signin')
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setErrors((prev) => ({ ...prev, [err.path as string]: err.message }))
      } else if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to reset password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wrapper">
      <div className="container">
        <div className="head">
          <h2>Reset Your Password</h2>
        </div>

        <form className="inputs" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && (
              <small className="errors">{errors.password}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && (
              <small className="errors">{errors.confirmPassword}</small>
            )}
          </div>

          <div className="btn">
            <button
              type="submit"
              disabled={isInvalid}
              className={isInvalid ? 'disabled-btn' : 'normal-btn'}
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
