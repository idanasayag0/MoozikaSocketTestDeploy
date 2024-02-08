// SignInModal.js
import React from "react";

import ClearIcon from "@mui/icons-material/Clear";
import css from "./style.module.css";
import { AUTH, modalStyle } from "../../constants";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { message } from "antd";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Modal,
  Fade,
  Typography,
  Button,
  Container,
  IconButton,
  TextField,
  Link,
} from "@mui/material";

type SignInModalProps = {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
};
export default function SignInModal({
  // eslint-disable-next-line react/prop-types
  openModal,
  setOpenModal,
}) {
  const [userNameAndPassword, setUserNameAndPassword] = React.useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await axios
      .post(`${AUTH}/login`, {
        email: userNameAndPassword.email,
        password: userNameAndPassword.password,
      })
      .then(async (userToken) => {
        localStorage.setItem("moozikaToken", userToken.data.token);
        localStorage.setItem("refreshToken", userToken.data.refreshToken);
        await axios
          .post(`${AUTH}/chatLogin`, {
            username: userNameAndPassword.email,
            secret: userNameAndPassword.email,
          })
          .catch((err) => {});

        message.success("Sign in success");
        localStorage.setItem("cart", JSON.stringify([]));
        setTimeout(() => {
          navigate(0);
        }, 1000);
        setOpenModal(false);
      })
      .catch((err) => {
        message.error("Sign in failed - wrong Email or password");
      });
  };
  const onSuccessFromGoogle = async (response) => {
    // localStorage.setItem("moozikaToken", response.accessToken);
    message.success("Google sign in success");
    setOpenModal(false);

    // Get user details from Google API
    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      }
    );

    const userData = await googleResponse.data;

    // Now you have additional user information in the `userData` object
    const { email, name, picture } = userData;

    await axios
      .post(`${AUTH}/google-login`, {
        name: userData.name,
        email: userData.email,
        profile_image: userData.picture,
      })
      .then(async (res) => {
        localStorage.setItem("moozikaToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("cart", JSON.stringify([]));
        await axios
          .post(`${AUTH}/chatLogin`, {
            username: userData.email,
            secret: userData.email,
          })
          .catch(async (err) => {
            await axios
              .post(`${AUTH}/chatRegister`, {
                username: userData.email,
                secret: userData.email,
                email: userData.email,
                first_name: userData.name,
                last_name: userData.email,
              })
              .catch((err) => {});
          });
      })
      .catch((err) => {});

    setTimeout(() => {
      window.location.href = "https://deployement-testing-front.vercel.app/";
    }, 300);
  };
  const onFailure = (response) => {
    message.error("Google sign in failure");
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box sx={modalStyle}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setOpenModal(false)}
              aria-label="close"
              sx={{ position: "absolute", top: "8px", right: "8px" }}
            >
              <ClearIcon />
            </IconButton>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              Sign In
            </Typography>
            <Container>
              <TextField
                value={userNameAndPassword.email}
                onChange={(e) =>
                  setUserNameAndPassword({
                    ...userNameAndPassword,
                    email: e.target.value,
                  })
                }
                label="Username"
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                InputProps={{
                  style: { color: "white" },
                }}
                InputLabelProps={{
                  style: { color: "white" },
                }}
              />
              <TextField
                value={userNameAndPassword.password}
                onChange={(e) =>
                  setUserNameAndPassword({
                    ...userNameAndPassword,
                    password: e.target.value,
                  })
                }
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                type="password"
                InputProps={{
                  style: { color: "white" },
                  // notchedOutline: { borderColor: "white" },
                }}
                InputLabelProps={{
                  style: { color: "white" },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSignIn}
                className={css["button"]}
                fullWidth
              >
                Sign In
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{ marginTop: 2, color: "white" }}
              >
                Don't have an account?{" "}
                <Link href="/signup" underline="always" color="primary">
                  Sign Up
                </Link>
              </Typography>

              <GoogleLogin
                clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
                onSuccess={onSuccessFromGoogle}
                onFailure={onFailure}
                cookiePolicy="single_host_origin"
                className={css["googleButton"]}
                render={(renderProps) => (
                  <Button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className={css["googleButton"]}
                    fullWidth
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google logo"
                      style={{
                        marginRight: "10px",
                        alignItems: "center",
                        width: "20px",
                        height: "20px",
                        justifyContent: "center",
                      }}
                    />
                    <span>Sign In with Google</span>
                  </Button>
                )}
              />
            </Container>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
