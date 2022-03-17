import axios from "axios";
import type { AppContext } from "next/app";
import { ROOT_URL } from "../config";

export const ssrRequest = async (
  // ctx: AppContext["ctx"],
  url: string,
  jwt: string
) => {
  const options =
    typeof window === "undefined"
      ? {
          headers: {
            authorization: jwt,
          },
          withCredentials: true,
        }
      : {
          withCredentials: true,
          headers: {
            authorization: jwt,
          },
        };

  try {
    const { data } = await axios.get(ROOT_URL + url, options);

    return { data };
  } catch (error) {
    return { data: null };
  }
};
