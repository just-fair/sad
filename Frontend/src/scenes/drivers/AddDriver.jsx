import {
  IconButton,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Autocomplete,
  colors,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import Header from "../../components/Header";
import ImageUploader from "../employees/ImageUploader";
import api from "../../api";
import { useEffect, useState, useRef } from "react";

export const loader = async () => {
  try {
    const res = await api.get("/taxis/");

    if (res.status === 200) {
      console.log(res);
      return res.data;
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

const AddDriver = () => {
  const taxis = useLoaderData();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isNonMobile = useMediaQuery("(min-width:800px)");

  const driver = location.state ? location.state.driver : null;
  const editMode = location.state ? location.state.editable : true;
  const driverImage = driver ? driver.employee.imaeg : null;

  const [image, setImage] = useState(null); // Holds the selected file
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // Holds the preview URL
  const [imageUrl, setImageUrl] = useState(driverImage); // Holds the uploaded image URL

  const [editable, setEditable] = useState(editMode); // Controls field editability
  const [taxiOptions, setTaxiOptions] = useState([]);

  const [formikTypeOfDriver, setFormikTypeOfDriver] = useState("daily");

  const [showSaveCancelBtn, setShowSaveCancelBtn] = useState(false);

  useEffect(() => {
    console.log(driver);
    // isipan ng way pano ifilter yung available na taxi base sa type of driver
    const maxDriver = formikTypeOfDriver === "daily" ? 0 : 1;

    const availableTaxis = taxis.filter((taxi) => {
      if (formikTypeOfDriver === "daily") {
        return taxi.drivers.length === 0;
      } else if (formikTypeOfDriver === "alternate") {
        if (taxi.travel_type === "alternate") {
          return taxi.drivers.length <= 1;
        } else {
          return taxi.drivers.length === 0;
        }
      }
    });

    console.log(availableTaxis);

    setTaxiOptions(availableTaxis);
  }, [formikTypeOfDriver]);

  const initialValue = {
    employee: {
      last_name: "",
      first_name: "",
      middle_name: "",
      gender: "M",
      contact_number: "",
      is_active: true,
      role: "driver",
      image: "",
      date_started: new Date().toISOString().split("T")[0],
      birthday: "",
    },
    taxi: null,
    license_number: "",
    type_of_driver: "daily",
    pondo: 0,
  };

  const driverSchema = yup.object().shape({
    employee: yup.object({
      image: yup.string(),
      last_name: yup.string().required("Last Name is Required"),
      first_name: yup.string().required("First Name is Required"),
      middle_name: yup.string().required("Middle Name is Required"),
      birthday: yup.date().required("Birthday is Required"),
      gender: yup.string(),
      contact_number: yup.string().required("Phone number is Required"),
      isActive: yup.boolean(),
      role: yup.string().required("First Name is Required"),
      date_started: yup.date().required("Date started is Required"),
    }),
    taxi: yup.object(),
    license_number: yup.string().required("Please provide license number"),
    pondo: yup.string().required("Please put amount in Pondo"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await api.post("/drivers/", values);

      if (res.status === 201) {
        console.log(res);
        alert("Add New Driver: Success");
        return navigate("/drivers", { state: { refresh: Date.now() } });
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleSaveChanges = async (values) => {
    try {
      const res = await api.patch(`/drivers/${values.driver_id}/`, values);

      if (res.status === 200) {
        setEditable(false);
        setShowSaveCancelBtn(false);
        alert("Updated Sucessfully");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleDelete = async (values) => {
    try {
      const res = await api.delete(`/drivers/${values.driver_id}/`);

      if (res.status === 204) {
        alert("Driver Delete: Success");
        return navigate("/drivers", { state: { refresh: Date.now() } });
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleCancel = (resetForm) => {
    resetForm();
    setEditable(false);
    setShowSaveCancelBtn(false);
  };

  return (
    <Box
      // borderRadius="20px"
      sx={{
        borderRadius: "20px",
        p: "20px",
        m: "20px",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        <Header title="Add New Driver" subTitle="Adding new Driver in GPS" />
        <IconButton
          sx={{ width: "70px", mb: "30px" }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>

      <Formik
        onSubmit={handleSubmit}
        initialValues={driver ? driver : initialValue}
        validationSchema={driverSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(6, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 6" },
              }}
            >
              <ImageUploader
                image={image}
                setImage={setImage}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                imagePreviewUrl={imagePreviewUrl}
                setImagePreviewUrl={setImagePreviewUrl}
                setFieldValue={setFieldValue}
                field="employee.image"
                errors={errors}
                touched={touched}
                folder="drivers"
                disabled={!editable}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employee.last_name}
                name="employee.last_name"
                error={
                  !!touched.employee?.last_name && !!errors.employee?.last_name
                }
                helperText={
                  touched.employee?.last_name && errors.employee?.last_name
                }
                disabled={!editable}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employee.first_name}
                name="employee.first_name"
                error={
                  !!touched.employee?.first_name &&
                  !!errors.employee?.first_name
                }
                helperText={
                  touched.employee?.first_name && errors.employee?.first_name
                }
                disabled={!editable}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employee.middle_name}
                name="employee.middle_name"
                error={
                  !!touched.employee?.middle_name &&
                  !!errors.employee?.middle_name
                }
                helperText={
                  touched.employee?.middle_name && errors.employee?.middle_name
                }
                disabled={!editable}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Birthday"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employee.birthday}
                name="employee.birthday"
                error={
                  !!touched.employee?.birthday && !!errors.employee?.birthday
                }
                helperText={
                  touched.employee?.birthday && errors.employee?.birthday
                }
                disabled={!editable}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  name="employee.gender"
                  value={values.employee.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!touched.employee?.gender && !!errors.employee?.gender
                  }
                  disabled={!editable}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
                {touched.gender && errors.gender && (
                  <Typography color="error">{errors.gender}</Typography>
                )}
              </FormControl>

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              >
                <InputLabel>Type of Driver</InputLabel>
                <Select
                  name="type_of_driver"
                  value={values.type_of_driver}
                  onChange={(e) => {
                    setFormikTypeOfDriver(e.target.value);
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  error={!!touched.type_of_driver && !!errors.type_of_driver}
                  disabled={!editable}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="alternate">Alternate</MenuItem>
                </Select>
                {touched.type_of_driver && errors.type_of_driver && (
                  <Typography color="error">{errors.type_of_driver}</Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={(e) => {
                  let inputValue = e.target.value;

                  // Ensure the value starts with '+63'
                  if (!inputValue.startsWith("+63")) {
                    inputValue = `+63${inputValue.replace(/[^0-9]/g, "")}`;
                  }

                  // Remove leading '0' immediately after '+63'
                  if (inputValue.length > 3 && inputValue[3] === "0") {
                    inputValue = "+63" + inputValue.slice(4);
                  }

                  // Restrict to numeric characters only and limit length to 14
                  inputValue = inputValue.replace(/[^0-9+]/g, "").slice(0, 13);

                  // Update Formik value
                  setFieldValue("employee.contact_number", inputValue);
                }}
                value={values.employee.contact_number || "+63"}
                name="employee.contact_number"
                error={
                  !!touched.employee?.contact_number &&
                  !!errors.employee?.contact_number
                }
                helperText={
                  touched.employee?.contact_number &&
                  errors.employee?.contact_number
                }
                disabled={!editable}
                sx={{ gridColumn: "span 1" }}
              />

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              >
                <InputLabel>Active</InputLabel>
                <Select
                  name="employee.is_active"
                  value={values.employee.is_active}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!touched.employee?.is_active &&
                    !!errors.employee?.is_active
                  }
                  disabled={!editable}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Not Active</MenuItem>
                </Select>
                {touched.employee?.gender && errors.employee?.gender && (
                  <Typography color="error">
                    {errors.employee?.gender}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Started on"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employee.date_started}
                name="employee.date_started"
                error={
                  !!touched.employee?.date_started &&
                  !!errors.employee?.date_started
                }
                helperText={
                  touched.employee?.date_started &&
                  errors.employee?.date_started
                }
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={!editable}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="License Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.license_number}
                name="license_number"
                error={!!touched.license_number && !!errors.license_number}
                helperText={touched.license_number && errors.license_number}
                sx={{ gridColumn: "span 2" }}
                disabled={!editable}
              />

              <Autocomplete
                options={taxiOptions}
                getOptionLabel={(option) => option.plate_number}
                onChange={(e, value) => setFieldValue("taxi", value)}
                value={values.taxi}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Taxi"
                    variant="filled"
                    error={!!touched.taxi && !!errors.taxi}
                    helperText={touched.taxi && errors.taxi}
                  />
                )}
                sx={{ gridColumn: "span 2" }}
                disabled={!editable}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Pondo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pondo}
                name="pondo"
                error={!!touched.pondo && !!errors.pondo}
                helperText={touched.pondo && errors.pondo}
                sx={{ gridColumn: "span 1" }}
                disabled={!editable}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="30px">
              {editMode && (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: colors.green[600] }}
                >
                  Add New Driver
                </Button>
              )}

              {!editable && (
                <Box display="flex" gap="10px" width="250px">
                  <Button
                    onClick={() => {
                      setShowSaveCancelBtn(true);
                      setEditable(true);
                    }}
                    variant="contained"
                    sx={{ bgcolor: colors.green[600], width: "50%" }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(values)}
                    variant="contained"
                    sx={{ bgcolor: colors.red[600], width: "50%" }}
                  >
                    Delete
                  </Button>
                </Box>
              )}

              {showSaveCancelBtn && (
                <Box display="flex" gap="10px" width="250px">
                  <Button
                    variant="contained"
                    onClick={() => {
                      console.log(values);
                      handleSaveChanges(values);
                    }}
                    sx={{ bgcolor: colors.green[600], width: "50%" }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleCancel(resetForm)}
                    sx={{ bgcolor: colors.red[600], width: "50%" }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddDriver;
