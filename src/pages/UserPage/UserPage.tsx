import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader/loader";
import List from "../../components/list/List";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AddSong from "../../components/addSongModal/addSong";
import { Edit, EditRounded, Update } from "@mui/icons-material";
import { handleRequestWithToken } from "../../utils/index.js";
import { useNavigate } from "react-router-dom";
import { SongType } from "../../types/index";
import { useToken } from "../../hooks/useToken.js";
import { USERS } from "../../constants/index.jsx";
import { usePost } from "../../hooks/usePost.js";
import { Box, Typography, Avatar, Grid, TextField } from "@mui/material";

type UserType = {
  email: string;
  name: string;
  profile_image?: string;
  songs?: SongType[];
};
const UserPage = () => {
  const [user, setUser] = useState<UserType>({
    email: "Pleas sign in to see your profile",
    name: "",
    profile_image: "unKnown",
    songs: [],
  });
  const [songs, setSongs] = useState<SongType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [openAddSongModal, setOpenAddSongModal] = useState(false);
  const [isNameFormOpen, setIsNameFormOpen] = useState(false);
  const [ownSongs, setOwnSongs] = useState<SongType[]>([]);
  const navigate = useNavigate();

  // const [passwordForm, setPasswordForm] = useState({
  //     currentPassword: "",
  //     newPassword: "",
  //     confirmNewPassword: ""
  // });
  const [newName, setNewName] = useState({
    newName: "",
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setNewName((prevForm) => ({
      ...prevForm,
      newName: name,
    }));
  };

  const handleCloseForm = () => {
    setIsNameFormOpen(false);
  };
  const handleOpenForm = () => {
    setIsNameFormOpen(true);
  };

  const handleUpdatePassword = async () => {
    // if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    //   // Show an error message or handle password mismatch
    //   message.error("New password and confirmation do not match");
    //   return;
    // }
    // await axios
    //   .post("http://localhost:6969/auth/login", {
    //     email: user.email,
    //     password: passwordForm.currentPassword,
    //   })
    //   .then((res) => {
    //     if (res.status !== 200) {
    //       message.error("Wrong password");
    //       return;
    //     }
    //   })
    //   .then(
    //     await axios.put("http://localhost:6969/users", {
    //       token: localStorage.getItem("moozikaToken"),
    //       updatedUser: {
    //         password: passwordForm.newPassword,
    //         name: user.name,
    //         email: user.email,
    //       },
    //     })
    //   )
    //   .then((res) => {
    //     if (res.status === 200)
    //       message.success("Password updated successfully");
    //   })
    //   .catch((err) => {
    //     message.error("Error updating password");
    //   });
    // setPasswordForm({
    //   currentPassword: "",
    //   newPassword: "",
    //   confirmNewPassword: "",
    // });
    // setIsNameFormOpen(false);
  };

  const handleChangeName = async () => {
    if (!handleRequestWithToken()) return navigate("/");
    await axios
      .put(USERS, {
        token: useToken(),
        updatedUser: {
          name: newName.newName,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          message.success("the name was changed successfully");
          handleCloseForm();
          fetchUserData();
          setNewName({ newName: "" });
        }
      })
      .catch((err) => {
        message.error("Error updating name");
      });
  };

  const fetchUserData = async () => {
    try {
      if (!handleRequestWithToken()) return navigate("/");
      if (!localStorage.getItem("moozikaToken")) return;
      const myUser = await usePost(`${USERS}/user-details`, {
        token: useToken(),
      });
      setUser(myUser.data);
      setSongs(myUser.data.songs);
      setIsLoading(false);
      setOwnSongs(
        myUser.data.songs.filter(
          (song: SongType) => song.creator === myUser.data._id
        )
      );
    } catch (error) {
      console.error("Error fetching user data", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUserData();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleAddSong = () => {
    setOpenAddSongModal(true);
  };

  const handleAddSongSuccess = (newSong: SongType) => {
    setUser((prevUser) => ({
      ...prevUser,
      songs: [...prevUser.songs, newSong],
    }));
    setOwnSongs((prevSongs) => [...prevSongs, newSong]);
  };

  return (
    <Loader isLoading={isLoading}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <Avatar
          alt="Profile Picture"
          src={user.profile_image}
          sx={{ width: 100, height: 100, marginBottom: 4, marginTop: 4 }}
        />

        <Typography variant="h4" gutterBottom>
          {user.name}
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          gutterBottom
          sx={{ color: "white" }}
        >
          {user.email}
        </Typography>

        <Upload
          style={{ padding: "5rem" }}
          showUploadList={false}
          beforeUpload={(file) => {
            setNewProfilePicture(file);
            return false;
          }}
        >
          {/*<Button icon={<UploadOutlined/>} size="small" style={{marginBottom: "1rem"}}>*/}
          {/*    Change Profile Picture*/}
          {/*</Button>*/}
        </Upload>

        <Button
          style={{ display: "flex", alignItems: "center" }}
          icon={<Edit />}
          size="middle"
          onClick={handleOpenForm}
        >
          Change User Name
        </Button>
        <Button
          style={{ marginTop: "1rem" }}
          onClick={handleAddSong}
          color="primary"
        >
          Add Song
        </Button>

        {isNameFormOpen && (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                borderBottom: "2px solid white",
                display: "inline-block",
                whiteSpace: "nowrap",
                marginTop: 2,
                paddingRight: windowWidth <= 600 ? 10 : 90,
                paddingLeft: 3,
                fontWeight: "bold",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              Update Name
            </Typography>

            <form>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiFormLabel-root": {
                    color: "white",
                  },
                }}
              >
                <TextField
                  type="New Name"
                  name="New Name"
                  label="Enter The New Name..."
                  variant="outlined"
                  margin="normal"
                  value={newName.newName}
                  onChange={handleNameChange}
                  sx={{ width: "40%" }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 3,
                    marginBottom: 3,
                  }}
                >
                  <Button
                    onClick={handleChangeName}
                    style={{
                      marginRight: "1rem",
                      marginLeft: "1rem",
                    }}
                  >
                    Update Name
                  </Button>
                  <Button
                    onClick={handleCloseForm}
                    style={{
                      marginRight: "1rem",
                      marginLeft: "1rem",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        )}

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            borderBottom: "2px solid white",
            display: "inline-block",
            whiteSpace: "nowrap",
            marginTop: 7,
            paddingLeft: 3,
            fontWeight: "bold",
            color: "white",
            textTransform: "uppercase",
          }}
        >
          Songs Owned By User
        </Typography>
        <Grid marginTop="2rem">
          {user.songs.length > 0 ? (
            <List list={user.songs} />
          ) : (
            <Typography
              variant="h6"
              color="white"
              sx={{
                paddingLeft: 15,
                fontWeight: "bold",
                color: "white",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              No songs found. Start adding some amazing songs!
            </Typography>
          )}
        </Grid>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            borderBottom: "2px solid white",
            display: "inline-block",
            marginTop: 7,
            paddingLeft: 3,
            fontWeight: "bold",
            color: "white",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Songs created By User
        </Typography>

        <Grid marginTop="2rem">
          {ownSongs.length > 0 ? (
            <List list={ownSongs} />
          ) : (
            <Typography
              variant="h6"
              color="white"
              gutterBottom
              sx={{
                paddingLeft: 15,
                fontWeight: "bold",
                color: "white",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              No songs created by you. Be the first to create one!
            </Typography>
          )}
        </Grid>
        <AddSong
          openModal={openAddSongModal}
          setOpenModal={setOpenAddSongModal}
          onSuccess={handleAddSongSuccess}
        />
      </Box>
    </Loader>
  );
};

export default UserPage;
