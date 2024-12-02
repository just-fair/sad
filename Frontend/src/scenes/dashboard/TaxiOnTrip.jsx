import { useEffect, useState } from "react";
import api from "../../api";
import TopBox from "./TopBox";
import MovingIcon from "@mui/icons-material/Moving";

const TaxiOnTrip = () => {
  const [availableTaxi, setAvailableTaxi] = useState([]);

  useEffect(() => {
    const getAllTaxi = async () => {
      try {
        const res = await api.get("/taxis/");

        if (res.status === 200) {
          const allTaxi = res.data;

          const available = allTaxi.filter((taxi) => {
            return taxi.condition === "deployed";
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
        icon={<MovingIcon fontSize="large" />}
        value={availableTaxi.length}
        title="Taxi On Travel"
      />
    </>
  );
};

export default TaxiOnTrip;
