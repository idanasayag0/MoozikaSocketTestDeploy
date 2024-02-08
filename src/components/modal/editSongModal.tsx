import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { SongType } from "../../types";
import { handleRequestWithToken } from "../../utils";
import { useToken } from "../../hooks/useToken";
import { ADMIN } from "../../constants";
import Box from "@mui/material/Box";

type EditSongProps = {
  open: boolean;
  onClose: () => void;
  songDetails: SongType;
  onUpdate?: () => void;
  songId: string;
  creator: string;
};
const EditSongModal = ({
  open,
  onClose,
  songDetails,
  onUpdate,
  songId,
  creator,
}: EditSongProps) => {
  const [editedSong, setEditedSong] = useState({ ...songDetails });

  const navigate = useNavigate();

  useEffect(() => {
    setEditedSong({ ...songDetails });
  }, [songDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSong((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSong = async () => {
    if (!handleRequestWithToken()) return navigate("/");
    await axios
      .put(`${ADMIN}/songs/${songId}`, {
        token: useToken(),
        updatedSong: {
          title: editedSong.title,
          album: editedSong.album,
          artist: editedSong.artist,
          genre: editedSong.genre,
          year: editedSong.year,
          duration: editedSong.duration,
          price: editedSong.price,
          album_image: editedSong.album_image,
        },
        song: {
          creator: creator,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          message.success(response.data.message);
          setTimeout(() => {
            navigate(0);
          }, 1500);
        }
      })
      .catch((error) => {
        message.error(
          "error while edit song - call Yuval for backend complains "
        );
        console.error(error.error);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="div">
          Edit Song
        </Typography>
        {Object.keys(editedSong).map((field) => (
          <TextField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            value={editedSong[field]}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button variant="contained" onClick={handleEditSong}>
            Save Changes
          </Button>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditSongModal;
