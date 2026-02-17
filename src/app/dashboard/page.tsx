"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import './dashboard.css'
import ProductPage from '@/components/Products/Products';
import { AxiosError } from 'axios';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
interface User {
  id?: number | string;
  username?: string;
  age? : number
}

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const {isLoading} = useAuthRedirect()

  const fetchUser = async () => {
    try {
      const response = await api.get('/dashboard');
      setUser(response.data.user);
    } catch (error : unknown) {
      if(error instanceof AxiosError && error.response?.status===401)
      return
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('accessToken');
      router.push('/signin'); 
    }
  };

  if(isLoading){
    return null
  }
  

  return (
    <div >
      <header className='dashboardHeader'>
        <h2 className='title'>Dashboard</h2>
        <nav className="navbar">
          <Link href="/edit-profile" className="profile">
            Edit Profile
          </Link>
          <button className="logoutLink" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main>
       <ProductPage/>
      </main>
    </div>
  );
};

export default DashboardPage;