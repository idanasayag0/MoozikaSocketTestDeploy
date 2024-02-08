import React, { ChangeEvent } from "react";
import Song from "../../components/Song/Song.tsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader/loader";
import List from "../../components/list/List";
import Comment from "../../components/comment/comment";
import { Button, Form, message } from "antd";
import { handleRequestWithToken } from "../../utils";
import { CommentType, SongType } from "../../types/index";
import { useToken } from "../../hooks/useToken";
import { COMMENTS, SONGS } from "../../constants/index.jsx";
import { Box, Typography } from "@mui/material";

const SongPage = () => {
  const { id } = useParams();
  const [song, setSong] = React.useState<SongType>();
  const [comments, setComments] = React.useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = React.useState(true);
  const [newComment, setNewComment] = React.useState("");
  const userToken = useToken();
  const navigate = useNavigate();

  const fetchSong = async () => {
    try {
      if (!handleRequestWithToken()) return navigate("/");
      const { data } = await axios.get(`${SONGS}/${id}`);
      setSong(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching song:", error);
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data: fetchedComments } = await axios.get(
        `${COMMENTS}/song/${id}`
      );
      setComments(fetchedComments.comments);
      setIsCommentsLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setIsCommentsLoading(false);
    }
  };

  const removeComment = async (id: string) => {
    setIsCommentsLoading(true);
    try {
      await axios.delete(`${COMMENTS}/${id}`);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error("Error removing comment:", error);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const editComment = async (id: string, editedComment: CommentType) => {
    try {
      setIsCommentsLoading(true);
      const { data } = await axios.put(`${COMMENTS}/${id}`, {
        comment: editedComment,
      });

      setComments((prev) =>
        prev.map((comment) => (comment._id === id ? data : comment))
      );

      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  React.useEffect(() => {
    setIsLoading(true);
    fetchSong();
    fetchComments();
  }, [id]);

  return (
    <Loader isLoading={isLoading}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          marginTop="2rem"
          sx={{ display: "block", justifyContent: "center" }}
        >
          <Box>
            <Song {...song} />
          </Box>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              overflowY: "auto",
              maxHeight: "50vh",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#6A6A6A",
                borderRadius: "4px",
              },
            }}
            marginTop="2rem"
            marginBottom="5rem"
          >
            <Loader isLoading={isCommentsLoading}>
              {comments.length > 0 ? (
                <List
                  creator={song.creator}
                  list={comments}
                  CardComponent={Comment}
                  flexDirection="column"
                  func={removeComment}
                  testFunc={editComment}
                />
              ) : (
                <Typography variant="h6" textAlign={"center"}>
                  No comments yet
                </Typography>
              )}
              {userToken && (
                <Form style={{ marginTop: "1rem" }}>
                  <Form.Item>
                    <textarea
                      placeholder="Add a comment..."
                      style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "1rem",
                        resize: "none",
                        height: "100px",
                        outline: "none",
                      }}
                      value={newComment}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewComment(e.target.value)
                      }
                    />
                  </Form.Item>
                  <Box
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                  >
                    <Form.Item>
                      <Button
                        textAlign={"center"}
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                          setIsCommentsLoading(true);
                          if (!handleRequestWithToken()) return navigate("/");
                          axios
                            .post(COMMENTS, {
                              token: userToken,
                              comment: newComment,
                              songId: id,
                            })
                            .then(() => {
                              fetchComments();
                              setNewComment("");
                            })
                            .catch((err) => {
                              message.error(
                                "Comment failed to post, minimum 3 characters required"
                              );
                            })
                            .finally(() => setIsCommentsLoading(false));
                        }}
                      >
                        Add Comment
                      </Button>
                    </Form.Item>
                  </Box>
                </Form>
              )}
            </Loader>
          </Box>
        </Box>
      </Box>
    </Loader>
  );
};

export default SongPage;
