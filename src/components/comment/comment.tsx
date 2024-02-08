import React from "react";
import axios from "axios";
import { handleRequestWithToken } from "../../utils";
import { useNavigate } from "react-router-dom";
import { CommentType } from "../../types";
import {
  Avatar,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { usePost } from "../../hooks/usePost";
import { USERS } from "../../constants";
import { useToken } from "../../hooks/useToken";

type CommentProps = {
  comment: string;
  date: string;
  _id: string;
  creator: string;
  func: (id: string) => void;
  editFunc: (id: string, comment: string) => void;
  user: {
    name: string;
    profile_image: string;
    _id: string;
  };
};

const Comment = ({
  comment,
  date,
  _id,
  creator,
  func: removeComment,
  editFunc: editComment,
  user: { name, profile_image, _id: userId },
}: CommentProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedComment, setEditedComment] = React.useState(comment);
  const [validate, setValidate] = React.useState(false);
  const navigate = useNavigate();

  const validateUser = async () => {
    const userToken = useToken();
    if (!handleRequestWithToken()) return navigate("/");
    if (!userToken) return;
    const { data } = await usePost(`${USERS}/user-details`, {
      token: userToken,
    });

    if (data._id === userId || data._id === creator) {
      setValidate(true);
    } else {
      setValidate(false);
    }
  };

  React.useEffect(() => {
    validateUser();
  }, []);

  return (
    <Paper
      elevation={3}
      style={{
        padding: "10px",
        marginBottom: "10px",
        wordBreak: "break-all",
        width: "100%",
        maxWidth: "40rem",
        minWidth: "10rem",
      }}
    >
      <Box display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <Avatar src={profile_image} alt="Avatar" />
          <Box marginLeft="1rem">
            <Typography variant="subtitle1" fontWeight="bold">
              {name}
            </Typography>

            {isEditing ? (
              <TextField
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                fullWidth
              />
            ) : (
              <Typography variant="body1">{comment}</Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" marginTop={1}>
          {validate && (
            <Box>
              <Button
                size="small"
                variant="text"
                color="error"
                onClick={() => removeComment(_id)}
              >
                Remove
              </Button>
              {true &&
                (isEditing ? (
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => {
                      editComment(_id, editedComment);
                      setIsEditing(false);
                    }}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ))}
            </Box>
          )}
          <Typography variant="caption" color="textSecondary" marginLeft="auto">
            {date}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Comment;
