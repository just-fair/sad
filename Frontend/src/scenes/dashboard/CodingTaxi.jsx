import { useEffect, useState } from "react";
import api from "../../api";
import TopBox from "./TopBox";
import CarRepairIcon from "@mui/icons-material/CarRepair";

const CodingTaxi = () => {
  const [availableTaxi, setAvailableTaxi] = useState([]);

  useEffect(() => {
    const getAllTaxi = async () => {
      try {
        const res = await api.get("/taxis/");

        if (res.status === 200) {
          const allTaxi = res.data;
          console.log(allTaxi);

          const daysOfWeek = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];

          const available = allTaxi.filter((taxi) => {
            const dayToday = daysOfWeek[new Date().getDay()];
            console.log(dayToday);

            return taxi.day_of_coding === dayToday;
          });

          setAvailableTaxi(available);
          console.log(availableTaxi);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };

    getAllTaxi();
  }, []);

  return (
    <>
      <TopBox
        icon={<CarRepairIcon fontSize="large" />}
        value={availableTaxi.length}
        title="Coding"
      />
    </>
  );
};

export default CodingTaxi;
