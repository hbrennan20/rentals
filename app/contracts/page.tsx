'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  TextField,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer as MuiTableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip
} from 'recharts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { useRouter } from 'next/navigation';

// Add this function at the top of your file
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).format(value);
};

// Add these new styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(8),
  },
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  overflowX: 'auto',
}));

// Update the contract type to Contract
type Contract = {
  id: number;
  contractNumber: string;
  department: string;
  contractor: string;
  description: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
};

// Add this function for sorting
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Update the sample data
const sampleContracts: Contract[] = [
  { id: 1, contractNumber: "GOV-2023-001", department: "Defense", contractor: "Lockheed Martin", description: "Fighter Jet Development", startDate: "2023-01-15", endDate: "2025-01-14", value: 1500000000, status: "Active" },
  { id: 2, contractNumber: "GOV-2023-002", department: "Health", contractor: "Pfizer", description: "Vaccine Research", startDate: "2023-02-20", endDate: "2024-02-19", value: 500000000, status: "Active" },
  { id: 3, contractNumber: "GOV-2023-003", department: "Transportation", contractor: "Boeing", description: "Airport Infrastructure", startDate: "2023-03-10", endDate: "2026-03-09", value: 2000000000, status: "Active" },
  { id: 4, contractNumber: "GOV-2023-004", department: "Energy", contractor: "General Electric", description: "Wind Turbine Installation", startDate: "2023-04-05", endDate: "2024-10-04", value: 750000000, status: "Active" },
  { id: 5, contractNumber: "GOV-2023-005", department: "Education", contractor: "Pearson", description: "Digital Learning Platform", startDate: "2023-05-12", endDate: "2025-05-11", value: 300000000, status: "Active" },
  { id: 6, contractNumber: "GOV-2023-006", department: "Agriculture", contractor: "John Deere", description: "Agricultural Equipment Supply", startDate: "2023-06-18", endDate: "2024-06-17", value: 400000000, status: "Active" },
  { id: 7, contractNumber: "GOV-2023-007", department: "Homeland Security", contractor: "Palantir", description: "Data Analytics System", startDate: "2023-07-22", endDate: "2026-07-21", value: 600000000, status: "Active" },
  { id: 8, contractNumber: "GOV-2023-008", department: "NASA", contractor: "SpaceX", description: "Mars Mission Support", startDate: "2023-08-30", endDate: "2028-08-29", value: 3000000000, status: "Active" },
];

const HomePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [startDate, setStartDate] = useState(dayjs('2023-01-01'));
  const [endDate, setEndDate] = useState(dayjs('2023-06-30'));
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Contract>('startDate');
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [showPieChart, setShowPieChart] = useState(false);
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>(sampleContracts);
  const [showAllocation, setShowAllocation] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update the revenueData array to keep numeric values
  const revenueData = [
    { month: 'Jan 2023', revenue: 500 },
    { month: 'Feb 2023', revenue: 550 },
    { month: 'Mar 2023', revenue: 610 },
    { month: 'Apr 2023', revenue: 680 },
    { month: 'May 2023', revenue: 760 },
    { month: 'Jun 2023', revenue: 850 },
    { month: 'Jul 2023', revenue: 950 },
    { month: 'Aug 2023', revenue: 1060 },
    { month: 'Sep 2023', revenue: 1180 },
    { month: 'Oct 2023', revenue: 1310 },
    { month: 'Nov 2023', revenue: 1450 },
    { month: 'Dec 2023', revenue: 1600 },
    { month: 'Jan 2024', revenue: 1760 },
    { month: 'Feb 2024', revenue: 1930 },
    { month: 'Mar 2024', revenue: 2110 },
    { month: 'Apr 2024', revenue: 2300 },
    { month: 'May 2024', revenue: 2500 },
    { month: 'Jun 2024', revenue: 2710 },
    { month: 'Jul 2024', revenue: 2930 },
    { month: 'Aug 2024', revenue: 3160 },
    { month: 'Sep 2024', revenue: 3400 },
    { month: 'Oct 2024', revenue: 3650 },
    { month: 'Nov 2024', revenue: 3910 },
    { month: 'Dec 2024', revenue: 4180 }
  ];

  const setDateRange = (range: 'L12M' | 'L6M' | 'YTD') => {
    const today = dayjs();
    let start = dayjs();

    switch (range) {
      case 'L12M':
        start = today.subtract(1, 'year');
        break;
      case 'L6M':
        start = today.subtract(6, 'month');
        break;
      case 'YTD':
        start = dayjs(today.format('YYYY-01-01')); // January 1st of current year
        break;
    }

    setStartDate(start);
    setEndDate(today);
  };

  const filteredRevenueData = revenueData.filter((item) => {
    const itemDate = dayjs(item.month, 'MMM YYYY');
    return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
  });

  const handleDateChange = (
    date: Date | null,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (date) {
      setter(date.toISOString().split('T')[0]);
    }
  };

  const handleRequestSort = (property: keyof Contract) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = contracts.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly number[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
      setShowPieChart(newSelected.length > 0);
    } else {
      handleRowClick(id);
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/contracts/${id}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.contractor.toLowerCase().includes(filter.toLowerCase()) ||
      contract.department.toLowerCase().includes(filter.toLowerCase()) ||
      contract.description.toLowerCase().includes(filter.toLowerCase())
  );

  const selectedContracts = contracts.filter(contract => selected.includes(contract.id));
  const totalSelectedAmount = selectedContracts.reduce((sum, contract) => sum + contract.value, 0);

  const pieChartData = selectedContracts.map(contract => ({
    name: contract.contractor,
    value: contract.value,
    percentage: (contract.value / totalSelectedAmount) * 100
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Add this function to render an empty pie chart
  const renderEmptyPieChart = () => (
    <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="body1" color="text.secondary">
        Select contracts to view allocation
      </Typography>
    </Box>
  );

  // Add this function to handle the toggle change
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPercentage(event.target.checked);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DashboardContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Government Contracts Dashboard
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => router.push('/contracts/new')}
          >
            New Contract
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Contracts Table */}
          <Grid item xs={12}>
            <StyledTableContainer elevation={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Government Contracts
                </Typography>
              </Box>
              <TextField
                label="Filter by contractor, department, or description"
                variant="outlined"
                size="small"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ mb: 2 }}
              />
              <MuiTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" align="center">
                        <Checkbox
                          indeterminate={selected.length > 0 && selected.length < contracts.length}
                          checked={contracts.length > 0 && selected.length === contracts.length}
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      {['contractNumber', 'department', 'contractor', 'description', 'startDate', 'endDate', 'value', 'status'].map((headCell) => (
                        <TableCell
                          key={headCell}
                          sortDirection={orderBy === headCell ? order : false}
                          align="center"
                        >
                          <TableSortLabel
                            active={orderBy === headCell}
                            direction={orderBy === headCell ? order : 'asc'}
                            onClick={() => handleRequestSort(headCell as keyof Contract)}
                          >
                            {headCell.charAt(0).toUpperCase() + headCell.slice(1)}
                            {orderBy === headCell ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredContracts
                      .slice()
                      .sort(getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((contract) => {
                        const isItemSelected = isSelected(contract.id);
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, contract.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={contract.id}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox" align="center">
                              <Checkbox checked={isItemSelected} />
                            </TableCell>
                            <TableCell align="center">{contract.contractNumber}</TableCell>
                            <TableCell align="center">{contract.department}</TableCell>
                            <TableCell align="center">{contract.contractor}</TableCell>
                            <TableCell align="center">{contract.description}</TableCell>
                            <TableCell align="center">{contract.startDate}</TableCell>
                            <TableCell align="center">{contract.endDate}</TableCell>
                            <TableCell align="center">{formatCurrency(contract.value)}</TableCell>
                            <TableCell align="center">{contract.status}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </MuiTableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredContracts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </StyledTableContainer>
          </Grid>

          {/* Portfolio Allocation Pie Chart */}
          <Grid item xs={12}>
            <StyledTableContainer elevation={3}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Portfolio Allocation
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={showPercentage}
                    onChange={handleToggleChange}
                    name="showPercentage"
                  />
                }
                label="Show Percentage"
              />
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {selected.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, name, props) => [
                          `${formatCurrency(Number(value))} (${props.payload.percentage.toFixed(2)}%)`,
                          name
                        ]}
                      />
                    </PieChart>
                  ) : (
                    renderEmptyPieChart()
                  )}
                </ResponsiveContainer>
                {selected.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {pieChartData.map((entry, index) => (
                      <Typography key={entry.name} variant="body2">
                        <span style={{ color: COLORS[index % COLORS.length], marginRight: '8px' }}>■</span>
                        {entry.name}: {showPercentage 
                          ? `${entry.percentage.toFixed(2)}%`
                          : formatCurrency(entry.value)
                        }
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </StyledTableContainer>
          </Grid>
        </Grid>
      </DashboardContainer>
    </LocalizationProvider>
  );
};

export default HomePage;
