'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '../dashboardLayout'
import Alert from '../../components/Alert';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);
const Dashboard = () => {
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState({
    totalUsers: '0',
    totalUsersToday: '0',
    topCountry: '-',
    topCity: '-',
  });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const handleCloseAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from both endpoints concurrently
        const [dataResponse, chartResponse] = await Promise.all([
          fetch('/api/ga-data'),
          fetch('/api/ga-chart-data')
        ]);
  
        // Check if responses are okay
        if (!dataResponse.ok || !chartResponse.ok) {
          throw new Error(`Error fetching data: ${dataResponse.status}, ${chartResponse.status}`);
        }
  
        // Parse the responses as JSON
        const result = await dataResponse.json();
        const chartResult = await chartResponse.json();
  
        // Update state with fetched data
        const totalUsers = result.allTimeSessions || '0';
        const totalUsersToday = result.last24HoursSessions || '0';
        const topCountry = result.topVisitedCountry || '-';
        const topCity = result.topVisitedCity || '-';
  
        setData({ totalUsers, totalUsersToday, topCountry, topCity });
  
        // Process chartResult to get active users per month or day
        const userData = chartResult.reduce((acc, item) => {
          acc[item.date] = item.activeUsers;
          return acc;
        }, {});
  
        // Generate dataset for the chart
        const dataset = allMonths.map((_, index) => userData[String(index + 1).padStart(2, '0')] || 0);
  
        // Set chart data in the state
        setChartData({
          labels: allMonths,  // You can change this to your desired label format (e.g., daily, monthly, etc.)
          datasets: [
            {
              label: 'Active Users',
              data: dataset,
              borderColor: 'black',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              borderWidth: 3,
            }
          ],
        });
      } catch (err) {
        // Handle error and show an alert message
        setAlert({ type: 'danger', message: err.message });
        // Reset data in case of failure
        setData({
          totalUsers: '0',
          totalUsersToday: '0',
          topCountry: '-',
          topCity: '-',
        });
      }
    }
  
    // Fetch data on component mount
    fetchData();
  }, []);
  

  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const options = {
    scales: {
      y: {
        grid: {
          display: false, // Hide y-axis grid lines
        },
        beginAtZero: true,
      },
      x: {
        grid: {
          display: true, // Optionally hide x-axis grid lines
        },
      },
    },
    elements: {
      point: {
        radius: 2, // Remove the points on the line
      },
      line: {
        tension: 0.1, // Smooth out the line (optional)
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <AdminLayout>

      {alert && <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />}
      <nav className="flex h-fit" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="#" className="inline-flex items-center text-sm font-medium  text-gray-500">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" /></svg>
              Dashboard
            </a>
          </li>
        </ol>
      </nav>

      <div className='flex flex-col items-start justify-start p-2'>
        <div className='grid md:grid-cols-4 gap-10 p-2'>
          <div className='flex flex-col md:w-[250px] bg-red-100 rounded-md shadow p-4'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
            <span className='pt-2 ps-1 text-start'>
              <p className='text-xl font-semibold'>{data.totalUsers}</p>
              <p className='text-sm text-gray-600'>Total Users</p>
            </span>
          </div>
          <div className='flex flex-col md:w-[250px] bg-blue-100 rounded-md shadow p-4'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="m16 19 2 2 4-4" /></svg>
            <span className='pt-2 ps-1 text-start'>
              <p className='text-xl font-semibold'>{data.totalUsersToday}</p>
              <p className='text-sm text-gray-600'>Users In Last 24 Hours</p>
            </span>
          </div>
          <div className='flex flex-col md:w-[250px] bg-green-100 rounded-md shadow p-4'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
            <span className='pt-2 ps-1 text-start'>
              <p className='text-xl font-semibold'>{data.topCountry}</p>
              <p className='text-sm text-gray-600'>Top Visited Country</p>
            </span>
          </div>
          <div className='flex flex-col md:w-[250px] bg-yellow-100 rounded-md shadow p-4'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
            <span className='pt-2 ps-1 text-start'>
              <p className='text-xl font-semibold'>{data.topCity}</p>
              <p className='text-sm text-gray-600'>Top Visited city</p>
            </span>
          </div>
        </div>

        {/* Add Chart Component Here */}
        <div className="p-2 w-fit md:w-[600px] md:h-[500]">
          <div className="bg-white shadow rounded-lg p-6 w-full">
            <div className='flex justify-between py-2'>
              <span>
                <p className='text-lg font-semibold'>Month wise Visitors Count</p>
                <p className='text-xs font-thin text-gray-600'>JAN-DEC</p>
              </span>
              <span className='flex items-center'>
                <span className='flex w-3 h-3 rounded-full border-2 border-black me-2 bg-gray-300'></span>
                <p className='text-md font-thin'>Users</p>
              </span>
              
            </div>
            <div className="chart-container">
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

export default Dashboard
