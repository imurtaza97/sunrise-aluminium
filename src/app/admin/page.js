'use client'
import React, { useState } from 'react';
import { Roboto } from 'next/font/google';
import Alert from '../components/Alert';

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/admin/dashboard'; // Redirect to dashboard or any other page
      } else {
        setAlert({ type: 'danger', message: data.error || 'Something went wrong!' });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'An unexpected error occurred!' });
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };
  return (
    <section className={`${roboto.className} flex items-center bg-gray-200 h-screen`}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />}
      <div className="flex justify-center py-8 px-4 mx-auto w-full max-w-96">
        <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl text-center font-bold text-gray-900">
            Admin Login
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">AdminId</label>
              <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 sm:w-auto">Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
