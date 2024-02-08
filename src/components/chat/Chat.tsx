import { useEffect, useState } from "react";
import { PrettyChatWindow } from "react-chat-engine-pretty";
import axios from "axios";
import { UserType } from "../../types";
import { Box } from "@mui/material";
import { useToken } from "../../hooks/useToken";
import { USERS } from "../../constants";

const Chat = () => {
  const [userDetails, setUserDetails] = useState<UserType>();
  const token = useToken();
  if (!token) return null;

  useEffect(() => {
    axios
      .post(`${USERS}/user-details`, {
        token: token,
      })
      .then((res) => {
        setUserDetails(res.data);
      });
  }, []);

  return (
    userDetails && (
      <Box>
        <div
          style={{
            height: "100vh",
            overflowY: "hidden",
            marginBottom: "3.5rem",
          }}
        >
          <PrettyChatWindow
            projectId="0065a0fd-6a45-4e13-bb94-ddd7556671aa"
            username={userDetails.email} // adam
            secret={userDetails.email} // pass1234
            style={{ height: "100%" }}
          />
        </div>
      </Box>
    )
  );
};

export default Chat;

// import React from "react";

// const Chat = () => {
//   return <div>Chat</div>;
// };

// export default Chat;
