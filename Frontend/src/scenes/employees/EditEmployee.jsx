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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  useNavigate,
  useLocation,
  useLoaderData,
  redirect,
} from "react-router-dom";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import Header from "../../components/Header";
import ImageUploader from "./imageUploader";
import api from "../../api";
import { useState, useEffect } from "react";

export const employeeLoader = async ({ params }) => {
  const { id } = params;
  console.log(id);

  if (!id) {
    throw new Response("Employee ID not provided", { status: 400 });
  }

  try {
    const res = await api.get(`/office-employees/${id}`);
    if (res.status !== 200) {
      throw new Error("Cannot get information of an employee");
    }

    return res.data;
  } catch {
    alert(err);
  }
};

const EditEmployee = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:800px)");

  const [image, setImage] = useState(null); // Holds the selected file
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // Holds the preview URL
  const [imageUrl, setImageUrl] = useState(null); // Holds the uploaded image URL

  const initialValue = useLoaderData();
  console.log(initialValue);

  const employeeData = {
    ...initialValue.employee,
    office_role: initialValue.office_role,
  };

  console.log(employeeData);

  useEffect(() => {
    if (employeeData) {
      console.log(employeeData.image);
      setImageUrl(employeeData.image);
    }
  }, [employeeData]);

  const handleSubmit = async (values, { resetForm }) => {
    console.log(values);

    try {
      const data = {
        office_role: values.office_role,
        employee: {
          ...values,
          role: "office staff",
        },
      };
      console.log(data);

      const res = await api.patch(
        `/office-employees/${initialValue.office_staff_id}/ `,
        data
      );

      if (res.status === 200) {
        alert("Changes have been saved");
        return navigate("/office-employees");
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const handleEditSubmit = async (values, { resetForm }) => {
    console.log(values);
  };

  //   const initialValue = {
  //     image: "",
  //     last_name: "",
  //     first_name: "",
  //     middle_name: "",
  //     birthday: "",
  //     gender: "M",
  //     contact_number: "",
  //     is_active: true,
  //     role: "admin",
  //     date_started: new Date().toISOString().split("T")[0],
  //   };

  const employeeSchema = yup.object().shape({
    image: yup.string(),
    last_name: yup.string().required("Last Name is Required"),
    first_name: yup.string().required("First Name is Required"),
    middle_name: yup.string().required("Middle Name is Required"),
    birthday: yup.date().required("Birthday is Required"),
    gender: yup.string(),
    contact_number: yup.string().required("Phone number is Required"),
    isActive: yup.boolean(),
    office_role: yup.string().required("First Name is Required"),
  });

  return (
    <Box
      // borderRadius="20px"
      sx={{
        borderRadius: "20px",
        p: "20px",
        m: "30px",
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
        <Header
          title="Edit Office Employee"
          subTitle="Updating the information of an Office Employee"
        />
        <IconButton
          sx={{ width: "70px", mb: "30px" }}
          onClick={() => {
            navigate("/office-employees");
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>

      <Formik
        onSubmit={handleSubmit}
        initialValues={employeeData}
        validationSchema={employeeSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
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
                errors={errors}
                touched={touched}
                folder="employees"
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                error={!!touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name="first_name"
                error={!!touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middle_name}
                name="middle_name"
                error={!!touched.middle_name && !!errors.middle_name}
                helperText={touched.middle_name && errors.middle_name}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Birthday"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.birthday}
                name="birthday"
                error={!!touched.birthday && !!errors.birthday}
                helperText={touched.birthday && errors.birthday}
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
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.gender && !!errors.gender}
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
                {" "}
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={values.office_role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.office_role && !!errors.office_role}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="dispatcher">Dispatcher</MenuItem>
                  <MenuItem value="liaison">Liaison</MenuItem>
                  <MenuItem value="mekaniko">Mekaniko</MenuItem>
                </Select>
                {touched.role && errors.role && (
                  <Typography color="error">{errors.role}</Typography>
                )}
              </FormControl>

              {/* <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  name="phoneNumber"
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  sx={{ gridColumn: "span 1" }}
                /> */}

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
                  setFieldValue("contact_number", inputValue);
                }}
                value={values.contact_number || "+63"}
                name="contact_number"
                error={!!touched.contact_number && !!errors.contact_number}
                helperText={touched.contact_number && errors.contact_number}
                sx={{ gridColumn: "span 1" }}
              />

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              >
                <InputLabel>Active</InputLabel>
                <Select
                  name="is_active"
                  value={values.is_active}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.is_active && !!errors.is_active}
                >
                  <MenuItem value="true">Active</MenuItem>{" "}
                  <MenuItem value="false">Not Active</MenuItem>{" "}
                </Select>
                {touched.gender && errors.gender && (
                  <Typography color="error">{errors.gender}</Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Started on"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date_started}
                name="date_started"
                error={!!touched.date_started && !!errors.date_started}
                helperText={touched.date_started && errors.date_started}
                sx={{ gridColumn: "span 1" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="10px">
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditEmployee;
