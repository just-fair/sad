import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import moment from "moment";
import { Box, Typography, Grid2 } from "@mui/material";

import Chip from "@mui/material/Chip";

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

          <Chip
            label={record.park_or_dispatch === "park" ? "Parked" : "Pending"}
            color={record.park_or_dispatch === "park" ? "success" : "warning"}
            variant="outlined"
          />
        </Box>
      </AccordionSummary>
      ;
      <AccordionDetails>
        <Box>
          {Object.entries(record).map(([key, value]) => {
            // Exclude id and image fields, and handle null values as "Pending"
            if (
              key === "dispatch_id" ||
              key === "image" ||
              key === "park_or_dispatch" ||
              key === "is_short"
            )
              return null;

            // If value is null, display as "Pending"
            if (value === null) {
              value = "Pending";
            }

            // Format values for specific fields
            if (key === "taxi_details") {
              return (
                <Grid2 container key={key} spacing={2}>
                  <Grid2 xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Taxi:
                    </Typography>
                  </Grid2>
                  <Grid2 xs={8}>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {value.plate_number}
                    </Typography>
                  </Grid2>
                </Grid2>
              );
            }

            if (key === "driver_details") {
              return (
                <Grid2 container key={key} spacing={2}>
                  <Grid2 xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Driver:
                    </Typography>
                  </Grid2>
                  <Grid2 xs={8}>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {`${value.employee.last_name}, ${value.employee.first_name} ${value.employee.middle_name}`}
                    </Typography>
                  </Grid2>
                </Grid2>
              );
            }

            if (key === "time_out") {
              return (
                <Grid2 container key={key} spacing={2}>
                  <Grid2 xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Time out:
                    </Typography>
                  </Grid2>
                  <Grid2 xs={8}>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {moment(value).format("MMMM D, YYYY, h:mm A")}
                    </Typography>
                  </Grid2>
                </Grid2>
              );
            }

            if (key === "time_in") {
              return (
                <Grid2 container key={key} spacing={2}>
                  <Grid2 xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Time in:
                    </Typography>
                  </Grid2>
                  <Grid2 xs={8}>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {value !== "Pending"
                        ? moment(value).format("MMMM D, YYYY, h:mm A")
                        : value}
                    </Typography>
                  </Grid2>
                </Grid2>
              );
            }

            // For all other fields, display in key-value format
            return (
              <Grid2 container key={key} spacing={2}>
                <Grid2 xs={4}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {`${key}:`}
                  </Typography>
                </Grid2>
                <Grid2 xs={8}>
                  <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                    {value}
                  </Typography>
                </Grid2>
              </Grid2>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Record;
