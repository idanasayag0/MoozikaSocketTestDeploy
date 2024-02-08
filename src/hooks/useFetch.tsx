import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type FetchProps = {
  url: string;
};
const useFetch = (url) => {

  return useQuery({
    queryKey: ["fetchData"],
    queryFn: () => axios.get(url).then((res) => res.data)
  })

 
};

export default useFetch;
