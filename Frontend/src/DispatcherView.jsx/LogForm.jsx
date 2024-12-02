import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";
import "../styles/logForm.css";
import api from "../api";

export const dispatchTaxiLoader = async ({ params }) => {
  const { id } = params;
  try {
    const res = await api.get(`/drivers/?taxi=${id}`);

    if (res.status === 200) {
      console.log(res.data);

      return res.data;
    }
  } catch (error) {
    console.log(error.response.data);
    alert(error);
  }
};

export const currentDriverLoader = async ({ params }) => {
  const { id } = params;
  try {
    const res = await api.get(`/dispatchment-history/?taxi=${id}`);

    if (res.status === 200) {
      console.log(res.data);

      return res.data;
    }
  } catch (error) {
    console.log(error.response.data);
    alert(error);
  }
};

const LogForm = () => {
  const [drivers, setDrivers] = useState(useLoaderData()); // Loader fetches available drivers for a specific taxi
  const navigate = useNavigate();
  const location = useLocation();
  // const [newDrivers, setNewDrivers] = useState([]);

  const taxi = location.state?.taxi || null;
  const mode = location.state?.mode;

  const formatLocalDateTime = (date) => {
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    park_or_dispatch: mode,
    driver: mode === "park" ? drivers[0].driver_details.driver_id : "",
    taxi: taxi.taxi_id,
    status: "good",
    prev_gas: "",
    current_gas: "",
    boundary: "",
    time_in: null,
    time_out: formatLocalDateTime(new Date()),
    image: "",
    is_short: "",
    short_amount: "",
    gas_deficit: "",
  });

  useEffect(() => {
    // const noNull = Object.fromEntries(
    //   Object.entries(drivers[0]).map(([key, value]) => [
    //     key,
    //     value === null ? "" : value,
    //   ])
    // );

    if (mode === "park") {
      setFormData({
        ...drivers[0],
        ["park_or_dispatch"]: mode,
        ["driver"]: drivers[0].driver_details.driver_id,
        ["taxi"]: taxi.taxi_id,
        ["time_in"]: formatLocalDateTime(new Date()),
        ["time_out"]: formatLocalDateTime(new Date(drivers[0].time_out)),
        // ["current_gas"]: "",
        // ["time_in"]: drivers[0].time_in || "",
        // ["is_short"]: drivers[0].is_short || "",
        // ["short_amount"]: drivers[0].short_amount || "",
        // ["gas_deficit"]: drivers[0].gas_deficit || "",
      });
    }
    console.log(formData);

    const fetchDrivers = async () => {
      try {
        const res = await api.get(`/drivers/`);
        if (res.status === 200) {
          const temp = res.data.filter((driver) => driver.taxi === null);
          console.log(temp);

          setDrivers(temp);
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    };

    if (drivers.length === 0 && mode !== "park") {
      fetchDrivers();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "boundary") {
      if (Number(value) <= Number(taxi.target_boundary)) {
        setFormData({
          ...formData,
          [name]: value,
          ["is_short"]: true,
          ["short_amount"]: Number(taxi.target_boundary) - Number(value),
        });
      } else setFormData({ ...formData, [name]: value });
    } else if (name === "current_gas") {
      // if (mode === "park") {

      if (Number(value) <= Number(drivers[0].prev_gas)) {
        setFormData({
          ...formData,
          [name]: value,
          ["gas_deficit"]: Number(drivers[0].prev_gas) - Number(value),
        });
      } else setFormData({ ...formData, [name]: value });
      // } else setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const res =
        mode === "park"
          ? await api.patch(
              `/dispatchment-history/${drivers[0].dispatch_id}/`,
              formData
            )
          : await api.post("/dispatchment-history/", formData);
      console.log(res);

      if (res.status === 201 || res.status === 200) {
        alert("Dispatch record Saved");
        navigate("/dispatcher");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  const handleCancel = () => {
    navigate("/dispatcher");
  };

  return (
    <div className="container">
      <h2 className="header">
        {mode === "park" ? "Parking Form" : "Deployment Form"}
      </h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Driver Selection */}
        <div className="formGroup">
          <label className="label">Driver:</label>
          <select
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            className="select"
            required
            disabled={mode === "park"}
          >
            <option value="">Select a driver</option>
            {mode === "park" && (
              <option
                // selected
                value={drivers[0].driver_details.driver_id}
              >{`${drivers[0].driver_details.employee.last_name}, ${drivers[0].driver_details.employee.first_name} ${drivers[0].driver_details.employee.middle_name}`}</option>
            )}
            {mode === "dispatch" &&
              drivers.map((driver, key) => (
                <option value={driver.driver_id} key={key}>
                  {`${driver.employee.last_name}, ${driver.employee.first_name} ${driver.employee.middle_name}`}
                </option>
              ))}

            {/* {drivers.length === 0 &&
              newDrivers.length > 0 &&
              newDrivers.map((driver, key) => (
                <option value={driver.driver_id} key={key}>
                  {`${driver.employee.last_name}, ${driver.employee.first_name} ${driver.employee.middle_name}`}
                </option>
              ))} */}
          </select>
        </div>

        {/* Plate Number */}
        <div className="formGroup">
          <label className="label">Plate Number:</label>
          <input
            type="text"
            name="taxi"
            value={taxi.plate_number}
            onChange={handleChange}
            className="input"
            disabled
          />
        </div>

        {/* Status */}
        <div className="formGroup">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select"
          >
            <option value="good">Good</option>
            <option value="need maintenance">Need Maintenance</option>
          </select>
        </div>

        <div className="formGroup">
          <label>
            {mode === "park" ? "Previous Gas (Liters)" : "Gas (Liters)"}
          </label>
          <input
            disabled={mode === "park"}
            required
            type="number"
            name="prev_gas"
            value={formData.prev_gas}
            onChange={handleChange}
            className="input"
            placeholder="Gas Before travel"
          />
        </div>

        {mode === "park" && (
          <>
            {/* <div className="formGroup">
              <label>Previous Gas (Liters):</label>
              <input
                editable={false}
                type="Previo"
                name="current_gas"
                value={drivers[0].gas}
                onChange={handleChange}
                className="input"
                placeholder="Gas After travel"
              />
            </div> */}
            <div className="formGroup">
              <label>Current Gas (Liters):</label>
              <input
                type="number"
                name="current_gas"
                // value={drivers[0].gas}
                value={formData.current_gas || ""}
                onChange={handleChange}
                className="input"
                placeholder="Gas After travel"
              />
            </div>

            <div className="formGroup">
              <label>Gas Deficit (Liters):</label>
              <input
                disabled={true}
                type="number"
                name="gas_deficit"
                value={formData.gas_deficit || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          </>
        )}

        {/* Boundary */}
        {mode === "park" && (
          <>
            <div className="formGroup">
              <label>Target Boundary (PHP):</label>
              <input
                disabled
                type="number"
                name="taxboundary"
                value={drivers[0].taxi_details.target_boundary}
                className="input"
              />
            </div>
            <div className="formGroup">
              <label>Boundary (PHP):</label>
              <input
                required
                type="number"
                name="boundary"
                value={formData.boundary || ""}
                onChange={handleChange}
                className="input"
                placeholder="Enter boundary amount"
              />
            </div>

            <div className="formGroup">
              <label>Short Amount (PHP):</label>
              <input
                disabled={true}
                type="number"
                name="short_amount"
                value={formData.short_amount || ""}
                // onChange={handleChange}
                className="input"
              />
            </div>
          </>
        )}

        {mode !== "park" && (
          <div className="formGroup">
            <label>Date & Time out:</label>
            <input
              type="datetime-local"
              name="time_out"
              value={formData.time_out}
              onChange={handleChange}
              className="input"
            />
          </div>
        )}

        {mode === "park" && (
          <div className="formGroup">
            <label>Date & Time in:</label>
            <input
              type="datetime-local"
              name="time_in"
              value={formData.time_in || ""}
              onChange={handleChange}
              className="input"
            />
          </div>
        )}

        {/* Image */}
        {/* <div className="formGroup">
          <label className="label">
            Upload Taxi Image:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="input"
            />
          </label>
          {formData.image && (
            <div className="preview">
              <p>Image Preview:</p>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Taxi Preview"
                className="imagePreview"
              />
            </div>
          )}
        </div> */}

        {/* Submit and Cancel */}
        <div className="buttonContainer">
          <button type="button" onClick={handleCancel} className="cancelButton">
            Cancel
          </button>
          <button type="submit" className="button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogForm;
