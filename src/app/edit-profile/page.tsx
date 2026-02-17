'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useForm } from '@/hooks/useForm'

import api from '@/services/api'
import { EditProfileFormData } from '@/types/editProfileSchema'
import { AxiosError } from 'axios'
import './editprofile.css'
import ChangePassword from '@/components/ChangePassword/ChangePassword'

const EditProfile = () => {
  const router = useRouter()

  const { formData, setFormData, errors, handleChange, hasErrors } =
    useForm<EditProfileFormData>({
      id: 0,
      username: '',
      age: '',
    })

  const fetchUser = async () => {
    try {
      const response = await api.get('/dashboard')
      const user = response.data.user

      setFormData({
        id: Number(user.id) || 0,
        username: user.username || '',
        age: user.age || '',
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load user data')
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.post('/edit-profile', formData)
      toast.success(response.data.message)
      router.replace('/dashboard')
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return
        } else {
          const message = err.response?.data?.message || 'Update failed'
          toast.error(message)
        }
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const isInvalid = hasErrors || !formData.username || !formData.age

  return (
    <div className="edit-profile-page">
      <div className="container">
        <form onSubmit={handleUpdateUser}>
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
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              onKeyDown={(e)=>{
                if(['e','E','+','-','.'].includes(e.key)){
                  e.preventDefault()
                }
              }}
            />
            {errors.age && <small className="errors">{errors.age}</small>}
          </div>

          <div className="btn">
            <button
              type="submit"
              className={isInvalid ? 'disable-btn' : 'normal-btn'}
              disabled={isInvalid}
            >
              Save
            </button>
            <button
              type="button"
              className="normal-btn back-btn"
              onClick={() => router.replace('/dashboard')}
            >
              Back
            </button>
          </div>
        </form>

        <ChangePassword />
      </div>
    </div>
  )
}

export default EditProfile
