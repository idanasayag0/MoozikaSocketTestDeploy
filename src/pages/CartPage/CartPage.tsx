import React from "react";
import Cart from "../../components/Cart/Cart";
import { Box } from "@mui/material";
const CartPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3rem",
      }}
    >
      <Cart />
    </Box>
  );
};

export default CartPage;
