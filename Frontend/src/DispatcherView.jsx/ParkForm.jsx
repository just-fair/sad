import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/parkForm.css";

const ParkForm = () => {
  const [formData, setFormData] = useState({
    timeOut: "",
    odometer: "",
    status: "Parked",
    gas: "",
    image: null,
  });

  const [previousGas, setPreviousGas] = useState(9); // previous gas

  const navigate = useNavigate();
  const location = useLocation();
  const { plateNumber } = location.state || {};

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (parseFloat(formData.gas) < previousGas) {
      alert(
        `Gas value must be greater than or equal to the previous value (${previousGas} liters).`
      );
      return;
    }

    alert(`Form submitted: ${JSON.stringify(formData, null, 2)}`);
  };

  const handleCancel = () => {
    navigate("/dispatcher");
  };

  return (
    <div className="container">
      <h2 className="header">Park Form</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* plate number from homepage */}
        <div className="fixedField">
          <label className="label">Plate Number:</label>
          <span className="fixedValue">{plateNumber}</span>
        </div>

        {/* driver name*/}
        <div className="fixedField">
          <label className="label">Driver Name:</label>
          <span className="fixedValue">Tristan Golifardo</span>
        </div>

        {/* time-out */}
        <label className="label">
          Time-Out:
          <input
            type="time"
            name="timeOut"
            value={formData.timeOut}
            onChange={handleChange}
            className="input"
          />
        </label>

        {/*odometer */}
        <label className="label">
          Odometer:
          <input
            type="number"
            name="odometer"
            value={formData.odometer}
            onChange={handleChange}
            className="input"
            placeholder="Enter odometer reading"
          />
        </label>

        {/* Status */}
        <label className="label">
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select"
            disabled
          >
            <option value="Parked">Parked</option>
          </select>
        </label>

        {/* Gas */}
        <label className="label">
          Gas (Liters):
          <input
            type="number"
            name="gas"
            value={formData.gas}
            onChange={handleChange}
            className="input"
            placeholder={`Previous gas liters: (${previousGas})`}
          />
        </label>

        {/* Image */}
        <label className="label">
          Upload Taxi Image:
          <input
            type="file"
            name="image"
            accept="image/*" //image file only
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

        {/* submit and cancel */}
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

export default ParkForm;
