import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import axios from "axios";

import { Form, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AlbumIcon from "@mui/icons-material/Album";
import ListAltIcon from "@mui/icons-material/ListAlt";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import TransitionsModal from "../modal/modal";
import { handleRequestWithToken } from "../../utils";
import { SongType } from "../../types";
import { useToken } from "../../hooks/useToken";
import { usePost } from "../../hooks/usePost";
import { ADMIN } from "../../constants";

const enumFields = [
  { field: "title", placeholder: "Song Title", Icon: <UserOutlined /> },
  { field: "album", placeholder: "Album Name", Icon: <UserOutlined /> },
  { field: "artist", placeholder: "Song Artist", Icon: <UserOutlined /> },
  { field: "year", placeholder: "Release Date", Icon: <CalendarMonthIcon /> },
  {
    field: "duration",
    placeholder: "Song Duration",
    Icon: <AvTimerIcon />,
  },
  { field: "price", placeholder: "Song Price", Icon: <AttachMoneyIcon /> },
  {
    field: "album_image",
    placeholder: "Album Image Url",
    Icon: <AlbumIcon />,
  },
  {
    field: "youtube_id",
    placeholder: "Song Id From Youtube",
    Icon: <YouTubeIcon />,
  },
  { field: "genre", placeholder: "Song Genre", Icon: <ListAltIcon /> },
];

type ModalType = {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  onSuccess: (song: SongType) => void;
};

const AddSong = ({ openModal, setOpenModal, onSuccess }: ModalType) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<SongType, "creator">>({
    title: "",
    album: "",
    artist: "",
    year: "",
    duration: 0,
    price: "",
    album_image: "",
    youtube_id: "",
    genre: "",
  });

  const onSubmit = async () => {
    const requiredFields = [
      "title",
      "album",
      "artist",
      "year",
      "duration",
      "price",
      "album_image",
      "youtube_id",
      "genre",
    ];
    const hasEmptyField = requiredFields.some((field) => !formData[field]);

    if (hasEmptyField) {
      message.error("Please fill in all required fields");
      return;
    }

    if (formData.duration && isNaN(formData.duration)) {
      message.error("Duration must be a number");
      return;
    }

    const decimalNumberRegex = /^\d+(\.\d+)?$/;
    if (formData.price && !decimalNumberRegex.test(formData.price)) {
      message.error("Price must be a number");
      return;
    }

    const yearRegex = /^[0-9\/\.\-]+$/;
    if (formData.year && !yearRegex.test(formData.year)) {
      message.error(
        "Year must be a number with that format: 00/00/0000 or 00.00.0000"
      );
      return;
    }

    const lettersRegex = /^[a-zA-Z]+$/;
    if (formData.genre && !lettersRegex.test(formData.genre)) {
      message.error("Genre must contain only letters and commas");
      return;
    }

    const youtubeVideoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (formData.youtube_id && !youtubeVideoIdRegex.test(formData.youtube_id)) {
      message.error("Youtube Id must be 11 characters long");
      return;
    }
    if (!handleRequestWithToken()) return navigate("/");

    const response = await usePost(`${ADMIN}/songs/create`, {
      song: formData,
      token: useToken(),
    });

    onSuccess(response.data);
    message.success("Song was successfully added");
    setOpenModal(false);
  };

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box>
      <TransitionsModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        title="Add Song"
      >
        <Form onFinish={handleSubmit(onSubmit)}>
          {enumFields.map(({ field, placeholder, Icon }) => (
            <Form.Item
              key={field}
              name={field}
              rules={[
                {
                  required: true,
                  message: `Please input ${placeholder}`,
                },
              ]}
            >
              <Input
                prefix={Icon}
                placeholder={placeholder}
                {...register(field)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(field, e.target.value)
                }
              />
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              color="primary"
              variant="contained"
              style={{
                width: "100%",
                backgroundColor: "#7A7A7A",
                marginTop: "1rem",
              }}
              onClick={onSubmit}
            >
              Add Song
            </Button>
          </Form.Item>
        </Form>
      </TransitionsModal>
    </Box>
  );
};

export default AddSong;
