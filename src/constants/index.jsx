import { styled } from "@mui/material/styles";

import { Autocomplete } from "@mui/material";
export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiAutocomplete-inputRoot": {
    color: "inherit",
    backgroundColor: "#2A2A2A",
    borderRadius: "0.7rem",
    width: "20rem",
    border: "1px solid white", // Set the border color to white

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent !important", // Set the border color when focused
    },
  },
  "& .MuiAutocomplete-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "white", // Set the placeholder text color to white
  },
  "& .MuiInputLabel-root": {
    color: "white", // Set the label color to white
  },
  "& .MuiAutocomplete-clearIndicator, .MuiSvgIcon-root": {
    color: "white !important", // Set the arrow color to white
  },
}));

export const modalStyle = {
  position: "absolute",
  color: "white", // Text color
  backgroundColor: "#111111", // Background color
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: "24px", // Added "px" for boxShadow
  padding: "16px", // Added padding instead of "p"
};
// https://10.10.248.161:443
export const SERVER_URL = "https://10.10.248.161:443";
export const SERVER_PORT_URL = "http://localhost:7070";

export const AUTH = SERVER_URL + "/auth";
export const ADMIN = SERVER_URL + "/admin";
export const SONGS = SERVER_URL + "/songs";
export const USERS = SERVER_URL + "/users";
export const ORDERS = SERVER_URL + "/orders";
export const UPLOAD_FILES = SERVER_URL + "/uploadFiles";
export const COMMENTS = SERVER_URL + "/comments";
