import * as React from "react";

import {
  Box,
  Modal,
  Fade,
  Typography,
  Button,
  Container,
  IconButton,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";

import css from "./style.module.css";

import { modalStyle } from "../../constants";

type ModalProps = {
  children: React.ReactNode;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  title: string;
  closeOnOverlay?: boolean;
  btnText?: string;
  btnOnClick?: () => void;
};

export default function TransitionsModal({
  children,
  openModal,
  setOpenModal,
  title,
  closeOnOverlay,
  btnText,
  btnOnClick,
} : ModalProps) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={closeOnOverlay ? () => setOpenModal(false) : undefined}
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
              {title}
            </Typography>
            {children}
            {btnText && (
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={btnOnClick}
                  className={css["button"]}
                >
                  {btnText}
                </Button>
              </Container>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

/*
    Example when we want to call to modal. and we will pass the componenet with Children.
  const [openModal, setOpenModal] = React.useState(false);
  
            <TransitionsModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              title="title"
              closeOnOverlay={true}
              btnText="Close"
              btnOnClick={() => setOpenModal(false)}
            ></TransitionsModal>

*/
