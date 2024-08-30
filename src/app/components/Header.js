'use client'; // Add this at the top to mark the component as a Client Component
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
    const images = [
        '/images/b1.jpg',
        '/images/b2.jpg',
        '/images/b3.jpg',
        '/images/b4.jpg',
        '/images/b5.avif',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Use effect to auto-scroll the carousel
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Clear the interval on component unmount
    }, []);
    return (
        <header>
            <nav id='Home' className="bg-white border-gray-200 font-sans fixed z-30 w-full drop-shadow">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/images/bg_sun.png" className="h-8" alt="Flowbite Logo" />
                        <span className='flex flex-col text-center text-orange-950 font-serif'>
                            <p className='text-lg font-medium leading-none uppercase m-0'>Sunrise</p>
                            <p className='text-xs font-normal leading-none uppercase m-0'>Aluminium</p>
                        </span>
                    </Link>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                            <li>
                                <Link href="#home" className="block py-2 px-3 text-white bg-orange-700 rounded md:bg-transparent md:text-orange-700 md:p-0" aria-current="page">Home</Link>
                            </li>
                            <li>
                                <Link href="#services" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0 ">Our Services</Link>
                            </li>
                            <li>
                                <Link href="#wcu" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-700 md:p-0 ">Why Choose Us?</Link>
                            </li>
                            <li>
                                <Link href='#contact' className='bg-orange-900 p-2 rounded-lg text-sm text-white hover:bg-orange-800'>
                                    Get In Touch
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Carousel Section */}
            <div className="relative w-full mx-0">
                <div className="relative w-full h-screen overflow-hidden">
                    {images.map((image, index) => (
                        <div key={index} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                            <img src={image} className="block w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                    {/* Welcome Message */}
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <h1 className="text-4xl md:text-5xl max-w-4xl font-bold text-white bg-slate-400 bg-opacity-50 p-4 rounded-lg">
                            "Welcome to Sunrise Aluminium" Your Trusted Partner for Aluminium Section and Glass Solutions
                        </h1>
                    </div>
                </div>
                <button onClick={prevSlide} className="absolute top-1/2 m-2 left-0 transform -translate-y-1/2 p-2 bg-slate-400 bg-opacity-50 text-white rounded-full hover:bg-gray-700">
                    &#8249;
                </button>
                <button onClick={nextSlide} className="absolute top-1/2 m-2 right-0 transform -translate-y-1/2 p-2 bg-slate-400 bg-opacity-50 text-white rounded-full hover:bg-gray-700">
                    &#8250;
                </button>
            </div>
        </header>
    );
};

export default Header;
