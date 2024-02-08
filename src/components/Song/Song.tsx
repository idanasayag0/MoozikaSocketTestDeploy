import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import CheckIcon from "@mui/icons-material/Check";
import Loader from "../loader/loader";
import Box from "@mui/material/Box";
import { message } from "antd";

import io from "socket.io-client";
import { handleRequestWithToken } from "../../utils";
import { SongType, UserType } from "../../types/index";
import { useToken } from "../../hooks/useToken.js";
import { usePost } from "../../hooks/usePost.js";
import { SERVER_PORT_URL, USERS } from "../../constants/index.jsx";
const socket = io(SERVER_PORT_URL);

function Song({
  title,
  artist,
  album,
  genre,
  year,
  duration,
  price,
  album_image,
  youtube_id,
}: SongType) {
  const [user, setUser] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSongExist, setIsSongExist] = useState(false);
  const [isSongInCart, setIsSongInCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id: songId } = useParams();
  const songDurationInSeconds = duration / 1000;
  const minutes = parseInt(songDurationInSeconds / 60).toFixed(0);
  const seconds = parseInt(songDurationInSeconds % 60).toFixed(0);
  const songDuration = `${Number(minutes) > 9 ? minutes : "0" + minutes}:${
    Number(seconds) > 9 ? seconds : "0" + seconds
  }`;
  const navigate = useNavigate();
  function addToCartHandler() {
    if (!isLoggedIn) {
      message.error("You must be logged in before adding to cart");
      return;
    }
    if (
      localStorage.getItem("cart") &&
      localStorage.getItem("cart").length === 0
    ) {
      localStorage.setItem("cart", JSON.stringify([songId]));
    } else {
      const cart = JSON.parse(localStorage.getItem("cart"));
      cart.push(songId);
      if (!handleRequestWithToken()) return navigate("/");
      socket.emit("cart", {
        token: useToken(),
        cart: cart,
        numberInCart: cart.length,
      });

      localStorage.setItem("cart", JSON.stringify(cart));
    }
    setIsSongInCart(true);
    message.success("Song added to cart");
  }

  const getUser = async () => {
    setIsLoading(true);
    const userToken = useToken();
    if (!userToken) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }
    if (!handleRequestWithToken()) return navigate("/");
    const { data } = await usePost(`${USERS}/user-details`, {
      token: userToken,
    });
    setUser(data);
    setIsLoggedIn(true);
    setIsLoading(false);
  };

  const checkSongInCart = () => {
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    setIsSongInCart(cart?.find((id) => id == songId) ? true : false);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setIsSongExist(
      user?.songs?.find((song) => song._id === songId) ? true : false
    );
    checkSongInCart();
  }, [user]);

  return (
    <Box>
      <Card
        sx={{
          display: "flex",
          backgroundColor: "#1A1A1A",
          maxWidth: "800px",
          height: "auto",
          borderRadius: "20px",
          flexDirection: "column",
          "@media (min-width:600px)": {
            flexDirection: "row",
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            objectFit: "cover",
            borderRadius: "20px 20px 0 0",
            "@media (min-width:600px)": {
              width: "50%",
              borderRadius: "20px 0 0 20px",
            },
          }}
          image={album_image}
          alt="Album Cover"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            flex: "1 0 auto",
            justifyContent: "center",
            textAlign: "center",
            "@media (min-width:600px)": {
              justifyContent: "flex-start",
              textAlign: "left",
            },
          }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h5"
              color="#d6d6d6"
              marginTop="10px"
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="#b8b8b8"
              component="div"
              marginTop="20px"
            >
              {artist}
            </Typography>
            <Typography variant="subtitle1" color="#b8b8b8" component="div">
              {genre}
            </Typography>
            <Typography variant="subtitle1" color="#b8b8b8" component="div">
              {year}
            </Typography>
            <Typography variant="subtitle1" color="#b8b8b8" component="div">
              {songDuration}
            </Typography>
            <Typography variant="subtitle1" color="#b8b8b8" component="div">
              {album}
            </Typography>
            <Loader isLoading={isLoading}>
              {isSongExist && (
                <Box sx={{ "@media (max-width:959px)": { marginTop: "3rem" } }}>
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${youtube_id}`}
                    controls={true}
                    width="100%"
                    height="50%"
                  />
                </Box>
              )}
              {!isSongExist && isSongInCart && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5rem",
                    "@media (max-width:959px)": {
                      justifyContent: "center",
                      textAlign: "center",
                    },
                    "@media (min-width:600px)": {
                      justifyContent: "flex-end",
                      textAlign: "right",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="#b8b8b8"
                    component="div"
                    marginRight="10px"
                  >
                    This song is in the shopping cart
                  </Typography>
                  <CheckIcon sx={{ color: "green" }} />
                </Box>
              )}
              {!isSongExist && !isSongInCart && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5rem",
                    "@media (max-width:959px)": {
                      justifyContent: "center",
                      textAlign: "center",
                    },
                    "@media (min-width:600px)": {
                      justifyContent: "flex-end",
                      textAlign: "right",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="#b8b8b8"
                    component="div"
                    marginRight="10px"
                  >
                    ${price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "30px",
                      backgroundColor: "#353839",
                      color: "#d6d6d6",
                      border: "1px solid #fff",
                      "&:hover": {
                        backgroundColor: "#d6d6d6",
                        color: "black",
                      },
                    }}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                </Box>
              )}
            </Loader>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default Song;
