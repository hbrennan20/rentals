'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Pagination, 
    Box, 
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Button
} from '@mui/material';

const HistoricContracts = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 15;  // Changed from 20 to 15
    const [filters, setFilters] = useState({
        county: '',
        minPrice: '',
        maxPrice: '',
        dateFrom: '',
        dateTo: ''
    });
    const [countyOptions] = useState([
        'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry',
        'Donegal', 'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare',
        'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo',
        'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary',
        'Tyrone', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
    ]);

    const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(filters.county && { county: filters.county }),
                ...(filters.minPrice && { minPrice: filters.minPrice }),
                ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
                ...(filters.dateTo && { dateTo: filters.dateTo }),
            });

            const response = await axios.get(`/api/contracts?${queryParams}`);
            setData(response.data.data);
            setTotalRecords(response.data.total);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, filters]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFilters = {
            ...filters,
            [event.target.name]: event.target.value
        };
        setFilters(newFilters);
        setPage(1);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Historic Contracts
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Total Records: {(totalRecords / 1000).toFixed(1)}k
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <FormControl fullWidth>
                                <InputLabel>County</InputLabel>
                                <Select
                                    name="county"
                                    value={filters.county}
                                    label="County"
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="">All Counties</MenuItem>
                                    {countyOptions.map((county) => (
                                        <MenuItem key={county} value={county}>
                                            {county}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <TextField
                                fullWidth
                                name="minPrice"
                                label="Min Price"
                                type="number"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <TextField
                                fullWidth
                                name="maxPrice"
                                label="Max Price"
                                type="number"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <TextField
                                fullWidth
                                name="dateFrom"
                                label="Date From"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={filters.dateFrom}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <TextField
                                fullWidth
                                name="dateTo"
                                label="Date To"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={filters.dateTo}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>County</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((contract, index) => (
                            <TableRow key={index}>
                                <TableCell>{contract.address}</TableCell>
                                <TableCell>{new Date(contract.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {contract.price !== null && contract.price !== undefined 
                                        ? `€${contract.price.toLocaleString()}`
                                        : `N/A (${JSON.stringify(contract.price)})`}
                                </TableCell>
                                <TableCell>{contract.county}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </div>
    );
};

export default HistoricContracts;
