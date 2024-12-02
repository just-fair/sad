import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box } from "@mui/material";
import api from "../../api";

const RecordsLineChart = () => {
  const [currentMonthTotals, setCurrentMonthTotals] = useState([]);
  const [previousMonthTotals, setPreviousMonthTotals] = useState([]);

  useEffect(() => {
    const getAllDispatchRecord = async () => {
      try {
        const res = await api.get("/dispatchment-history/");

        if (res.status === 200) {
          const allRecords = res.data;
          const currentMonth = new Date().getMonth();
          const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

          const filterRecordsByMonth = (month) => {
            return allRecords.filter((record) => {
              const recordDate = new Date(record.time_in);
              return (
                recordDate.getMonth() === month && record.boundary !== null
              );
            });
          };

          const calculateDailyTotals = (records) => {
            const dailySums = Array(31).fill(0);
            records.forEach((record) => {
              const dayOfMonth = new Date(record.time_in).getDate();
              dailySums[dayOfMonth - 1] += parseFloat(record.boundary);
            });
            return dailySums.filter((val) => val > 0); // Only keep filled days
          };

          const currentMonthRecords = filterRecordsByMonth(currentMonth);
          const previousMonthRecords = filterRecordsByMonth(previousMonth);

          setCurrentMonthTotals(calculateDailyTotals(currentMonthRecords));
          setPreviousMonthTotals(calculateDailyTotals(previousMonthRecords));
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };

    getAllDispatchRecord();
  }, []);

  return (
    <Box height="350px" m="-20px 0 0 0">
      <LineChart
        // xAxis={[{ data: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`) }]}
        series={[
          {
            data: currentMonthTotals,
            label: "Current Month",
            color: "#59a14f",
          },
          {
            data: previousMonthTotals,
            label: "Previous Month",
            color: "#76b7b2",
          },
        ]}
        sx={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default RecordsLineChart;
