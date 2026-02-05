"use client"
import React,{useState} from "react"
import { SigninInput,signinSchema } from "@/utils/signinValidation"
import { useRouter } from 'next/navigation'; 
import { validateField } from "@/utils/fieldValidation";
import { toast } from "react-toastify";
import Link from 'next/link';
import api from "@/services/api";


const SigninPage = ()=>{

    
    const [formData,setFormData] = useState<SigninInput>({
       
        email: '',
        password: '',
        })


     const [error, setError] = useState<Partial<Record<keyof SigninInput, string>>>({});
      const [loading, setLoading] = useState(false);
      const router = useRouter();

    const handleFieldValidation = async (name: keyof SigninInput, value: string) => {
    const errorMsg = await validateField(name, value, formData);
    setError((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SigninInput;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    if (error[fieldName]) {
      handleFieldValidation(fieldName, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFieldValidation(name as keyof SigninInput, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signinSchema.validate(formData, { abortEarly: false });

      const response = await api.post('/signin', formData);

      const accessToken =  response.data.data.accessToken;
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }

      toast.success(response.data.message || "Logged in successfully!");
      
      setError({});
      router.push('/dashboard');

    } catch (err: any) {
      console.error("Signin Error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials");
      setFormData({
        email :'',
        password :''
      });
    } finally {
      setLoading(false);
    }
  };


  const isFormInvalid = !formData.email || !formData.password

  return (
    <div className="wrapper sign-in">
      <div className="container">
        <div className="head">
          <h2>Sign in to your account.</h2>
        </div>

        <form className="inputs" onSubmit={handleSubmit}>
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

          <div className="btn">
            <button
              type="submit"
              className={isFormInvalid ? 'disabled-btn' : 'normal-btn'}
              disabled={isFormInvalid || loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="links">
            <div>
              <Link className="link" href="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <div>
              Create Account?{' '}
              <Link className="link" href="/">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
