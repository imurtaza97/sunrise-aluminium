'use client'
import { Inter } from "next/font/google";
import React, { useState, useRef, useEffect } from 'react';
import "../../app/globals.css";
import Link from 'next/link';
import { Roboto } from 'next/font/google'
import io from 'socket.io-client';
import Image from 'next/image';

const roboto = Roboto({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})

const AdminLayout = ({ children }) => {
    const [userData, setUserData] = useState({});
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [profileImage, setprofileImage] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // State to track unread notifications
    const [alert, setAlert] = useState(null);

    const searchRef = useRef(null);
    const userMenuRef = useRef(null);
    const userButtonRef = useRef(null);
    const searchButtonRef = useRef(null);
    const notificationRef = useRef(null);
    const notificationButtonRef = useRef(null);

    const handleCloseAlert = () => {
        setAlert(null);
    };

    useEffect(() => {
        const socket = io("http://localhost:4000");

        socket.on('connect', () => {
            setAlert({ type: 'success', message: 'Connected to Server' });
        });

        socket.on('notification', (data) => {
            setNotifications(prevNotifications => [...prevNotifications, data]);
            setUnreadCount(prevCount => prevCount + 1);
        });

        socket.on('disconnect', () => {
            setAlert({ type: 'danger', message: 'Disconnect from Server' });
        });

        // Cleanup the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSearchOpen = (event) => {
        event.stopPropagation();
        setIsSearchOpen(!isSearchOpen);
    };

    const handleUserMenuOpen = (event) => {
        event.stopPropagation();
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleNotificationOpen = (event) => {
        event.stopPropagation();
        setIsNotificationMenuOpen(!isNotificationMenuOpen);
        if (isNotificationMenuOpen) {
            setUnreadCount(0); // Reset unread count when menu is opened
        }
    }

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target) && !searchButtonRef.current.contains(event.target)) {
            setIsSearchOpen(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(event.target) && !userButtonRef.current.contains(event.target)) {
            setIsUserMenuOpen(false);
        }
        if (notificationRef.current && !notificationRef.current.contains(event.target) && !notificationButtonRef.current.contains(event.target)) {
            setIsNotificationMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/getUser'); // Adjust the endpoint to match your API
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                    setprofileImage(data.user.image);
                } else {
                    window.location.href = '/admin'; // Redirect to login page or wherever needed
                    setAlert({ type: 'danger', message: 'Failed to Fatch user Details.' });
                }
            } catch (error) {
                setAlert({ type: 'danger', message: `Error fetching user details: ${error}` });
            }
        };

        fetchUser();
    }, []);


    const handleLogout = async () => {
        try {
            const response = await fetch('/api/admin/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/admin'; // Redirect to login page or wherever needed
            } else {
                setAlert({ type: 'danger', message: `Logout Failed` });
            }
        } catch (error) {
            setAlert({ type: 'danger', message: `Error: ${error}` });
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.results);
            } else {
                setAlert({ type: 'danger', message: `Search Failed` });

            }
        } catch (error) {
            setAlert({ type: 'danger', message: `Error during search: ${error}` });
        }
    };

    const handleNotificationCancel = (index) => {
        setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
    };
    return (
        <div className={`${roboto.className} text-gray-900`}>
            <nav className="fixed top-0 sm:left-60 h-16 w-full sm:w-sidbarMinus bg-white border-b border-gray-100">
                <div className="px-1 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden">
                                <span className="sr-only">Open sidebar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-justify"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className='flex items-center m-2'>
                                <button ref={searchButtonRef} className='mx-2  hover:text-gray-500' onClick={handleSearchOpen}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </button>
                                <button ref={notificationButtonRef} className='relative mx-2  hover:text-gray-500' onClick={handleNotificationOpen}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center px-4">
                                <div>
                                    <button ref={userButtonRef} type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300" onClick={handleUserMenuOpen}>
                                        <span className="sr-only">Open user menu</span>
                                        {profileImage ? (
                                            <Image src={profileImage} alt="Profile" width={200} height={200} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center  text-lg">
                                                {userData?.name?.charAt(0) || 'A'}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div ref={userMenuRef} className={`${isUserMenuOpen ? '' : 'hidden'} absolute top-[50px] right-0 z-40 my-4 mx-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow`}>
                <div className="px-4 py-3" role="none">
                    <p className="text-sm font-medium text-gray-90 capitalize truncate" role="none">
                        {userData.name || 'Loading...'}
                    </p>
                </div>
                <ul className="py-1" role="none">
                    <li>
                        <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 " role="menuitem">Profile</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="block text-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 " role="menuitem">Sign out</button>
                    </li>
                </ul>
            </div>

            <div ref={searchRef} className={`${isSearchOpen ? 'block' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50`}>
                <div className="relative bg-white p-4 rounded-lg w-1/2 max-w-lg">
                    <button onClick={handleSearchOpen} className="fixed top-2 m-3 right-2 text-red-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="M6 6l12 12" /></svg>
                    </button>
                    <form onSubmit={handleSearchSubmit}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <input
                                type="text"
                                id="search-input"
                                className="block w-full px-4 py-2 pl-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </form>
                    <div className="flex justify-center mt-2">
                        {searchResults.length > 0 ? (
                            <ul className="w-full list-none">
                                {searchResults.map((result, index) => (
                                    <li key={index} className="p-2 border-b border-gray-200">
                                        {result.type === 'contact' ? (
                                            <Link href={`/admin/contacts/`} className="w-full text-gray-600 hover:underline">
                                                {result.name || 'No Name'}
                                            </Link>
                                        ) : result.type === 'admin' ? (
                                            <Link href={`/admin/users/`} className="w-full text-gray-600 hover:underline">
                                                {result.name || 'No Name'}
                                            </Link>
                                        ) : (
                                            <div>No results found</div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-2">No results found</div>
                        )}
                    </div>
                </div>
            </div>

            <div ref={notificationRef} className={`${isNotificationMenuOpen ? '' : 'hidden'} text-center absolute top-[40px] md:right-[80px] w-[350px] z-40 my-4 mx-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}>
                <div className="px-4 py-2 text-start rounded-t-lg text-md font-semibold">
                    Notifications
                </div>
                {notifications.length > 0 ? (
                    <ul className="py-2">
                        {notifications.map((notification, index) => (
                            <li key={index} className="flex items-start p-3 border-b border-gray-200">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-normal">{notification.name}</p>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleNotificationCancel(index)}
                                            aria-label="Cancel notification"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                                                <line x1="18" x2="6" y1="6" y2="18" />
                                                <line x1="6" x2="18" y1="6" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-start text-sm">
                                        {notification.message.slice(0, 50)}{notification.message.length > 50 ? '...' : ''}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-4 text-gray-500">
                        No notifications
                    </div>
                )}
            </div>

            <aside id="logo-sidebar" className="fixed top-0 sm:top-0 left-0 w-60 h-screen transition-transform -translate-x-full bg-gray-100 sm:translate-x-0 z-40 sm:z-0" aria-label="Sidebar">
                <Link href="/" className="flex justify-between p-4">
                    <p className="text-2xl">Admin.</p>
                </Link>
                <span>
                    <p className="px-4 py-2 font-semibold text-sm">MENU</p>
                </span>
                <div className="h-full pb-4 overflow-y-auto">
                    <ul className="space-y-2 p-2 font-medium">
                        <li>
                            <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-md group font-normal rounded-md hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/contacts" className="flex items-center px-4 py-2 text-md group font-normal rounded-md hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-more"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></svg>
                                <span className="ms-3">Messages</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users" className="flex items-center px-4 py-2 text-md group font-normal rounded-md hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round">
                                    <path d="M18 20a6 6 0 0 0-12 0" />
                                    <circle cx="12" cy="10" r="4" />
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                                <span className="ms-3">Users</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="flex flex-col fixed top-16 p-4 sm:ml-60 w-full md:w-sidbarMinus h-navbarMinus bg-white overflow-y-auto">
                {children}
            </div>
        </div>

    )
}

export default AdminLayout
