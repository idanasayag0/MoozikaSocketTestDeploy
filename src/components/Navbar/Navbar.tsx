import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  TextField,
} from "@mui/material";
import {
  AUTH,
  SERVER_PORT_URL,
  SONGS,
  StyledAutocomplete,
  USERS,
} from "../../constants/index";
import axios from "axios";
import MoozikaLogo from "../moozikaLogo/MoozikaLogo";
import SignInModal from "../modal/SignInModal";

import useFetch from "../../hooks/useFetch";
import css from "./styles.module.css";
import Chat from "../chat/Chat";
import { message } from "antd";

import io from "socket.io-client";
import { handleRequestWithToken } from "../../utils/index.js";
import { SongType } from "../../types/index";
import { useToken } from "../../hooks/useToken";
import { usePost } from "../../hooks/usePost";

const socket = io(SERVER_PORT_URL);

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = React.useState(false);
  const [cart, setCart] = useState(0);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const navigate = useNavigate();
  const { data } = useFetch(SONGS);
  const top100Films =
    data != null
      ? data.map((song: SongType) => ({ title: song.title, _id: song._id }))
      : [];

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const getCartSize = () => {
    const currentCart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (currentCart) {
      setCart(currentCart.length);
    } else {
      setCart(0);
    }
  };

  async function checkLoggedIn() {
    if (!localStorage.getItem("moozikaToken")) {
      return setIsLoggedIn(false);
    }

    try {
      if (!handleRequestWithToken()) return navigate("/");
      const response = await usePost(`${USERS}/user-details`, {
        token: useToken(),
      });
      if (response.status !== 200) {
        message.error("You must be logged in before accessing this page");
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
    } catch (error) {
      // message.error("You must be logged in before accessing this page");
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    checkLoggedIn();
    getCartSize();

    socket.on("cart", ({ cart, token, numberInCart }) => {
      if (token === useToken()) {
        setCart(numberInCart);
      }
    });
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSignInButtonClick = () => {
    setIsSignInModalOpen(true);
    handleMobileMenuClose(); // Close mobile menu after clicking
  };

  const handleLogOut = async () => {
    localStorage.removeItem("moozikaToken");
    navigate("/");
    await usePost(`${AUTH}/logout`, {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    localStorage.removeItem("refreshToken");
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isLoggedIn && (
        <Box>
          <MenuItem
            onClick={() => {
              setIsChatOpen(true);
              handleMobileMenuClose();
              navigate("/chat");
            }}
          >
            <IconButton sx={{ color: "black" }}>
              <ChatIcon />
            </IconButton>
            <p>Chat</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/cart");
              handleMobileMenuClose();
            }}
          >
            <IconButton size="large" color="inherit">
              {cart ? (
                <Badge badgeContent={cart} color="error">
                  <ShoppingCartIcon />
                </Badge>
              ) : (
                <ShoppingCartIcon />
              )}
            </IconButton>
            <p>Cart</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              navigate("/profile");
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsLoggedIn(false);
              handleMobileMenuClose();
              handleLogOut();
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <LogoutIcon />
            </IconButton>
            <p>Logout</p>
          </MenuItem>
        </Box>
      )}

      {!isLoggedIn && (
        <MenuItem onClick={handleSignInButtonClick}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <Typography>Login</Typography>
          </IconButton>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#1A1A1A",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              className={css["moozika-logo"]}
              onClick={() => navigate("/")}
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <MoozikaLogo />
            </Typography>
            <StyledAutocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              getOptionLabel={(option: { title: string }) => option.title}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search..." />
              )}
              onChange={(e, value) => {
                value
                  ? navigate(`/song/${(value as { _id: string })._id}`)
                  : "";
              }}
            ></StyledAutocomplete>
            {isLoggedIn ? (
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton onClick={() => navigate("/chat")}>
                  <ChatIcon sx={{ color: "white" }} />
                </IconButton>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => navigate("/cart")}
                >
                  {cart ? (
                    <Badge badgeContent={cart} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  ) : (
                    <ShoppingCartIcon />
                  )}
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle onClick={() => navigate("/profile")} />
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  color="inherit"
                  onClick={() => {
                    setIsLoggedIn(false);
                    handleLogOut();
                  }}
                >
                  <Typography>Logout</Typography>
                </IconButton>
              </Box>
            ) : (
              <MenuItem
                onClick={handleSignInButtonClick}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Login
              </MenuItem>
            )}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </Box>
      <main style={{ flex: "1" }}>
        <Outlet />
      </main>
      <SignInModal
        openModal={isSignInModalOpen}
        setOpenModal={setIsSignInModalOpen}
      />
      {/* <Chat isOpen={isChatOpen} handleOpen={() => setIsChatOpen(false)} /> */}
    </div>
  );
}
