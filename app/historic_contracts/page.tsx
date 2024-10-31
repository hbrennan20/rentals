'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client/client'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const parseCSV = (text: string): any[] => {
  if (!text || text.trim() === '') {
    console.error('Received empty CSV text');
    return [];
  }
  
  const rows = text.split('\n').map(row => row.split(','));
  if (rows.length < 2) {
    console.error('CSV has insufficient data:', rows);
    return [];
  }
  
  const headers = rows[0];
  console.log('CSV Headers:', headers);
  return rows.slice(1).map(row => {
    return headers.reduce((acc, header, index) => {
      acc[header] = row[index];
      return acc;
    }, {} as any);
  });
}

const aggregateAwardsByYear = (contracts: any[]) => {
  const awardsByYear: { [key: string]: number } = {};

  contracts.forEach(contract => {
    const year = new Date(contract.YEAR).getFullYear(); // Assuming YEAR is a valid date string
    const award = parseFloat(contract.AWARD_VALUE_EURO) || 0;

    if (!awardsByYear[year]) {
      awardsByYear[year] = 0;
    }
    awardsByYear[year] += award;
  });

  return Object.entries(awardsByYear).map(([year, total]) => ({ year, total }));
}

export default function HistoricContracts() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        console.log('Starting fetch...');
        const { data, error } = await supabase
          .storage
          .from('irish_contracts')
          .download('test.csv')
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (!data) {
          console.error('No data received from Supabase');
          return;
        }
        
        console.log('CSV file downloaded successfully');
        
        const text = await data.text();
        console.log('CSV Text length:', text.length);
        console.log('First 200 characters:', text.substring(0, 200));
        
        const parsedData = parseCSV(text);
        console.log('Parsed Data:', parsedData);
        setContracts(parsedData);
      } catch (error) {
        console.error('Error fetching contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const aggregatedData = aggregateAwardsByYear(contracts);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Historic Contracts</h1>
      </div>

      <div className="bg-gray-50 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option disabled selected>Select Year</option>
              <option value="">All Years</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option disabled selected>Select Amount</option>
              <option value="">All Amounts</option>
              <option value="100000">€100,000+</option>
              <option value="500000">€500,000+</option>
              <option value="1000000">€1,000,000+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <BarChart width={1000} height={400} data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis 
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
            allowDecimals={false} 
            width={80} // Adjust width to prevent cutoff
          />
          <Tooltip formatter={(value: any) => `${(Number(value) / 1000000).toFixed(1)}M`} />
          <Bar dataKey="total" fill="#1b3135" />
        </BarChart>
      </div>
      <p className="text-sm text-gray-600">Was only able to get the first 1000 lines - took ages to load otherwise</p>

      <div className="mt-8">
        <Accordion 
          expanded={isAccordionOpen} 
          onChange={() => setIsAccordionOpen(!isAccordionOpen)}
          style={{ width: '100%', margin: '0 auto' }} // Changed width to 100%
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{isAccordionOpen ? 'Hide Contracts' : 'Show Contracts'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
              <Table className="min-w-full bg-white border border-gray-300">
                <TableHead>
                  <TableRow>
                    {contracts.length > 0 &&
                      Object.keys(contracts[0]).map((header) => (
                        <TableCell key={header} className="text-left">
                          {header}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts.map((contract, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                      {
                        Object.keys(contract).map((key) => (
                          <TableCell key={key}>
                            {contract[key]}
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}  