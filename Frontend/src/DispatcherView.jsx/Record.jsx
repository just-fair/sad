import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import moment from "moment";
import { Box } from "@mui/material";

const Record = ({ record }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Box sx={{ display: "flex", gap: "15px" }}>
          <Box sx={{ width: "32%" }}>
            <Typography variant="p">
              {moment(
                record.park_or_dispatch === "dispatch"
                  ? record.time_out
                  : record.time_in
              ).format("MMMM D, YYYY, h:mm A")}
            </Typography>
          </Box>
          <Typography>{record.taxi_details.plate_number}</Typography>
          {/* <Typography>{record.driver_details.employee.last_name}</Typography> */}
          <Typography>{record.park_or_dispatch}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {Object.entries(record).map(([key, value]) => {
            if (key === "taxi_details") {
              return (
                <Typography
                  key={key}
                >{`Taxi: ${value.plate_number}`}</Typography>
              );
            }

            if (key === "driver_details") {
              return (
                <Typography key={key}>
                  {`Driver: ${value.employee.last_name}, ${value.employee.first_name} ${value.employee.middle_name}`}
                </Typography>
              );
            } else
              return <Typography key={key}>{`${key}: ${value}`}</Typography>;
          })}
        </Box>
        {/* <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography> */}
      </AccordionDetails>
    </Accordion>
  );
};

export default Record;
