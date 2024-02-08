import axios from "axios";
import { usePost } from "../hooks/usePost";
import { AUTH } from "../constants";

const handleRequestWithToken = async () => {
  const token = localStorage.getItem("moozikaToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!token || !refreshToken) return false;
  axios
    .post(`${AUTH}/check-token`, {
      token: token,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      axios
        .post(`${AUTH}/refresh-token`, {
          refreshToken: refreshToken,
        })
        .then((res) => {
          localStorage.setItem("moozikaToken", JSON.stringify(res.data.token));
          localStorage.setItem(
            "refreshToken",
            JSON.stringify(res.data.refreshToken)
          );
          return true;
        })
        .catch(() => {
          usePost(`${AUTH}/logout`, {
            refreshToken: refreshToken,
          });
          localStorage.removeItem("moozikaToken");
          localStorage.removeItem("refreshToken");
          // navigate to the homePage
          return false;
        });
    });
};

export { handleRequestWithToken };
