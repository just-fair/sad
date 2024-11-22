import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/logForm.css";

const LogForm = () => {
  const [formData, setFormData] = useState({
    timeIn: "",
    status: "",
    gas: "",
    image: null, //IMAGE STORE
  });

  const navigate = useNavigate();
  const location = useLocation();
  const plateNumber = location.state?.plateNumber || null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0], // SAVE THE IMAGE
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    console.log(location);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(`Form submitted: ${JSON.stringify(formData, null, 2)}`);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <h2 className="header">Log Form</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* plate no */}
        <div className="fixedField">
          <label className="label">Plate Number:</label>
          <span className="fixedValue">{plateNumber}</span>
        </div>

        {/* driver name */}
        <div className="fixedField">
          <label className="label">Driver Name:</label>
          <span className="fixedValue">Tristan Golifardo</span>
        </div>

        {/* time-in */}
        <div className="formGroup">
          <label>Time-In:</label>
          <input
            type="time"
            name="timeIn"
            value={formData.timeIn}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* status */}
        <div className="formGroup">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select Status</option>
            <option value="On Duty">On Duty</option>
            <option value="In Repair">In Repair</option>
          </select>
        </div>

        {/* gas */}
        <div className="formGroup">
          <label>Gas (Liters):</label>
          <input
            type="number"
            name="gas"
            value={formData.gas}
            onChange={handleChange}
            className="input"
            placeholder="Enter gas used/added"
          />
        </div>

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

        {/* submit and cancel*/}
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
