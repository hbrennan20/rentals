'use client'

import { 
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
  IconButton,
  Checkbox
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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedCounties, setSelectedCounties] = useState(new Set());

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

  const handleTooltipClick = () => {
    setTooltipVisible(true);
    setTimeout(() => {
      setTooltipVisible(false);
    }, 3000);
  };

  const handleCountySelect = (county) => {
    setSelectedCounties(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(county)) {
        newSelection.delete(county); // Deselect if already selected
      } else {
        newSelection.add(county); // Select if not selected
      }
      return newSelection;
    });
  };

  const filteredData = data.map(yearData => {
    const filteredYearData = { year: yearData.year };
    Object.keys(yearData).forEach(county => {
      if (selectedCounties.has(county)) {
        filteredYearData[county] = yearData[county];
      }
    });
    return filteredYearData;
  }).filter(yearData => Object.keys(yearData).length > 1); // Filter out years with no selected counties

  const renderChart = () => {
    if (loading) {
      return <CircularProgress />;
    }

    const counties = filteredData.length > 0 
      ? Object.keys(filteredData[0]).filter(key => key !== 'year')
      : [];

    switch (currentChart) {
      case 'line':
        return (
          <div className="p-4 rounded-lg shadow-md bg-white mb-4" style={{ width: '100%' }}>
            <h3 className="text-lg font-medium mb-4">Median House Prices by County</h3>
            <div className="flex flex-col w-full">
              <ResponsiveContainer width="100%" height={400} style={{ paddingRight: '20px' }}>
                <LineChart 
                  data={filteredData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                    style={{ textAlign: 'left' }} // Align left
                  />
                  <Tooltip 
                    formatter={(value) => `€${value.toLocaleString()}`}
                    itemSorter={(item) => -item.value}
                    open={tooltipVisible}
                    onClick={handleTooltipClick}
                    contentStyle={{ maxHeight: '200px', overflowY: 'auto' }}
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
            </div>
          </div>
        );
      case 'area':
        return (
          <div style={{ padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff', marginBottom: '16px', width: '100%' }}>
            <h3 className="text-lg font-medium mb-4">Number of Sales Over Time</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" fill="#82ca9d" stroke="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'bar':
        return (
          <div style={{ padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff', marginBottom: '16px', width: '100%' }}>
            <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'county':
        return (
          <div style={{ padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff', marginBottom: '16px', width: '100%' }}>
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-full md:max-w-4xl mx-auto md:pl-0">
      <div className="p-4 rounded-lg shadow-md bg-white mb-4">
        <h3 className="text-sm font-medium mb-2">Provinces and Counties</h3>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {/* Provinces */}
              <TableRow>
                <TableCell><strong>Leinster</strong></TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Wicklow', 'Kildare', 'Kilkenny', 'Laois', 'Longford', 'Louth', 'Meath', 'Wexford', 'Westmeath'].map(county => (
                      <div key={county} style={{ marginRight: '10px' }}>
                        <Checkbox 
                          checked={selectedCounties.has(county)} 
                          onChange={() => handleCountySelect(county)} 
                          size="small"
                        />
                        {county}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Munster</strong></TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Cork', 'Clare', 'Kerry', 'Limerick', 'Tipperary', 'Waterford'].map(county => (
                      <div key={county} style={{ marginRight: '10px' }}>
                        <Checkbox 
                          checked={selectedCounties.has(county)} 
                          onChange={() => handleCountySelect(county)} 
                          size="small"
                        />
                        {county}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Connacht</strong></TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Galway', 'Mayo', 'Roscommon', 'Sligo'].map(county => (
                      <div key={county} style={{ marginRight: '10px' }}>
                        <Checkbox 
                          checked={selectedCounties.has(county)} 
                          onChange={() => handleCountySelect(county)} 
                          size="small"
                        />
                        {county}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Ulster</strong></TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Donegal', 'Cavan', 'Monaghan'].map(county => (
                      <div key={county} style={{ marginRight: '10px' }}>
                        <Checkbox 
                          checked={selectedCounties.has(county)} 
                          onChange={() => handleCountySelect(county)} 
                          size="small"
                        />
                        {county}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {renderChart()}

      {/* Data Table */}
      {!loading && filteredData.length > 0 && (
        <div className="p-4 rounded-lg shadow-md bg-white mt-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Median House Prices by County and Year</h3>
          </div>
          <TableContainer className="max-w-full">
            <Table size="small" className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableCell><strong>County</strong></TableCell>
                  {filteredData.map(yearData => (
                    <TableCell key={yearData.year} align="right">
                      <strong>{yearData.year}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(selectedCounties).map((county, index) => (
                  <TableRow 
                    key={county}
                    sx={{ backgroundColor: index % 2 ? '#f5f5f5' : 'inherit' }}
                  >
                    <TableCell component="th" scope="row">
                      {county}
                    </TableCell>
                    {filteredData.map(yearData => (
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
          <div className="flex justify-end mt-4">
            <IconButton 
              onClick={() => setOpenCoffeeDialog(true)}
              color="primary"
              title="Support Us"
              className="rounded"
              style={{ backgroundColor: '#1b3034', color: '#ffffff' }}
            >
              <DownloadIcon />
            </IconButton>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog
        open={openCoffeeDialog}
        onClose={() => setOpenCoffeeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Support Us</DialogTitle>
        <DialogContent style={{ backgroundColor: '#1b3034', padding: '20px', borderRadius: '8px' }}>
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
