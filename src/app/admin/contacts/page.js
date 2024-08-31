'use client'
import React, { useEffect, useState } from 'react'
import AdminLayout from '../dashboardLayout'
import Alert from '../../components/Alert';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [openMessageId, setOpenMessageId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contact');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        throw new Error('Failed to fetch contacts.');
      }
    };

    fetchContacts();
  }, []);

  const handleMessageEdit = (event, id) => {
    event.stopPropagation();
    setOpenMessageId((prevId) => (prevId === id ? null : id)); // Toggle openMessageId
  };

  const handleClickOutsideMessageEdit = (event) => {
    if (!event.target.closest('.dropdown-content') && !event.target.closest('.dropdown-button')) {
      setOpenMessageId(null); // Close the dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMessageEdit);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMessageEdit);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours > 24) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return date.toLocaleString('en-GB', options).replace(',', '');
    } else {
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return date.toLocaleTimeString([], options);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`/api/contact/deleteContact/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setContacts((prevContacts) => prevContacts.filter(contact => contact._id !== id));
        setAlert({ type: 'success', message: 'Message Deleted successfully!' });
      } else {
        setError('Error deleting message: ' + result.message);
        setAlert({ type: 'danger', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'An unexpected error occurred!' });
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };
  return (
    <AdminLayout>
      {alert && <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />}
      <nav className="flex h-fit" aria-label="Breadcrumb">
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
                Contacts
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <div className='flex flex-col md:flex-row w-full h-navbarMinus md:px-5 py-2 overflow-hidden'>
        <div className='flex flex-col w-full h-full rounded-md bg-gray-100 p-2 md:p-5 overflow-y-auto'>

          {contacts.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-lg text-gray-500">No messages</span>
            </div>
          ) : (
            contacts.map(contact => (
              <div key={contact._id} className="flex items-start gap-2.5 m-2 md:m-5">
                <span className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-lg">
                  {contact.name.charAt(0)}
                </span>
                <div className="flex flex-col w-fit max-w-[550px] leading-1.5 rounded-e-xl p-2 md:p-4  rounded-es-xl bg-gray-700">
                  <div className="flex items-center text-start space-x-2 rtl:space-x-reverse">
                    <div className='flex flex-col'>
                      <span className="text-sm font-medium text-white">{contact.name}</span>
                      <span className="text-sm font-medium text-gray-500">{contact.email}</span>
                    </div>
                  </div>
                  <p className="text-sm font-normal py-2.5 text-white">{contact.message}</p>
                  <span className="text-xs text-end font-normal text-gray-400">
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
                <div className='flex flex-col my-2'>
                  <button
                    onClick={(event) => handleMessageEdit(event, contact._id)}
                    className='hover:text-gray-500 dropdown-button'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                  </button>
                  <div className={`${openMessageId === contact._id ? '' : 'hidden'} absolute md:relative w-28 bg-white z-20 rounded-md shadow-sm m-2 dropdown-content`} >
                    <nav className='w-full text-center text-sm'>
                      <ul>
                        <li className='p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer'>
                          <button onClick={() => handleDeleteMessage(contact._id)}>Delete</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Contacts;
