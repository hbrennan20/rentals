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
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';
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
  'Carlow': 'rgba(255, 0, 0, 0.5)', // Faded Red
  'Cavan': 'rgba(0, 0, 255, 0.5)', // Faded Royal Blue
  'Clare': 'rgba(255, 215, 0, 0.5)', // Faded Yellow
  'Cork': 'rgba(255, 0, 0, 0.5)', // Faded Red
  'Derry': 'rgba(255, 0, 0, 0.5)', // Faded Red
  'Donegal': 'rgba(255, 215, 0, 0.5)', // Faded Yellow
  'Down': 'rgba(255, 0, 0, 0.5)', // Faded Red
  'Dublin': 'rgba(0, 0, 255, 0.5)', // Faded Navy Blue
  'Fermanagh': 'rgba(0, 128, 0, 0.5)', // Faded Green
  'Galway': 'rgba(128, 0, 0, 0.5)', // Faded Maroon
  'Kerry': 'rgba(0, 128, 0, 0.5)', // Faded Green
  'Kildare': 'rgba(128, 128, 128, 0.5)', // Faded Grey
  'Kilkenny': 'rgba(0, 0, 0, 0.5)', // Faded Black
  'Laois': 'rgba(0, 0, 255, 0.5)', // Faded Blue
  'Leitrim': 'rgba(0, 128, 0, 0.5)', // Faded Green
  'Limerick': 'rgba(0, 128, 0, 0.5)', // Faded Green
  'Longford': 'rgba(0, 0, 255, 0.5)', // Faded Blue
  'Louth': 'rgba(255, 0, 0, 0.5)', // Faded Red
  'Mayo': 'rgba(0, 128, 0, 0.5)', // Faded Green
  'Meath': 'rgba(0, 128, 0, 0.5)', // Faded Green
  'Monaghan': 'rgba(128, 128, 128, 0.5)', // Faded Grey
  'Offaly': 'rgba(0, 128, 0, 0.5)', // Faded Green
  'Roscommon': 'rgba(255, 215, 0, 0.5)', // Faded Yellow
  'Sligo': 'rgba(0, 0, 0, 0.5)', // Faded Black
  'Tipperary': 'rgba(0, 0, 255, 0.5)', // Faded Blue
  'Tyrone': 'rgba(128, 128, 128, 0.5)', // Faded Grey
  'Waterford': 'rgba(0, 0, 255, 0.5)', // Faded Blue
  'Westmeath': 'rgba(128, 0, 0, 0.5)', // Faded Maroon
  'Wexford': 'rgba(128, 0, 128, 0.5)', // Faded Purple
  'Wicklow': 'rgba(0, 0, 255, 0.5)', // Faded Blue
};

export default function GraphsPage() {
  const [currentChart, setCurrentChart] = useState('line');
  const [visibleLines, setVisibleLines] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCoffeeDialog, setOpenCoffeeDialog] = useState(false);

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
          <Paper elevation={2} sx={{ p: 3, height: '600px', overflow: 'auto' }}>
            <h3 className="text-lg font-medium mb-4">Median House Prices by County</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>
              <ResponsiveContainer width="100%" height={300}>
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
              <div style={{ width: '100%', overflowY: 'auto', paddingLeft: '10px' }}>
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
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Dashboard</h1>
      {/* Chart Section */}
      {renderChart()}

      {/* Data Table */}
      {!loading && data.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Median House Prices by County and Year</h3>
          </div>
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
                  .map((county, index) => (
                    <TableRow 
                      key={county}
                      sx={{ backgroundColor: index % 2 ? '#f5f5f5' : 'inherit' }}
                    >
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <IconButton 
              onClick={() => setOpenCoffeeDialog(true)}
              color="primary"
              title="Support Us"
              sx={{ 
                backgroundColor: '#1976d2', // Primary color
                color: 'white',
                '&:hover': {
                  backgroundColor: '#115293', // Darker shade on hover
                },
                borderRadius: '4px',
                padding: '8px',
              }}
            >
              <DownloadIcon />
            </IconButton>
          </div>
        </Paper>
      )}

      <Dialog
        open={openCoffeeDialog}
        onClose={() => setOpenCoffeeDialog(false)}
      >
        <DialogTitle>Support Us</DialogTitle>
        <DialogContent style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center', color: '#1976d2', fontSize: '1.2rem' }}>
            ☕️ If you enjoy our service, consider buying us a coffee! 
            <br />
            <a 
              href="https://www.buymeacoffee.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#ffcc00', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              Buy Me a Coffee
            </a>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCoffeeDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
