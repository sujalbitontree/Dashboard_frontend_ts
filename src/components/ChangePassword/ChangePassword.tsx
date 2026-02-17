'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { AxiosError } from 'axios'
import { useForm } from '@/hooks/useForm'
import './ChangePassword.css'
import { changePasswordInput } from '@/utils/changePasswordValidation'
import { useRouter } from 'next/navigation'
import { ValidationError } from 'yup'

const ChangePassword = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const { formData, setFormData, errors, handleChange, hasErrors } =
    useForm<changePasswordInput>({
      oldPassword: '',
      newPassword: '',
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.post('/change-password', formData)
      toast.success(response.data.message || 'Password updated successfully')

      setFormData({ oldPassword: '', newPassword: '' })
      setIsExpanded(false)
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const status = err.response?.status
        const data = err.response?.data as { message?: string }
        const msg = data?.message || 'Failed to update password'

        if (status === 401) {
          return
        }

        toast.error(msg)
      }
    }
  }

  const isInvalid = hasErrors || !formData.oldPassword || !formData.newPassword

  return (
    <div className="change-password-wrapper">
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Cancel Password Change' : 'Change Password?'}
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="password-form-container">
          <div className="field">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            {errors.oldPassword && (
              <small className="errors">{errors.oldPassword}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && (
              <small className="errors">{errors.newPassword}</small>
            )}
          </div>

          <button
            type="submit"
            className={isInvalid ? 'disable-btn' : 'normal-btn'}
            disabled={isInvalid}
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  )
}

export default ChangePassword
