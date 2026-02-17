'use client'

import React, { FormEvent } from 'react'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useForm } from '@/hooks/useForm' 
import api from '@/services/api'
import { EmailInput } from '@/utils/forgotPasswordValidation'



const ForgotPassword = () => {
  const { 
    formData, 
    errors, 
    handleChange, 
    setFormData, 
    setErrors,
    hasErrors 
  } = useForm<EmailInput>({
    email: ''
  })

  const [loading, setLoading] = React.useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/forgot-password', { email: formData.email })
      toast.success(response.data.message)
      setFormData({ email: '' })
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
      setErrors({})
    }
  }

  const isInvalid = !formData.email.trim() || hasErrors || loading

  return (
    <div className="wrapper">
      <div className="container">
        <div className="head">
          <h2>Forgot Password</h2>
        </div>

        <form className="inputs" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <small className="errors">{errors.email || ""}</small>
          </div>

          <div className="btn">
            <button
              type="submit"
              disabled={isInvalid}
              className={isInvalid ? 'disabled-btn' : 'normal-btn'}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>

          <div className="footer">
            <Link className="link" href="/signin">
              Back to Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword