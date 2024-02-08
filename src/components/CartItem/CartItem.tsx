import React from "react";
import {Stack} from "@mui/material";
import classes from "./CartItem.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

type CartItemProps = {
  album_image: string;
  title: string;
  price: string;
  removeSong: () => void;
};

const CartItem = ({ album_image, title, price, removeSong }: CartItemProps) => {
  return (
    <Stack
      component="div"
      direction="row"
      height="6rem"
      marginTop="1rem"
      bgcolor="#202020"
      borderRadius="5px"
      marginRight="2rem"
    >
      <Stack>
        <img
          src={album_image}
          style={{
            height: "100%", 
            width: "100%",
            objectFit: "fill", 
            marginRight: "3rem",
            borderRadius: "5px 0px 0px 5px"
          }}
          alt={title}
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        padding="2rem"
      >
        <p className={classes.title}>{title}</p>
        <div className={classes.priceSection}>
          <p className={classes.priceText}>${price}</p>
          <IconButton aria-label="delete" onClick={removeSong}>
            <DeleteIcon
              style={{ color: "white" }}
              className={classes.trashIcon}
            />
          </IconButton>
        </div>
      </Stack>
    </Stack>
  );
};

export default CartItem;
