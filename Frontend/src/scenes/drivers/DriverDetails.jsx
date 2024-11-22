import React from "react";
import Header from "../../components/Header";
import { useOutletContext } from "react-router-dom";
import api from "../../api";

export const driverInfoLoader = async ({ params }) => {
  const { id } = params;
  console.log(id);

  try {
    const res = await api.get(`/drivers/${id}`);

    if (res.status === 200) {
      console.log(res);
      return res.data;
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

const DriverDetails = () => {
  return (
    <div>
      <h1>sample</h1>
      <Header title="Driver Details" subTitle="sample wala na ako maisip" />
    </div>
  );
};

export default DriverDetails;
