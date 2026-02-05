"use client"
import { SignupInput, signupSchema } from "@/utils/signupValidation"
import React,{ useState } from "react"
import { useRouter } from 'next/navigation'; 
import { validateField } from "@/utils/fieldValidation";
import { toast } from "react-toastify";
import Link from 'next/link';
import api from "@/services/api";


const SignupPage = () => {
    const [formData,setFormData] = useState<SignupInput>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '' as any , 
    gender: '',
    })

    const [error, setError] = useState<Partial<Record<keyof SignupInput, string>>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFieldValidation = async (name:keyof SignupInput,value :any)=>{
    const errorMsg = await validateField(name,value,formData)

    setError((prev) => ({
    ...prev,
    [name]: errorMsg,
  }));
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type } = e.target;
  const fieldName = name as keyof SignupInput;
  

  setFormData(prev => ({ ...prev, [fieldName]: value }));

  if (error[fieldName]) {
    handleFieldValidation(fieldName, value);
  }
};

const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  const { name, value, type } = e.target;
  const fieldName = name as keyof SignupInput;
  

  const errorMessage = await validateField(fieldName, value, formData);

  setError((prev) => ({
    ...prev,
    [fieldName]: errorMessage,
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await signupSchema.validate(formData, { abortEarly: false });
    const response = await api.post('/signup', formData);
    toast.success(response.data.message || "Welcome aboard!");
    router.push('/signin');

  } catch (err: any) {
      const apiMessage = err.response?.data?.message || "Something went wrong";
      setError(err.response?.data?.message || "Something went wrong")
      toast.error(apiMessage);
  } finally {
    setLoading(false);
    
  }
};
const isFormInvalid = !signupSchema.isValidSync(formData);
  return (
    <div className={`wrapper`}>
      <div className="container">
        <div className="head">
          
          <h2>Create account.</h2>
        </div>

        <form className="inputs" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {error.username && <small className="errors">{error.username}</small>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {error.email && <small className="errors">{error.email}</small>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {error.password && <small className="errors">{error.password}</small>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {error.confirmPassword && <small className="errors">{error.confirmPassword}</small>}
          </div>

          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {error.age && <small className="errors">{error.age}</small>}
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
            {error.gender && <small className="errors">{error.gender}</small>}
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
            <Link className="link" href="/signin">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
