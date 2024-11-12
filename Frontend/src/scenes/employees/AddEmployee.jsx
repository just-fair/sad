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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import Header from "../../components/Header";

const AddEmployee = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleSubmit = async (values) => {
    console.log(values);
  };

  const initialValue = {
    image: "",
    lastName: "",
    firstName: "",
    middleName: "",
    birthday: "",
    gender: "M",
    phoneNumber: "",
    isActive: true,
    role: "admin",
  };

  const employeeSchema = yup.object().shape({
    image: yup
      .mixed()
      .required("Image is required")
      .test(
        "fileSize",
        "File too large",
        (value) => !value || (value && value.size <= 2000000)
      )
      .test(
        "fileFormat",
        "Unsupported Format",
        (value) =>
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
      ),
    lastName: yup.string().required("Last Name is Required"),
    firstName: yup.string().required("First Name is Required"),
    middleName: yup.string().required("Middle Name is Required"),
    birthday: yup.date().required("Birthday is Required"),
    gender: yup.string(),
    phoneNumber: yup.string().required("First Name is Required"),
    isActive: yup.boolean(),
    role: yup.string().required("First Name is Required"),
  });

  return (
    <Box
      sx={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
        zIndex: 2,
        padding: "20px",
        overflow: "auto",
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
          title="Add Office Employee"
          subTitle="Adding New Office Employee in GPS"
        />
        <IconButton
          onClick={() => {
            navigate("/office-employees");
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValue}
        validationSchema={employeeSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, mixmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }}
                style={{ gridColumn: "span 4" }}
              />
              {touched.image && errors.image && <div>{errors.image}</div>}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middleName}
                name="middleName"
                error={!!touched.middleName && !!errors.middleName}
                helperText={touched.middleName && errors.middleName}
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
                sx={{ gridColumn: "span 1" }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              >
                <InputLabel>Gender</InputLabel>{" "}
                <Select
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.gender && !!errors.gender}
                >
                  <MenuItem value="M">Male</MenuItem>{" "}
                  <MenuItem value="F">Female</MenuItem>{" "}
                </Select>
                {touched.gender && errors.gender && (
                  <Typography color="error">{errors.gender}</Typography>
                )}
              </FormControl>
              <TextField
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
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
              >
                {" "}
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.role && !!errors.role}
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
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" variant="contained">
                Add New Employee
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddEmployee;
