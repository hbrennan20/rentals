import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

// Update the interface to match the CSV structure
interface PropertyRecord {
  'Date of Sale (dd/mm/yyyy)': string;
  'Address': string;
  'County': string;
  'Eircode': string;
  'Price': string;
  'Not Full Market Price': string;
  'VAT Exclusive': string;
  'Description of Property': string;
  'Property Size Description': string;
}

// Add new interface for filters
interface FilterParams {
  county?: string;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Add new interface for sorting parameters
interface SortParams {
  sortBy?: keyof PropertyRecord; // Assuming PropertyRecord keys are sortable
  sortOrder?: 'asc' | 'desc';
}

async function loadDataIntoCache() {
  const csvPath = path.join(process.cwd(), 'county_year_prices.csv');
  
  return new Promise((resolve, reject) => {
    const results: PropertyRecord[] = [];
    
    // Verify file exists
    if (!createReadStream(csvPath)) {
      reject(new Error(`CSV file not found at path: ${csvPath}`));
      return;
    }

    const parser = parse({ columns: true, skip_empty_lines: true, trim: true, bom: true });

    createReadStream(csvPath)
      .pipe(parser)
      .on('data', (data: PropertyRecord) => results.push(data))
      .on('end', () => {
        const processedData = results.map(record => ({
          date: record.Year,
          address: record.Address,
          county: record.County,
          price: Number(record.Median_Price),
          count: Number(record.Count),
        }));
        
        resolve(processedData);
      })
      .on('error', reject);
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Remove page and limit params, only keep filters
    const filters: FilterParams = {
      county: searchParams.get('county') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };

    const data = await loadDataIntoCache();
    
    // Apply filters
    let filteredData = data.filter(record => {
      let matches = true;
      if (filters.county) matches = matches && record.county.toLowerCase() === filters.county.toLowerCase();
      if (filters.minPrice) matches = matches && record.price >= filters.minPrice;
      if (filters.maxPrice) matches = matches && record.price <= filters.maxPrice;
      if (filters.dateFrom) matches = matches && new Date(record.date) >= new Date(filters.dateFrom);
      if (filters.dateTo) matches = matches && new Date(record.date) <= new Date(filters.dateTo);
      return matches;
    });

    return NextResponse.json({
      data: filteredData,
      total: filteredData.length
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 