import { Box, Typography, Card, CardContent } from "@mui/material";

const GasPrice = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Typography variant="h6" gutterBottom>
          Current Gas Price
        </Typography>
        <Typography variant="h5" color="primary">
          PHP 58.90 /L
        </Typography>
        <Typography variant="body2">
          As of Nov 25, 2024 | +1.7% from last month
        </Typography>
      </Box>
    </Box>
  );
};

export default GasPrice;
