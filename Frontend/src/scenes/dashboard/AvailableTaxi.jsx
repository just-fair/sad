import { useEffect, useState } from "react";
import api from "../../api";
import TopBox from "./TopBox";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";

const AvailableTaxi = () => {
  const [availableTaxi, setAvailableTaxi] = useState([]);

  useEffect(() => {
    const getAllTaxi = async () => {
      try {
        const res = await api.get("/taxis/");

        if (res.status === 200) {
          const allTaxi = res.data;

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

            return (
              taxi.day_of_coding !== dayToday && taxi.condition === "parked"
            );
          });

          setAvailableTaxi(available);
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
        icon={<LocalTaxiIcon fontSize="large" />}
        value={availableTaxi.length}
        title="Available Taxi"
      />
    </>
  );
};

export default AvailableTaxi;
