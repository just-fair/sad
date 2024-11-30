import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Tile from "./Tile";
import { Box } from "@mui/material";
import { useEffect } from "react";

const Suggestions = ({ taxis }) => {
  const oldTaxi = taxis.filter((taxi) => {
    let carAge =
      (new Date() - new Date(taxi.release_year)) /
      (1000 * 60 * 60 * 24 * 365.25);
    return carAge > 13;
  });

  return (
    <Box mb="20px">
      <Accordion>
        <AccordionSummary expandIcon={<KeyboardDoubleArrowDownIcon />}>
          <Typography sx={{ textAlign: "center" }}>Suggestions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {oldTaxi.map((taxi) => (
            <Tile taxi={taxi} key={taxi.taxi_id} />
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Suggestions;
