'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ValidationError } from 'yup'
import Link from 'next/link' 
import { forgotPasswordSchema } from '@/utils/forgotPasswordValidation'
import api from '@/services/api'



const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEmail(newValue)

    try {
      await forgotPasswordSchema.validateAt('email', { email: newValue })
      setError('')
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message)
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await api.post('/forgot-password', { email })
      toast.success(response.data.message)
      setError('')
      setEmail('') 
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Something went wrong'
        setError(errorMessage)
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
      
    }
  }

  const isInvalid = !email.trim() || !!error || loading

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
              value={email}
              onChange={handleChange}
              required
            />
            <small className="errors">{error || ""}</small>
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