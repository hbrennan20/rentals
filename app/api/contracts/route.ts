import { Redis } from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Add error handling for Redis connection
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

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
  const cacheKey = 'property_records';
  
  try {
    const isCached = await redis.exists(cacheKey);
    
    if (isCached) {
      const cachedData = await redis.get(cacheKey);
      if (!cachedData) throw new Error('Cached data is null');
      return JSON.parse(cachedData);
    }

    return new Promise((resolve, reject) => {
      const results: PropertyRecord[] = [];
      const csvPath = path.join(process.cwd(), 'PPR-ALL 2.csv');
      
      // Verify file exists
      if (!createReadStream(csvPath)) {
        reject(new Error(`CSV file not found at path: ${csvPath}`));
        return;
      }

      const parser = parse({ columns: true, skip_empty_lines: true, trim: true, bom: true });

      createReadStream(csvPath)
        .pipe(parser)
        .on('data', (data: PropertyRecord) => results.push(data))
        .on('end', async () => {
          try {
            const processedData = results.map(record => ({
              date: record['Date of Sale (dd/mm/yyyy)'],
              address: record.Address,
              county: record.County,
              price: parseFloat(record.Price.replace(/[€,\s]/g, '')),
            }));
            
            await redis.set(cacheKey, JSON.stringify(processedData), 'EX', 86400);
            resolve(processedData);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error('Errors in loadDataIntoCache:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    
    // Get filter parameters
    const filters: FilterParams = {
      county: searchParams.get('county') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };

    // Get sorting parameters
    const sortParams: SortParams = {
      sortBy: searchParams.get('sortBy') as keyof PropertyRecord || undefined,
      sortOrder: searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc',
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

    // Apply sorting
    if (sortParams.sortBy) {
      filteredData.sort((a, b) => {
        const aValue = a[sortParams.sortBy];
        const bValue = b[sortParams.sortBy];

        if (sortParams.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    const startIndex = (page - 1) * limit;
    const paginatedResults = filteredData.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedResults,
      total: filteredData.length,
      page,
      limit
    });

  } catch (error) {
    console.error('Error processing request:', error);
    // Return more detailed error message
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 