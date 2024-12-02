import { Box, Typography, Card, CardContent } from "@mui/material";

const Incentives = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Typography variant="h6" gutterBottom>
          Incentives
        </Typography>
        <Typography variant="h5" color="primary">
          1 Sack Of Rice
        </Typography>
        <Typography variant="body2">
          For Driver with NO SHORT in Boundary
        </Typography>
      </Box>
    </Box>
  );
};

export default Incentives;
