import { useEffect, useState } from "react";
import api from "../../api";
import TopBox from "./TopBox";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const TotalBoundaries = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getAllDispatchRecord = async () => {
      try {
        const res = await api.get("/dispatchment-history/");

        if (res.status === 200) {
          const allRecords = res.data;

          const daysOfWeek = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];

          const todayRecords = allRecords.filter((record) => {
            const dayToday = daysOfWeek[new Date().getDay()];
            const dayOfRecord = daysOfWeek[new Date(record.time_in).getDay()];

            console.log(dayOfRecord);

            return dayOfRecord === dayToday && record.boundary !== null;
          });

          let tempTotal = 0;

          todayRecords.forEach((record) => {
            tempTotal += Number(record.boundary);
          });

          console.log(tempTotal);
          setTotal(tempTotal);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };

    getAllDispatchRecord();
  }, []);

  return (
    <>
      <TopBox
        icon={<AttachMoneyIcon fontSize="large" />}
        value={total}
        title="Today's Total Boundary"
      />
    </>
  );
};

export default TotalBoundaries;
