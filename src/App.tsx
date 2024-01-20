import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Box, Typography } from '@mui/material';
import io from 'socket.io-client';
import { Grid } from '@mui/material';
import StockInput from './components/StockInput';
import WatchListStocks from './components/WatchListStocks';

export interface Stock {
  symbol: string;
  identifier: string;
  open: number;
  dayHigh: number;
  dayLow: number;
  lastPrice: number;
  previousClose: number;
  change: number;
  pChange: number;
  yearHigh: number;
  yearLow: number;
  totalTradedVolume: number;
  totalTradedValue: number;
  lastUpdateTime: string;
  perChange365d: number;
  perChange30d: number;
}

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/stocks/watchlist`);
        setStocks(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_URL}`, { withCredentials: true });
    socket.on('FromAPI', (stocks) => {
      setStocks(stocks)
      setLastUpdateTime(new Date());
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdateTime) {
        const now = new Date();
        const diffInSeconds = Math.round((now.getTime() - lastUpdateTime.getTime()) / 1000);
        setElapsedTime(diffInSeconds);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  if (error) {
    return <Alert severity="error">Something Went Wrong...</Alert>
  }

  return (
    <Box sx={{ mx: 20, display: 'flex', flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", mb: 5 }}>
        <Typography variant="h3">
          Live Stocks Data
        </Typography>
        {lastUpdateTime && (
          <Typography variant="subtitle1">
            Stocks data updated {elapsedTime} seconds ago
          </Typography>
        )}
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <StockInput setStocks={setStocks} stocks={stocks} />
        </Grid>
        <Grid item xs={8}>
          <WatchListStocks loading={loading} stocks={stocks} />
        </Grid>
      </Grid>
    </Box>      
  );
}

export default App;
