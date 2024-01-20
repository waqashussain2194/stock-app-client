import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import io from 'socket.io-client';
import { Grid } from '@mui/material';


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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stocks');
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
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to the Socket.IO server');
    });

    socket.on('stocks', (data) => {
      console.log('Data Received ========================',data);
      setStocks(data);
      setLastUpdateTime(new Date());
      setLoading(false);
    })

    socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      setError(error.message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the Socket.IO server');
    });

    return () => {
      socket.disconnect();
    };
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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Stock Data</Typography>
      {lastUpdateTime && (
        <Typography variant="subtitle1">
          Stocks data updated {elapsedTime} seconds ago
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell >Identifier</TableCell>
                  <TableCell >Open</TableCell>
                  {/* <TableCell >Day High</TableCell> */}
                  {/* <TableCell >Day Low</TableCell> */}
                  <TableCell >Last Price</TableCell>

                  <TableCell >Change</TableCell>
                  <TableCell >Price Change</TableCell>
                  {/* <TableCell >Total Traded Volume</TableCell> */}
                  {/* <TableCell >Total Traded Value</TableCell> */}
                  <TableCell >Last Update Time</TableCell>
                  {/* <TableCell >Per Change 365d</TableCell> */}
                  {/* <TableCell >Per Change 30d</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map((stock, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {stock.symbol}
                    </TableCell>
                    <TableCell >{stock.identifier}</TableCell>
                    <TableCell >{stock.open}</TableCell>
                    {/* <TableCell >{stock.dayHigh}</TableCell> */}
                    {/* <TableCell >{stock.dayLow}</TableCell> */}
                    <TableCell >{stock.lastPrice}</TableCell>

                    <TableCell >{stock.change}</TableCell>
                    <TableCell >{stock.pChange}</TableCell>
                    {/* <TableCell >{stock.totalTradedVolume}</TableCell> */}
                    {/* <TableCell >{stock.totalTradedValue}</TableCell> */}
                    <TableCell >{stock.lastUpdateTime}</TableCell>
                    {/* <TableCell >{stock.perChange365d}</TableCell> */}
                    {/* <TableCell >{stock.perChange30d}</TableCell> */}

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4">Right Side Content</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
