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
      </div>

      {/* Chart Section */}
      {renderChart()}
    </div>
  )
}
