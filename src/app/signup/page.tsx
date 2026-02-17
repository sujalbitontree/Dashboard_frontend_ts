'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ValidationError } from 'yup'
import { useForm } from '@/hooks/useForm'
import { SignupInput, signupSchema } from '@/utils/signupValidation'
import api from '@/services/api'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'



const SignupPage = () => {

  const { isLoading } = useAuthRedirect()
  
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { formData, setFormData, errors, setErrors, handleChange } =
    useForm<SignupInput>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
    })
   

  const isFormInvalid = useMemo(() => {
    const hasEmptyFields = Object.values(formData).some((val) => val === '')
    const hasActiveErrors = Object.values(errors).some((msg) => !!msg)
    return hasEmptyFields || hasActiveErrors
  }, [formData, errors])

   if (isLoading) {
    return <div className='loading'>Loading...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signupSchema.validate(formData, { abortEarly: false })

      const response = await api.post('/signup', formData)
      toast.success(response.data?.message)
      router.push('/signin')
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const validationErrors: Partial<Record<keyof SignupInput, string>> = {}
        err.inner.forEach((curr) => {
          if (curr.path) {
            validationErrors[curr.path as keyof SignupInput] = curr.message
          }
        })
        setErrors(validationErrors)
      } else if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Signup failed')
      } else {
        toast.error('An unexpected error occurred')
      }
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wrapper">
      <div className="container">
        <div className="head">
          <h2>Create account.</h2>
        </div>

        <form className="inputs" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              
              required
            />
            {errors.username && (
              <small className="errors">{errors.username}</small>
            )}
          </div>

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
            {errors.email && <small className="errors">{errors.email}</small>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              
              required
            />
            {errors.password && (
              <small className="errors">{errors.password}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              
              required
            />
            {errors.confirmPassword && (
              <small className="errors">{errors.confirmPassword}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              onKeyDown={(e)=>{
                if(['e','E','+','-','.'].includes(e.key)){
                  e.preventDefault()
                }
              }}
              value={formData.age}
              onChange={handleChange}
              
              required
            />
            {errors.age && <small className="errors">{errors.age}</small>}
          </div>

          <div className="radio-btn">
            <span>Select your gender:</span>
            <div className="radio">
              {['male', 'female', 'other'].map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={option}
                    name="gender"
                    value={option}
                    onChange={handleChange}
                    checked={formData.gender === option}
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            </div>
            {errors.gender && <small className="errors">{errors.gender}</small>}
          </div>

          <div className="btn">
            <button
              type="submit"
              className={isFormInvalid ? 'disabled-btn' : 'normal-btn'}
              disabled={isFormInvalid || loading}
            >
              {loading ? 'Processing...' : 'Sign up'}
            </button>
          </div>

          <div className="footer">
            <span>Already have an account?</span>{' '}
            <Link className="link" href="/signin">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
