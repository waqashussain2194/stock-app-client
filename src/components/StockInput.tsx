import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Box, Typography } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { Stock } from '../App';

interface State extends SnackbarOrigin {
  open: boolean;
}

type Props = {
  setStocks: (watchListStocks: Stock[]) => void;
  stocks: Stock[];
}

function StockInput({ stocks, setStocks }: Props) {

  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [stockSymbols, setStockSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [symbolsLoading, setSymbolsLoading] = useState(false);
  const [symbolsError, setSymbolsError] = useState(null);
  const [snackBarState, setSnackBarState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = snackBarState;
  
  useEffect(() => {
    const fetchStocksSymbols = async () => {
      try {
        setSymbolsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/stocks`);
        setStockSymbols(response.data.map((stock: Stock) => stock.symbol));
        setAllStocks(response.data);
        setSymbolsLoading(false);
      } catch (err: any) {
        setSymbolsError(err.message);
        setSymbolsLoading(false);
      }
    };

    fetchStocksSymbols();
  },[])
  

  const saveStockSymbol = async (symbol: string) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/stocks`, { symbol });
      const selectedStocks = allStocks.filter(stock => stock.symbol === symbol);
      setStocks([...stocks, ...selectedStocks]);
      setSnackBarState({ vertical: 'top', horizontal: 'center', open: true });
    } catch (err: any) {
      setSymbolsError(err.message);
    }
  };

  const handleSymbolChange = async (event: any) => {
    setSelectedSymbol(event.target.value as string);
    await saveStockSymbol(event.target.value);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setSnackBarState({ ...snackBarState, open: false });
  };

  if (symbolsError) {
    return  <Alert severity="error">Something Went Wrong...</Alert>
  }
  
  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Symbol Successfully Addded To Your WatchList!"
        key={vertical + horizontal}
      />
      <Typography variant="h5" mb={2}>
        Add Stocks In Your WatchList
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="stock-symbol-select-label">Stock Symbol</InputLabel>
        <Select
          labelId="stock-symbol-select-label"
          id="stock-symbol-select"
          value={selectedSymbol}
          label="Stock Symbol"
          onChange={handleSymbolChange}
          disabled={symbolsLoading}
        >
          {stockSymbols.map((symbol) => (
            <MenuItem key={symbol} value={symbol}>
              {symbol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )

}

export default StockInput;