import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, LinearProgress } from '@mui/material';
import { Stock } from '../App';

type Props = {
  stocks: Stock[];
  loading: boolean;
}

function WatchListStocks({ stocks, loading }: Props) {

  if (loading) {
    return <LinearProgress  />;
  }
  
  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Your WatchList
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell >Identifier</TableCell>
              <TableCell >Open</TableCell>
              <TableCell >Last Price</TableCell>
              <TableCell >Change</TableCell>
              <TableCell >Price Change</TableCell>
              <TableCell >Last Update Time</TableCell>
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
                <TableCell >{stock.lastPrice}</TableCell>
                <TableCell >{stock.change}</TableCell>
                <TableCell >{stock.pChange}</TableCell>
                <TableCell >{stock.lastUpdateTime}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> 
    </Box>
  )

}

export default WatchListStocks;
