import React from "react";
import useFetch from "../../hooks/useFetch.tsx";
import List from "../../components/list/List.tsx";
import Loader from "../../components/loader/loader.tsx";
import { SONGS } from "../../constants/index.jsx";
import { Box } from "@mui/material";
const HomePage = () => {
  const { data: songs, error, isLoading } = useFetch(SONGS);
  //TODO : send the data to context/redux, and handle error.
  return (
    <Box marginBottom="3.3rem">
      <Loader isLoading={isLoading}>
        <List list={songs} />
      </Loader>
    </Box>
  );
};

export default HomePage;
