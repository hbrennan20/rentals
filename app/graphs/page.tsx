'use client'

import { 
  Paper,
  Button
} from '@mui/material'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts'
import { useState } from 'react';

const data = [
  { month: 'Jan', revenue: 4000, users: 2400 },
  { month: 'Feb', revenue: 3000, users: 1398 },
  { month: 'Mar', revenue: 2000, users: 9800 },
  { month: 'Apr', revenue: 2780, users: 3908 },
  { month: 'May', revenue: 1890, users: 4800 },
  { month: 'Jun', revenue: 2390, users: 3800 },
]

const metrics = [
  { title: 'Total Revenue', value: '$23,456', change: '+12.3%' },
  { title: 'Active Users', value: '12,234', change: '+2.3%' },
  { title: 'Conversion Rate', value: '3.8%', change: '-0.4%' },
]

const countyData = [
  { county: 'County A', medianPrice: 350000 },
  { county: 'County B', medianPrice: 450000 },
  { county: 'County C', medianPrice: 550000 },
  { county: 'County D', medianPrice: 600000 },
  { county: 'County E', medianPrice: 700000 },
  { county: 'County F', medianPrice: 750000 },
  { county: 'County G', medianPrice: 800000 },
  { county: 'County H', medianPrice: 850000 },
  { county: 'County I', medianPrice: 900000 },
  { county: 'County J', medianPrice: 950000 },
  { county: 'County K', medianPrice: 1000000 },
  { county: 'County L', medianPrice: 1100000 },
  { county: 'County M', medianPrice: 1200000 },
  { county: 'County N', medianPrice: 1300000 },
  { county: 'County O', medianPrice: 1400000 },
  { county: 'County P', medianPrice: 1500000 },
  { county: 'County Q', medianPrice: 1600000 },
  { county: 'County R', medianPrice: 1700000 },
  { county: 'County S', medianPrice: 1800000 },
  { county: 'County T', medianPrice: 1900000 },
  { county: 'County U', medianPrice: 2000000 },
  { county: 'County V', medianPrice: 2100000 },
  { county: 'County W', medianPrice: 2200000 },
  { county: 'County X', medianPrice: 2300000 },
  { county: 'County Y', medianPrice: 2400000 },
  { county: 'County Z', medianPrice: 2500000 },
  // ... add more counties as needed ...
];

export default function GraphsPage() {
  const [currentChart, setCurrentChart] = useState('line');

  const renderChart = () => {
    switch (currentChart) {
      case 'line':
        return (
          <Paper elevation={2} sx={{ p: 3, height: '600px' }}>
            <h3 className="text-lg font-medium mb-4">Line Chart</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        );
      case 'area':
        return (
          <Paper elevation={2} sx={{ p: 3, height: '600px' }}>
            <h3 className="text-lg font-medium mb-4">Area Chart</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" fill="#82ca9d" stroke="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        );
      case 'bar':
        return (
          <Paper elevation={2} sx={{ p: 3, height: '600px' }}>
            <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        );
      case 'county':
        return (
          <Paper elevation={2} sx={{ p: 3, height: '600px' }}>
            <h3 className="text-lg font-medium mb-4">County Median House Prices</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="county" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="medianPrice" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Navigation Buttons */}
      <div className="mb-4">
        <Button variant="contained" onClick={() => setCurrentChart('line')}>Line Chart</Button>
        <Button variant="contained" onClick={() => setCurrentChart('area')} className="ml-2">Area Chart</Button>
        <Button variant="contained" onClick={() => setCurrentChart('bar')} className="ml-2">Bar Chart</Button>
        <Button variant="contained" onClick={() => setCurrentChart('county')} className="ml-2">County Median House Prices</Button>
      </div>

      {/* Chart Section */}
      {renderChart()}
    </div>
  )
}
