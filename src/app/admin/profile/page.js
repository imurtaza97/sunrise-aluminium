'use client'
import React, { useState, useEffect } from 'react';
import AdminLayout from '../dashboardLayout'
import { useUser } from '@/context/UserContext';
import Alert from '../../components/Alert';
import Image from 'next/image';

const Profile = () => {
  const userData = useUser();

  const [editPasswordFormData, setEditPasswordFormData] = useState({
    editPassword: '',
    editConfirmPassword: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setAlert({ type: 'danger', message: 'Only PNG, JPG, or JPEG images are allowed.' });
        setSelectedImage(null);
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width > 800 || img.height > 400) {
          setAlert({ type: 'danger', message: 'Image dimensions should not exceed 800x400px.' });
          setSelectedImage(null);
        } else {
          setSelectedImage(file);
        }
      };
    }
  };

  const updateProfileImage = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setAlert({ type: 'danger', message: 'Please select a valid image.' });
      return;
    }

    const data = new FormData();
    data.set('ProfileImage', selectedImage);

    try {
      const response = await fetch('/api/updateProfileImage', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({ type: 'success', message: 'Profile image updated successfully.' });
      } else {
        setAlert({ type: 'danger', message: result.message || 'Failed to update profile image.' });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'An error occurred while updating the profile image.' });
    }
  };

  useEffect(() => {
    if (userData && userData.user) {
      setFormData({
        name: userData.user.name,
        email: userData.user.email,
      });
      // Set existing image URL from user data
      setExistingImage(userData.user.image); // Adjust this to match the actual field from your user data
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email } = formData;

    if (!name || !email) {
      setAlert({ type: 'danger', message: 'Please enter credentials.' });
    }
    try {
      const response = await fetch(`/api/updateDetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
        })
      });
      const data = await response.json();

      if (response.ok) {
        setAlert({ type: 'success', message: 'Details updated successfully.' });
      } else {
        setAlert({ type: 'danger', message: data.error || 'Failed to update admin.' });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'An error occurred while updating admin details.' });
    }
  }

  const handlePasswordEdit = async (e) => {
    e.preventDefault();

    const { editPassword, editConfirmPassword } = editPasswordFormData;

    if (editPassword !== editConfirmPassword) {
      setAlert({ type: 'danger', message: 'Passwords do not match.' });
      return;
    }

    try {
      const response = await fetch('/api/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: editPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({ type: 'success', message: result.message });
      } else {
        setAlert({ type: 'danger', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'An error occurred while updating admin details.' });
    }
  };
  const handleCloseAlert = () => {
    setAlert(null);
  };
  return (
    <AdminLayout>
      {alert && <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />}
      <nav className="flex justify-between h-fit" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="#" className="inline-flex items-center text-sm font-medium hover:text-gray-700">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" /></svg>
              Dashboard
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                Profile
              </span>
            </div>
          </li>
        </ol>

      </nav>
      <div className='flex flex-col md:flex-row w-full h-fit'>
        {/* Profile Picture */}
        <div className="flex-1 lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg border border-gray-200 my-2 md:m-5">
          <p className='text-xl'>Profile Picture</p>
          <hr />
          <form className="mt-8 space-y-6" onSubmit={updateProfileImage}>
            <div className='w-full flex justify-center'>
              {selectedImage ? (
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : existingImage ? (
                <Image
                  src={existingImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                  {userData?.user?.name?.charAt(0) || 'A'}
                </span>
              )}
            </div>
            <div className="w-full px-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
                Upload file
              </label>
              <input className="hidden" id="file_input" type="file" onChange={handleImageChange} aria-describedby="file_input_help" />
              <label htmlFor="file_input" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none">
                <span className="block py-2 text-center">Choose File</span>
              </label>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                SVG, PNG, JPG or GIF (MAX. 800x400px).
              </p>
            </div>
            <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 sm:w-auto">Change</button>
          </form>
        </div>

        {/*   Personal Info */}
        <div className="flex-1 lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg border border-gray-200 my-2 md:m-5">
          <p className='text-xl'>Personal details</p>
          <hr />
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
              <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" placeholder="JohenDoe999@gmail.com" value={formData.email} onChange={handleChange} required />
            </div>
            <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 sm:w-auto">Submit</button>
          </form>
        </div>

        {/* Password Update */}
        <div className="flex-1 lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg border border-gray-200 my-2 md:m-5">
          <p className='text-xl'>Update Password</p>
          <hr />
          <form className="mt-8 space-y-6" onSubmit={handlePasswordEdit}>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;" value={editPasswordFormData.editPassword} onChange={(e) => setEditPasswordFormData({ ...editPasswordFormData, editPassword: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
              <input type="password" name="confirm-password" id="confirm-password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;" value={editPasswordFormData.editConfirmPassword} onChange={(e) => setEditPasswordFormData({ ...editPasswordFormData, editConfirmPassword: e.target.value })} required />
            </div>
            <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 sm:w-auto">Update</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Profile
