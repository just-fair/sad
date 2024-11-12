import { Typography, Box, useTheme } from "@mui/material";
import { token } from "../theme";

const Header = ({ title, subTitle }) => {
  const theme = useTheme();
  return (
    <Box mb="30px">
      <Typography variant="h2" fontWeight="bold" sx={{ mb: "5px" }}>
        {title}
      </Typography>
      <Typography variant="h5">{subTitle}</Typography>
    </Box>
  );
};

export default Header;
