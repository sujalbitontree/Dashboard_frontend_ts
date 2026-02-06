'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ValidationError } from 'yup'

import { useForm } from '@/hooks/useForm'
import { SigninInput, signinSchema } from '@/utils/signinValidation'
import api from '@/services/api'
import Link from 'next/link'


const SigninPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { 
    formData, 
    setFormData, 
    errors, 
    setErrors, 
    handleChange, 
    handleBlur, 
    isFormValid 
  } = useForm<SigninInput>({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signinSchema.validate(formData, { abortEarly: false });
      const response = await api.post('/signin', formData);
      
      if (response.data?.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }

      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const yupErrors: any = {};
        err.inner.forEach(e => { if(e.path) yupErrors[e.path] = e.message });
        setErrors(yupErrors);
      } else if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Login failed');
        setFormData({email :'',password :''});
      }
    } finally {
      setLoading(false);
    }
  };
 const hasNoErrors = !Object.values(errors).some(msg => msg !== '' && msg !== undefined);

const isBtnDisabled = !formData.email || !formData.password || !hasNoErrors || loading;
  return (
    <div className="wrapper">
      <div className="container"> 
        <div className="head">
          <h2>Sign in to your account.</h2>
        </div>

        <form className="inputs" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              
            />
            {errors.email && <small className="errors">{errors.email}</small>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              
            />
            {errors.password && <small className="errors">{errors.password}</small>}
          </div>

          <div className="btn">
            <button type="submit" disabled={isBtnDisabled}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>

          <div className="footer">
            <span>Don't have an account?</span>{' '}
            <Link className="link" href="/">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninPage