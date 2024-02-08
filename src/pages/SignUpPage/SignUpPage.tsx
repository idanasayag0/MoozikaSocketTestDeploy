import React, { useState } from "react";
import { Form, Input, DatePicker, Upload, Button, message } from "antd";
import { UserOutlined, InboxOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import axios from "axios";
import { usePost } from "../../hooks/usePost";
import { AUTH, SERVER_URL } from "../../constants";
import { Box, Button as MuiButton, Typography } from "@mui/material";
import { useNavigate } from "react-router";
const { Dragger } = Upload;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dateOfBirth: null,
    profilePicture: "",
    password: "",
    cPassword: "",
  });
  const [fileName, setFileName] = React.useState<File | null>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async () => {
    const requiredFields = [
      "email",
      "fullName",
      "dateOfBirth",
      "password",
      "cPassword",
    ];
    setIsLoading(true);
    const hasEmptyField = requiredFields.some((field) => !formData[field]);

    if (hasEmptyField || !fileName) {
      message.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.cPassword) {
      message.error("Passwords do not match");
      setIsLoading(false);

      return;
    } else {
      try {
        let imagePath = "";
        if (fileName) {
          const imageData = new FormData();
          imageData.append("file", fileName);
          await axios
            .post(`${SERVER_URL}/uploadFiles/upload`, imageData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              imagePath = `${SERVER_URL}/${res.data.file.path}`;
            });
        }

        const data = await axios
          .post(`${AUTH}/register`, {
            email: formData.email,
            name: formData.fullName,
            password: formData.password,
            profile_image: imagePath,
          })
          .then((res) => res.data)
          .catch((err) => {
            message.error(err.response.data.error);
            setIsLoading(false);
            return;
          });

        await usePost(`${AUTH}/chatRegister`, {
          username: formData.email,
          secret: formData.email,
          email: formData.email,
          first_name: formData.fullName,
          last_name: formData.email,
        });

        usePost(`${AUTH}/login`, {
          email: data.email,
          password: formData.password,
        })
          .then((res) => res.data)
          .then(({ token, refreshToken }) => {
            localStorage.setItem("moozikaToken", token);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("cart", JSON.stringify([]));
          });
      } catch (err) {
        message.error("Signup failed!");
        setIsLoading(false);
        return;
      }

      message.success("Signup successful!");

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      window.location.href = "https://deployement-testing-front.vercel.app/";
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFileName(event.target.files[0]);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2
        style={{
          marginBottom: "1rem",
          textAlign: "center",
          margin: 20,
          marginTop: 20,
        }}
      >
        Sign Up
      </h2>
      <Form>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            {...register("email")}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Full Name"
            {...register("fullName")}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          rules={[
            { required: true, message: "Please select your date of birth!" },
          ]}
        >
          <DatePicker
            placeholder="Date of Birth"
            style={{ width: "100%" }}
            {...register("dateOfBirth")}
            onChange={(date) => handleInputChange("dateOfBirth", date)}
          />
        </Form.Item>
        <Box textAlign="center" marginBottom="1rem">
          <MuiButton
            component="label"
            sx={{ color: "white", borderColor: "white" }}
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleChange} />
          </MuiButton>
          <Typography sx={{ color: "white", marginTop: "0.35rem" }}>
            {fileName?.name}
          </Typography>
        </Box>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password
            prefix={<UserOutlined />}
            placeholder="Password"
            {...register("password")}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="cPassword"
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<UserOutlined />}
            placeholder="Confirm Password"
            {...register("cPassword")}
            onChange={(e) => handleInputChange("cPassword", e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            onClick={onSubmit}
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
