import React, { useState } from "react";
import axios from "axios";
import { Box, Modal, Button, colors, useTheme } from "@mui/material";
import ImageKit from "imagekit-javascript";
import api from "../../api";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_PUBLIC_API_KEY,
  urlEndpoint: import.meta.env.VITE_URL_END_POINT,
});

const ImageUploader = ({
  image,
  setImage,
  imagePreviewUrl,
  setImagePreviewUrl,
  imageUrl,
  setImageUrl,
  touched,
  setFieldValue,
  field = "image",
  errors,
  folder,
  disabled = false,
}) => {
  const [openModal, setOpenModal] = useState(false); // Controls the modal visibility
  const theme = useTheme();

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
    setImagePreviewUrl(URL.createObjectURL(selectedFile)); // Set the preview URL
    setOpenModal(true); // Open the confirmation modal
  };

  const handleConfirmUpload = async () => {
    if (!image) return;

    try {
      console.log(image);

      const tokenResponse = await api.get("/image-upload-token/");
      const { token, signature, expire } = tokenResponse.data;
      const authParam = { token, signature, expire };
      console.log(authParam);

      const response = await imagekit.upload({
        file: image,
        fileName: image.name,
        folder: `/gps/${folder}`,
        token,
        signature,
        expire,
      });

      const uploadedImageUrl = response.url;
      setImageUrl(uploadedImageUrl);
      setFieldValue(field, uploadedImageUrl);
      setOpenModal(false);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image", error);
      alert("Failed to upload image.");
    }
  };

  const handleCancelUpload = () => {
    setOpenModal(false);
    setImage(null);
  };

  return (
    <Box
      sx={{
        width: "150px",
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        gridColumn: "span 6",
      }}
    >
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        disabled={disabled}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
        }}
      />

      {/* Show the uploaded image once it's confirmed */}

      {!imageUrl && (
        <Box
          sx={{
            textAlign: "center",
            color: "#aaa",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          <ImageOutlinedIcon
            sx={{ fontSize: "70px", mt: "10px", mb: "-10px" }}
          />
          <p>Drop image here</p>
          <p>or click to upload</p>
        </Box>
      )}
      {/* {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />} */}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Error display if any */}
      {touched.image && errors.image && (
        <div style={{ color: "red" }}>{errors.image}</div>
      )}

      {/* Modal for image confirmation */}
      <Modal open={openModal} onClose={handleCancelUpload}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            padding: "20px",
            boxShadow: 24,
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
          }}
        >
          <h3>Confirm Image Upload</h3>
          {imagePreviewUrl && (
            <div>
              <img src={imagePreviewUrl} alt="Preview" width="100%" />
            </div>
          )}
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.green[700] }}
              onClick={handleConfirmUpload}
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelUpload}
              style={{
                marginLeft: "10px",
                borderColor: "red",
                color: "red",
              }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageUploader;
