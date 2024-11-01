'use client'

import { 
  Paper,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Line,
} from 'recharts'
import { useState, useEffect } from 'react';
import axios from 'axios';

const COUNTY_COLORS = {
  'Carlow': '#FF0000', // Red and Green
  'Cavan': '#0000FF', // Royal Blue and Grey
  'Clare': '#FFD700', // Yellow and Blue
  'Cork': '#FF0000', // Red and Grey
  'Derry': '#FF0000', // Red and Grey
  'Donegal': '#FFD700', // Yellow and Green
  'Down': '#FF0000', // Red and Black
  'Dublin': '#0000FF', // Navy Blue and Sky Blue
  'Fermanagh': '#008000', // Green and Grey
  'Galway': '#800000', // Maroon and Grey
  'Kerry': '#008000', // Green and Gold
  'Kildare': '#808080', // Grey and Red
  'Kilkenny': '#000000', // Black and Amber
  'Laois': '#0000FF', // Blue and Grey
  'Leitrim': '#008000', // Green and Gold
  'Limerick': '#008000', // Green and Grey
  'Longford': '#0000FF', // Blue and Gold
  'Louth': '#FF0000', // Red and Grey
  'Mayo': '#008000', // Green and Red
  'Meath': '#008000', // Green and Gold
  'Monaghan': '#808080', // Grey and Blue
  'Offaly': '#008000', // Green, Grey and Gold
  'Roscommon': '#FFD700', // Yellow and Blue
  'Sligo': '#000000', // Black and Grey
  'Tipperary': '#0000FF', // Blue and Gold
  'Tyrone': '#808080', // Grey and Red
  'Waterford': '#0000FF', // Blue and Grey
  'Westmeath': '#800000', // Maroon and Grey
  'Wexford': '#800080', // Purple and Gold
  'Wicklow': '#0000FF', // Blue and Gold
};

export default function GraphsPage() {
  const [currentChart, setCurrentChart] = useState('line');
  const [visibleLines, setVisibleLines] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/contracts');
        const groupedData = response.data.data.reduce((acc, record) => {
          const year = new Date(record.date).getFullYear();
          if (!acc[year]) acc[year] = {};
          if (!acc[year][record.county]) {
            acc[year][record.county] = {
              prices: [],
              count: 0
            };
          }
          acc[year][record.county].prices.push(record.price);
          acc[year][record.county].count++;
          return acc;
        }, {});

        const processedData = Object.entries(groupedData).map(([year, counties]) => {
          const yearData = { year: parseInt(year) };
          Object.entries(counties).forEach(([county, data]) => {
            const median = calculateMedian(data.prices);
            yearData[county] = median;
          });
          return yearData;
        });

        setData(processedData.sort((a, b) => a.year - b.year));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const counties = Object.keys(data[0]).filter(key => key !== 'year');
      const initialVisibility = counties.reduce((acc, county) => {
        acc[county] = true;
        return acc;
      }, {});
      setVisibleLines(initialVisibility);
    }
  }, [data]);

  const calculateMedian = (prices) => {
    const sorted = prices.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  };

  const renderChart = () => {
    if (loading) {
      return <CircularProgress />;
    }

    switch (currentChart) {
      case 'line':
        const counties = data.length > 0 
          ? Object.keys(data[0]).filter(key => key !== 'year')
          : [];

        return (
          <Paper elevation={2} sx={{ p: 3, height: '600px' }}>
            <h3 className="text-lg font-medium mb-4">Median House Prices by County</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)', display: 'flex' }}>
              <ResponsiveContainer width="85%" height="100%">
                <LineChart 
                  data={data}
                  margin={{ right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => `€${value.toLocaleString()}`}
                    itemSorter={(item) => -item.value}
                  />
                  {counties.map((county) => (
                    visibleLines[county] && (
                      <Line 
                        key={county}
                        type="monotone" 
                        dataKey={county}
                        name={county}
                        stroke={COUNTY_COLORS[county] || `hsl(${(index * 360) / counties.length}, 70%, 50%)`}
                        strokeWidth={2}
                        dot={false}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div style={{ width: '15%', overflowY: 'auto', paddingLeft: '10px' }}>
                {counties.map((county) => (
                  <div
                    key={county}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      opacity: visibleLines[county] ? 1 : 0.5,
                    }}
                    onClick={() => {
                      setVisibleLines(prev => ({
                        ...prev,
                        [county]: !prev[county]
                      }));
                    }}
                    onDoubleClick={() => {
                      const allFalse = Object.fromEntries(
                        counties.map(c => [c, false])
                      );
                      setVisibleLines({
                        ...allFalse,
                        [county]: true
                      });
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: COUNTY_COLORS[county] || `hsl(${(index * 360) / counties.length}, 70%, 50%)`,
                        marginRight: '8px',
                      }}
                    />
                    <span style={{ fontSize: '0.875rem' }}>{county}</span>
                  </div>
                ))}
              </div>
            </div>
          </Paper>
        );
      case 'area':
        return (
          <Paper elevation={2} sx={{ p: 3, height: '600px' }}>
            <h3 className="text-lg font-medium mb-4">Number of Sales Over Time</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" fill="#82ca9d" stroke="#82ca9d" />
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

      {/* Data Table */}
      {!loading && data.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <h3 className="text-lg font-medium mb-4">Median House Prices by County and Year</h3>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>County</strong></TableCell>
                  {data.map(yearData => (
                    <TableCell key={yearData.year} align="right">
                      <strong>{yearData.year}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(data[0])
                  .filter(key => key !== 'year')
                  .map(county => (
                    <TableRow key={county}>
                      <TableCell component="th" scope="row">
                        {county}
                      </TableCell>
                      {data.map(yearData => (
                        <TableCell key={yearData.year} align="right">
                          {yearData[county] 
                            ? `€${yearData[county].toLocaleString()}`
                            : '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  )
}
