'use client';
import { useState, useRef } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alert from './components/Alert';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [alert, setAlert] = useState(null);

  const services = [
    {
      title: "Aluminium Sections",
      description: "We offer a comprehensive selection of aluminium sections designed to meet various industrial and construction requirements.",
      imgSrc: "/images/b4.jpg",
      link: "#"
    },
    {
      title: "ACP Paneling Work",
      description: "Enhance the aesthetic appeal of your space with our ACP paneling services, perfect for shops and advertisements.",
      imgSrc: "/images/acp_paneling.webp",
      link: "#"
    },
    {
      title: "ACP Paneling Boards",
      description: "High-quality ACP paneling boards ideal for creating striking facades and stylish interiors.",
      imgSrc: "/images/acp_board.jpeg",
      link: "#"
    },
    {
      title: "Glass Work",
      description: "Custom glass work services to bring clarity and elegance to your project, handled with precision and care.",
      imgSrc: "/images/glass.jpg",
      link: "#"
    },
    {
      title: "Aluminium Work",
      description: "Our aluminium work services encompass a wide range of applications, ensuring long-lasting results.",
      imgSrc: "/images/aluminium_section.avif",
      link: "#"
    }
  ];

  const whyChooseUs = [
    {
      title: "Expertise",
      description: "Our team is highly skilled and experienced in handling all aspects of aluminium and glass work.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gift"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></svg>
      ),
      link: "Learn more about our expertise"
    },
    {
      title: "Quality",
      description: "We use only the best materials and practices to ensure the highest quality for every project.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
      ),
      link: "See our quality standards"
    },
    {
      title: "Customer Satisfaction",
      description: "We are committed to exceeding your expectations with every service we provide.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></svg>
      ),
      link: "See our customer testimonials"
    },
    {
      title: "Timely Delivery",
      description: "We understand the importance of deadlines and work diligently to complete projects on time.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alarm-clock"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3 2 6" /><path d="m22 6-3-3" /><path d="M6.38 18.7 4 21" /><path d="M17.64 18.67 20 21" /></svg>
      ),
      link: "Learn more about our processes"
    },
    {
      title: "Affordable Pricing",
      description: "We offer competitive pricing without compromising on quality or service.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt-indian-rupee"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M8 7h8" /><path d="M12 17.5 8 15h1a4 4 0 0 0 0-8" /><path d="M8 11h8" /></svg>
      ),
      link: "View our pricing plans"
    },
    {
      title: "Sustainability",
      description: "We are committed to sustainable practices that reduce our environmental impact.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-10"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 8 10" /></svg>
      ),
      link: "Learn about our green initiatives"
    }
  ];
  const carouselRef = useRef(null);

  const scrollRight = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      const cardWidth = carousel.children[0].offsetWidth;
      const visibleWidth = carousel.clientWidth;
      const maxScrollLeft = carousel.scrollWidth - visibleWidth;

      if (carousel.scrollLeft + visibleWidth >= maxScrollLeft - cardWidth) {
        // Move to the start if the last card is reached
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollLeft = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      const cardWidth = carousel.children[0].offsetWidth;

      if (carousel.scrollLeft <= cardWidth) {
        // Move to the end if the first card is reached
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {

        await axios.post("https://sunriseserver.onrender.com/api", {
          type: "contact message",
          name: formData.name,
          message: formData.message
        });

        setAlert({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setAlert({ type: 'danger', message: data.error || 'Something went wrong!' });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'An unexpected error occurred!' });
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between bg-white">
        {alert && <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />}
        <section id='services' className="flex flex-col items-center w-full h-2/3 bg-orange-900 text-center pt-10">
          <h3 className="text-4xl text-white p-2">Our Work</h3>
          <p className='text-white'>Explore the diverse range of projects we specialize in</p>
          <div className='relative w-full px-20'>
            <div ref={carouselRef} className='flex w-full overflow-x-hidden my-10'>
              {services.map((service, index) => (
                <div key={index} className="max-w-sm bg-white rounded-lg shadow min-w-96 m-5">
                  <a href={service.link}>
                    <Image className="rounded-t-lg w-full h-80 object-cover" height={400} width={200} src={service.imgSrc} alt={service.title} />
                  </a>
                  <div className="p-5">
                    <a href={service.link}>
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{service.title}</h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={scrollRight}
              type="button"
              aria-label="Scroll Right"
              className='flex justify-center items-center absolute top-1/2 right-0 w-10 h-10 bg-gray-500 bg-opacity-50 m-2 rounded-full text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
            </button>
            <button
              onClick={scrollLeft}
              type="button"
              aria-label="Scroll Left"
              className='flex justify-center items-center absolute top-1/2 left-0 w-10 h-10 bg-gray-500 bg-opacity-50 m-2 rounded-full text-white'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </div>
        </section>

        <section id='wcu' className='flex flex-col items-center w-full h-2/3 bg-white text-center pt-10'>
          <h3 className="text-4xl text-black p-2">Why Choose Us?</h3>
          <div className='flex flex-wrap justify-center w-full m-5'>
            {whyChooseUs.map((item, index) => (
              <div key={index} className="flex justify-center items-center flex-col max-w-sm p-6 m-5 bg-white border border-gray-200 rounded-lg shadow">
                <span className='flex w-fit justify-center m-4 text-white bg-orange-500 rounded-full p-2'>
                  {item.icon}
                </span>
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">{item.title}</h5>
                <p className="mb-3 font-normal text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id='contact' className="flex flex-col md:flex-row items-center justify-around w-full h-auto bg-gray-100 p-10">
          {/* Left: Contact Form */}
          <div className="w-full md:w-1/2 p-5 mx-20 bg-white rounded-lg shadow-lg">
            <h3 className="text-3xl mb-5 text-gray-800">Get in Touch</h3>
            <form className="flex flex-col space-y-4 text-black" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="5"
                required
              ></textarea>
              <button
                type="submit"
                className="p-3 bg-orange-900 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right: Contact Information */}
          <div className="w-full md:w-1/2 p-5 text-gray-800">
            <h3 className="text-3xl mb-5">Contact Information</h3>
            <p className="mb-3">
              <span>
                <strong>Address:</strong>
              </span><br />
              22,Super Market, Opp Bus station<br />
              Viramgam,Ahmedabad,Gujarat - 382150.
            </p>
            <p className="mb-3">
              <span>
                <strong>Phone:</strong>
              </span><br />
              +91 9898887090.<br />
              +91 7016259254.<br />
            </p>
            <p className="mb-3">
              <span>
                <strong>Email:</strong>
              </span><br />
              sunrisealluminium@gmail.com
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
