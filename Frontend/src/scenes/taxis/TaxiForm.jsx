import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  colors,
  useTheme,
} from "@mui/material";

import Grid from "@mui/material/Grid2";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const TaxiForm = ({ taxi, editable = true, action = "add" }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [editMode, setEditMode] = useState(editable);
  const [showSaveCancelbtn, setShowSaveCancelBtn] = useState(false);

  const initialValues = {
    brand: "",
    model: "",
    release_year: "",
    plate_number: "",
    condition: "parked",
    day_of_coding: "monday",
    travel_type: "daily",
    target_boundary: 1000,
  };

  const validationSchema = Yup.object({
    brand: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    model: Yup.string()
      .max(100, "Must be 100 characters or less")
      .required("Required"),
    release_year: Yup.date().required("Required"),
    plate_number: Yup.string()
      .matches(/^[A-Z]{3} [0-9]{3||4}$/, "Must be in the format 'ABC 1234'")
      .required("Required"),
    condition: Yup.string()
      .oneOf(["parked", "repairing", "coding", "deployed"])
      .required("Required"),
    day_of_coding: Yup.string()
      .oneOf(["monday", "tuesday", "wednesday", "thursday", "friday"])
      .required("Required"),
    travel_type: Yup.string()
      .oneOf(["daily", "alternate"])
      .required("Required"),
    target_boundary: Yup.number().required("Required field"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Form data:", values);
    try {
      const res = await api.post("/taxis/", values);

      if (res.status === 201) {
        alert("Success");
        resetForm();
        return;
      }
    } catch (error) {
      alert(error.response.data);
      console.log(error.response.data);
    }
  };

  const handleDelete = async (values) => {
    try {
      const res = await api.delete(`/taxis/${values.taxi_id}/`);

      if (res.status === 204) {
        alert("Taxi Deleted Successfully");
        return navigate("/taxis", { state: { refresh: Date.now() } });
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const res = await api.patch(`/taxis/${values.taxi_id}/`, values);

      if (res.status === 200) {
        alert("Successfully updated");
        setEditMode(false);
        setShowSaveCancelBtn(false);
      }
    } catch (error) {
      console.log(error.response.data);
      alert(error);
    }
  };

  const formatPlateNumber = (value) => {
    if (!value) return "";
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const letters = cleaned.substring(0, 3);
    const numbers = cleaned.substring(3, 7);
    return letters + (letters.length === 3 ? " " : "") + numbers;
  };

  const getDayOfCoding = (plateNumber) => {
    const lastDigit = plateNumber.charAt(plateNumber.length - 1);
    switch (lastDigit) {
      case "1":
      case "2":
        return "monday";
      case "3":
      case "4":
        return "tuesday";
      case "5":
      case "6":
        return "wednesday";
      case "7":
      case "8":
        return "thursday";
      case "9":
      case "0":
        return "friday";
      default:
        return "monday"; // Default to Monday if the plate number is invalid
    }
  };

  return (
    <Formik
      initialValues={taxi ? taxi : initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        resetForm,
      }) => (
        <Form>
          <Grid container spacing={{ xs: 2, md: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="brand"
                name="brand"
                label="Brand"
                value={values.brand}
                onChange={handleChange}
                error={touched.brand && Boolean(errors.brand)}
                helperText={touched.brand && errors.brand}
                disabled={!editMode}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="model"
                name="model"
                label="Model"
                value={values.model}
                onChange={handleChange}
                error={touched.model && Boolean(errors.model)}
                helperText={touched.model && errors.model}
                disabled={!editMode}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                id="release_year"
                name="release_year"
                label="Release Year"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={values.release_year}
                onChange={handleChange}
                error={touched.release_year && Boolean(errors.release_year)}
                helperText={touched.release_year && errors.release_year}
                disabled={!editMode}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                id="plate_number"
                name="plate_number"
                label="Plate Number"
                placeholder="ABC 1234"
                value={values.plate_number}
                onChange={(e) => {
                  const plateNumber = formatPlateNumber(e.target.value);
                  setFieldValue("plate_number", plateNumber);

                  const day = getDayOfCoding(plateNumber);
                  setFieldValue("day_of_coding", day);
                }}
                error={touched.plate_number && Boolean(errors.plate_number)}
                helperText={touched.plate_number && errors.plate_number}
                disabled={!editMode}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="condition-label">Condition</InputLabel>
                <Select
                  labelId="condition-label"
                  id="condition"
                  name="condition"
                  value={values.condition}
                  onChange={handleChange}
                  error={touched.condition && Boolean(errors.condition)}
                  disabled={!editMode}
                >
                  <MenuItem value="parked">Parked</MenuItem>
                  <MenuItem value="repairing">Repairing</MenuItem>
                  <MenuItem value="coding">Coding</MenuItem>
                  <MenuItem value="deployed">Deployed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="day_of_coding-label">Day of Coding</InputLabel>
                <Select
                  labelId="day_of_coding-label"
                  id="day_of_coding"
                  name="day_of_coding"
                  value={values.day_of_coding}
                  onChange={handleChange}
                  error={touched.day_of_coding && Boolean(errors.day_of_coding)}
                  disabled={!editMode}
                >
                  <MenuItem value="monday">Monday</MenuItem>
                  <MenuItem value="tuesday">Tuesday</MenuItem>
                  <MenuItem value="wednesday">Wednesday</MenuItem>
                  <MenuItem value="thursday">Thursday</MenuItem>
                  <MenuItem value="friday">Friday</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="travel_type-label">Travel Type</InputLabel>
                <Select
                  labelId="travel_type-label"
                  id="travel_type"
                  name="travel_type"
                  value={values.travel_type}
                  onChange={handleChange}
                  error={touched.travel_type && Boolean(errors.travel_type)}
                  disabled={!editMode}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="alternate">Alternate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                id="target_boundary"
                name="target_boundary"
                type="number"
                label="Target Boundary"
                value={values.target_boundary}
                onChange={handleChange}
                error={
                  touched.target_boundary && Boolean(errors.target_boundary)
                }
                helperText={touched.target_boundary && errors.target_boundary}
                disabled={!editMode}
              />
            </Grid>

            <Grid size={{ xs: 0, md: 6 }}></Grid>
            <Grid size={{ xs: 0, md: 9 }}></Grid>
            {action === "add" && editable && (
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ height: "100%", bgcolor: colors.green[600] }}
                >
                  Submit
                </Button>
              </Grid>
            )}

            {action === "updateDelete" && !editMode && (
              <>
                <Grid size={{ xs: 12, md: 1.5 }}>
                  <Button
                    onClick={() => {
                      setShowSaveCancelBtn(true);
                      setEditMode(true);
                    }}
                    variant="contained"
                    fullWidth
                    sx={{ height: "100%", bgcolor: colors.green[600] }}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 1.5 }}>
                  <Button
                    onClick={() => handleDelete(values)}
                    variant="contained"
                    fullWidth
                    sx={{ height: "100%", bgcolor: colors.red[600] }}
                  >
                    Delete
                  </Button>
                </Grid>
              </>
            )}

            {showSaveCancelbtn && (
              <>
                <Grid size={{ xs: 12, md: 1.5 }}>
                  <Button
                    onClick={() => handleUpdate(values)}
                    variant="contained"
                    fullWidth
                    sx={{ height: "100%", bgcolor: colors.green[600] }}
                  >
                    Save Changes
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 1.5 }}>
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowSaveCancelBtn(false);
                      setEditMode(false);
                    }}
                    variant="contained"
                    fullWidth
                    sx={{ height: "100%", bgcolor: colors.red[600] }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default TaxiForm;
