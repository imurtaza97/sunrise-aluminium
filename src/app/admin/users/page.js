'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '../dashboardLayout';
import Link from 'next/link';
import Alert from '../../components/Alert';

const Users = () => {
    const [isAddAdmin, setIsAddAdmin] = useState(false);
    const [isEditAdmin, setIsEditAdmin] = useState(false);
    const [editingAdminId, setEditingAdminId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ipAddress: '',
        password: '',
        confirmPassword: ''
    });
    const [editFormData, setEditFormData] = useState({
        editName: '',
        editEmail: '',
        editIpAddress: '',
        editPassword: '',
        editConfirmPassword: ''
    });
    const [admins, setAdmins] = useState([]);
    const [page, setPage] = useState(1);  // Track the current page
    const [totalPages, setTotalPages] = useState(1); // Track the total number of pages
    const limit = 10; // Define the number of items per page
    const [alert, setAlert] = useState(null);

    const handleCloseAlert = () => {
        setAlert(null);
    };

    useEffect(() => {
        const fetchAdminList = async () => {
            try {
                const response = await fetch(`/api/admin/getAdminsList?page=${page}&limit=${limit}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAdmins(data.admins);
                    setTotalPages(data.totalPages); // Set the total pages from the response
                } else {
                    const errorData = await response.json();
                    setAlert({ type: 'danger', message: errorData.error || 'Failed to fetch admin details' });
                }
            } catch (error) {
                setAlert({ type: 'danger', message: 'An error occurred while fetching admin details.' });
            }
        };
        fetchAdminList();
    }, [page]); // Re-fetch the list whenever the page changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, ipAddress, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setAlert({ type: 'danger', message: 'Passwords do not match.' });
            return;
        }

        try {
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, email, ipAddress, password })
            });

            const data = await response.json();

            if (response.ok) {
                setFormData({
                    name: '',
                    email: '',
                    ipAddress: '',
                    password: '',
                    confirmPassword: ''
                });
                setIsAddAdmin(false);
                setAlert({ type: 'success', message: 'New Admin Registered Successfully' });
                setPage(1);
            } else {
                setIsAddAdmin(false);
                setAlert({ type: 'danger', message: data.error || 'Something went wrong.' });
            }
        } catch (error) {
            setIsAddAdmin(false);
            setAlert({ type: 'danger', message: 'An error occurred. Please try again later.' });
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/admin/deleteAdmin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAdmins(admins.filter((admin) => admin._id !== id));
                setAlert({ type: 'success', message: 'Admin deleted successfully.' });
            } else {
                setAlert({ type: 'danger', message: data.error || 'Error deleting admin' });
            }
        } catch (error) {
            setAlert({ type: 'danger', message: 'Error deleting admin' });
        }
    };

    const handleEdit = (id) => {
        const adminToEdit = admins.find((admin) => admin._id === id);
        if (adminToEdit) {
            setEditFormData({
                editName: adminToEdit.name,
                editEmail: adminToEdit.email,
                editIpAddress: adminToEdit.ipAddress,
                editPassword: '',
                editConfirmPassword: ''
            });
            setEditingAdminId(id);
            setIsEditAdmin(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const { editName, editEmail, editIpAddress, editPassword, editConfirmPassword } = editFormData;

        if (editPassword !== editConfirmPassword) {
            setAlert({ type: 'danger', message: 'Passwords do not match.' });
            return;
        }

        try {
            const response = await fetch(`/api/admin/editAdmin/${editingAdminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: editName,
                    email: editEmail,
                    ipAddress: editIpAddress,
                    password: editPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({ type: 'success', message: 'Admin updated successfully.' });
                setAdmins(admins.map(admin =>
                    admin._id === editingAdminId
                        ? { ...admin, name: editName, email: editEmail, ipAddress: editIpAddress }
                        : admin
                ));
                setIsEditAdmin(false);
            } else {
                setAlert({ type: 'danger', message: data.error || 'Failed to update admin.' });
            }
        } catch (error) {
            setAlert({ type: 'danger', message: 'An error occurred while updating admin details.' });
        }
    };

    return (
        <AdminLayout>
            {alert && <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />}
            {/* Breadcrumb */}
            <nav className="flex justify-between h-fit" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <a href="#" className="inline-flex items-center text-sm font-medium hover:text-gray-700">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Dashboard
                        </a>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                                Users
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Admin List */}
            <div className='w-full h-full pe-3 py-3'>
                <div className='flex flex-col w-full h-full p-4 border border-gray-200 rounded-md'>
                    <div className='flex justify-between w-full'>
                        <p className='text-xl'>Admin List</p>
                        <button className='h-fit bg-gray-900 hover:bg-slate-700 p-2 text-white rounded-lg' onClick={() => setIsAddAdmin(true)}>+ Add Admin</button>
                    </div>
                    <hr className='my-3' />
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Admin</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">IP Address</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin._id} className="bg-whiteborder-b border-b hover:bg-gray-50">
                                        <td className="flex items-center px-6 py-2 font-medium">
                                            {!admin.image ? (<span className="w-10 h-10 me-4 font-extralight rounded-md bg-gray-700 text-gray-100 flex items-center justify-center text-sm">
                                                {admin.name.charAt(0) || 'A'}
                                            </span>) : (
                                                <img src={admin.image} alt="Profile" className="w-10 h-10 rounded-md me-4 object-cover" />
                                            )}
                                            {admin.name}
                                        </td>
                                        <td className="px-6 py-4">{admin.email}</td>
                                        <td className="px-6 capitalize py-4">{admin.ipAddress}</td>
                                        <td className="px-6 capitalize py-4">{admin.role}</td>
                                        <td className="flex justify-center px-6 py-4">
                                            <button onClick={() => handleEdit(admin._id)} className='mx-4 text-blue-500'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"> <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .828-.501l13.348-13.347Z"></path> <path d="M16 7l3 3"></path> </svg>
                                            </button>
                                            <button onClick={() => handleDelete(admin._id)} className="text-red-600 hover:text-red-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end items-end p-2">
                        <nav aria-label="Page navigation example">
                            <ul className="inline-flex -space-x-px text-sm">
                                <li>
                                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 border border-e-0 border-gray-300 rounded-s-lg ${page === 1 ? 'text-gray-200 cursor-not-allowed border-gray-100' : 'hover:bg-gray-100'}`}>Previous</button>
                                </li>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                    <li key={pageNumber}>
                                        <button
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${page === pageNumber ? 'bg-gray-100' : 'bg-white hover:bg-gray-100 hover:text-gray-700'}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} href="#" className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 rounded-e-lg ${page === totalPages ? 'text-gray-200 cursor-not-allowed border-gray-100' : 'hover:bg-gray-100'}`}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Add Admin Form */}
            {isAddAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg w-1/2">
                        <h2 className="text-2xl mb-4">Add Admin</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" required />
                                </div>
                                <div>
                                    <label className="block mb-2">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" required />
                                </div>
                                <div>
                                    <label className="block mb-2">IP Address</label>
                                    <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" />
                                </div>
                                <div>
                                    <label className="block mb-2">Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" required />
                                </div>
                                <div>
                                    <label className="block mb-2">Confirm Password</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" required />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <div>
                                    <button type="button" onClick={() => setIsAddAdmin(false)} className="mr-4 py-2 px-4 text-red-500 rounded-lg">
                                        Cancel
                                    </button>
                                    <button type="submit" className="py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700">
                                        Add Admin
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Admin Form */}

            {isEditAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg w-1/2">
                        <h2 className="text-2xl mb-4">Edit Admin</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Name</label>
                                    <input type="text" name="editName" value={editFormData.editName} onChange={handleEditInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" required />
                                </div>
                                <div>
                                    <label className="block mb-2">Email</label>
                                    <input type="email" name="editEmail" value={editFormData.editEmail} onChange={handleEditInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" required />
                                </div>
                                <div>
                                    <label className="block mb-2">IP Address</label>
                                    <input type="text" name="editIpAddress" value={editFormData.editIpAddress} onChange={handleEditInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" />
                                </div>
                                <div>
                                    <label className="block mb-2"> New Password</label>
                                    <input type="password" name="editPassword" value={editFormData.editPassword} onChange={handleEditInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" />
                                </div>
                                <div>
                                    <label className="block mb-2">New Confirm Password</label>
                                    <input type="password" name="editConfirmPassword" value={editFormData.editConfirmPassword} onChange={handleEditInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:outline-gray-300 focus:border-gray-500 block w-full p-2.5" />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <div>
                                    <button type="button" onClick={() => setIsEditAdmin(false)} className="mr-4 py-2 px-4 text-red-500 rounded-lg">
                                        Cancel
                                    </button>
                                    <button type="submit" className="py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default Users;