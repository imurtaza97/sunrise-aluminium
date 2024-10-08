'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '../dashboardLayout'
import Alert from '../../components/Alert';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const allMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Dashboard = () => {
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState({
    totalUsers: '0',
    totalUsersToday: '0',
    topCountry: '-',
    topCity: '-',
  });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true); // Loading state

  const handleCloseAlert = () => setAlert(null);

  // Fetches data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [dataResponse, chartResponse] = await Promise.all([
        fetch('/api/ga-data'),
        fetch('/api/ga-chart-data')
      ]);

      // Check responses
      if (!dataResponse.ok || !chartResponse.ok) {
        throw new Error(`Error fetching data: ${dataResponse.status}, ${chartResponse.status}`);
      }

      const result = await dataResponse.json();
      const chartResult = await chartResponse.json();

      if (result.rows && result.rows.length > 0) {
        const totalUsers = result.rows[0].metricValues[0]?.value || '0';
        const totalUsersToday = result.rows[0].metricValues[1]?.value || '0';
        const topCountry = result.rows[0].dimensionValues[0]?.value || '-';
        const topCity = result.rows[0].dimensionValues[1]?.value || '-';
        setData({ totalUsers, totalUsersToday, topCountry, topCity });
      }

      // Prepare chart data
      const userData = chartResult.reduce((acc, item) => {
        acc[item.date] = item.activeUsers;
        return acc;
      }, {});

      const dataset = allMonths.map((_, index) => userData[String(index + 1).padStart(2, '0')] || 0);

      setChartData({
        labels: allMonths,
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
      setAlert({ type: 'danger', message: err.message });
      setData({
        totalUsers: '0',
        totalUsersToday: '0',
        topCountry: '-',
        topCity: '-',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    scales: {
      y: { grid: { display: false }, beginAtZero: true },
      x: { grid: { display: true } },
    },
    elements: {
      point: { radius: 0 },
      line: { tension: 0.3 },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <AdminLayout>
      {alert && <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />}
      <nav className="flex h-fit" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="#" className="inline-flex items-center text-sm font-medium text-gray-500">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Dashboard
            </a>
          </li>
        </ol>
      </nav>

      <div className='flex flex-col items-start justify-start p-2'>
        <div className='grid md:grid-cols-4 gap-10 p-2'>
          {loading ? (
            <p>Loading...</p> // Loading state for data
          ) : (
            <>
              <InfoCard title={data.totalUsers} subtitle="Total Users" color="bg-red-100">
                <UserIcon />
              </InfoCard>
              <InfoCard title={data.totalUsersToday} subtitle="Users In Last 24 Hours" color="bg-blue-100">
                <UserCheckIcon />
              </InfoCard>
              <InfoCard title={data.topCountry} subtitle="Top Visited Country" color="bg-green-100">
                <MapPinIcon />
              </InfoCard>
              <InfoCard title={data.topCity} subtitle="Top Visited City" color="bg-yellow-100">
                <BuildingIcon />
              </InfoCard>
            </>
          )}
        </div>

        {/* Chart Component */}
        <div className="p-2 w-fit md:w-[600px] md:h-[500px]">
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
  );
};

// InfoCard Component to avoid repetition
const InfoCard = ({ title, subtitle, color, children }) => (
  <div className={`flex flex-col md:w-[250px] ${color} rounded-md shadow p-4`}>
    {children}
    <span className='pt-2 ps-1 text-start'>
      <p className='text-xl font-semibold'>{title}</p>
      <p className='text-sm text-gray-600'>{subtitle}</p>
    </span>
  </div>
);

// Example SVG Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const UserCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check">
    <path d="M7 16a4 4 0 1 1 4-4" />
    <path d="M16 10h4" />
    <path d="M19 10l-3 3-1-1" />
    <path d="M2 22s2-2 4-2 4 2 4 2" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
    <path d="M21 10c0 4-5 10-9 12-4-2-9-8-9-12 0-4.418 4.482-8 9-8s9 3.582 9 8z" />
    <path d="M12 10v2" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building">
    <path d="M3 21h18" />
    <path d="M4 21V3h16v18" />
    <path d="M12 8h0" />
    <path d="M16 8h0" />
    <path d="M12 12h0" />
    <path d="M16 12h0" />
    <path d="M12 16h0" />
  </svg>
);

export default Dashboard;
